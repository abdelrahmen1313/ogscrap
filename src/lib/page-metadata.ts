import * as cheerio from "cheerio";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

export type PageMetadata = {
  url: string;
  title: string;
  description: string;
  image: string;
};

const purifyWindow = new JSDOM("").window;
const DOMPurify = createDOMPurify(purifyWindow as typeof purifyWindow);

function cleanText(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function sanitizePlainText(value: string | undefined): string {
  const sanitized = DOMPurify.sanitize(value ?? "", {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
  return cleanText(sanitized);
}

function firstNonEmpty(values: Array<string | undefined>): string {
  for (const value of values) {
    const cleaned = sanitizePlainText(value);
    if (cleaned) return cleaned;
  }
  return "";
}

function toAbsoluteUrl(baseUrl: string, maybeUrl: string | undefined): string {
  const value = sanitizePlainText(maybeUrl);
  if (!value) return "";
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
}

function getMainText($: cheerio.CheerioAPI): string {
  const candidates = [
    $("main article").first().text(),
    $("article").first().text(),
    $("main").first().text(),
  ];
  return sanitizePlainText(candidates.find((v) => sanitizePlainText(v)));
}

function getMainImage($: cheerio.CheerioAPI, url: string): string {
  const imageSrc = firstNonEmpty([
    $("main article img").first().attr("src"),
    $("article img").first().attr("src"),
    $("main img").first().attr("src"),
    $("img").first().attr("src"),
  ]);
  return toAbsoluteUrl(url, imageSrc);
}

function getTitle($: cheerio.CheerioAPI): string {
  return firstNonEmpty([
    $('meta[name="title"]').attr("content"),
    $('meta[name="twitter:title"]').attr("content"),
    $('meta[property="og:title"]').attr("content"),
    $("title").first().text(),
    $("h1").first().text(),
  ]);
}

function getDescription($: cheerio.CheerioAPI): string {
  return firstNonEmpty([
    $('meta[name="description"]').attr("content"),
    $('meta[name="twitter:description"]').attr("content"),
    $('meta[property="og:description"]').attr("content"),
    $("meta[name='description']").first().attr("content"),
    $("meta[name='twitter:description']").first().attr("content"),
    $("meta[property='og:description']").first().attr("content"),
    $("p").first().text(),
  ]);
}

function getImage($: cheerio.CheerioAPI, url: string): string {
  const metaImage = firstNonEmpty([
    $('meta[name="image"]').attr("content"),
    $('meta[property="og:image"]').attr("content"),
    $('meta[name="twitter:image"]').attr("content"),
    $('link[rel="image_src"]').attr("href"),
    $("img").first().attr("src"),
    $('link[rel="apple-touch-icon"]').attr("href"),
    $('link[rel="icon"]').attr("href"),
  ]);
  return toAbsoluteUrl(url, metaImage);
}

export async function fetchPageMetadata(url: string): Promise<PageMetadata> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; page-metadata/1.0)",
      accept: "text/html,application/xhtml+xml",
      referrerPolicy: "no-referrer"
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title = getTitle($);
  const descriptionFromMeta = getDescription($);
  const mainText = getMainText($);
  const description = sanitizePlainText(descriptionFromMeta || mainText.slice(0, 300));
  const image = getImage($, url) || getMainImage($, url);

  return {
    url: toAbsoluteUrl(url, url),
    title: sanitizePlainText(title),
    description,
    image: sanitizePlainText(image),
  };
}
