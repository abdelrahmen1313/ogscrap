var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as cheerio from "cheerio";
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
var purifyWindow = new JSDOM("").window;
var DOMPurify = createDOMPurify(purifyWindow);
function cleanText(value) {
    return (value !== null && value !== void 0 ? value : "").replace(/\s+/g, " ").trim();
}
function sanitizePlainText(value) {
    var sanitized = DOMPurify.sanitize(value !== null && value !== void 0 ? value : "", {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
    return cleanText(sanitized);
}
function firstNonEmpty(values) {
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        var cleaned = sanitizePlainText(value);
        if (cleaned)
            return cleaned;
    }
    return "";
}
function toAbsoluteUrl(baseUrl, maybeUrl) {
    var value = sanitizePlainText(maybeUrl);
    if (!value)
        return "";
    try {
        return new URL(value, baseUrl).toString();
    }
    catch (_a) {
        return "";
    }
}
function getMainText($) {
    var candidates = [
        $("main article").first().text(),
        $("article").first().text(),
        $("main").first().text(),
    ];
    return sanitizePlainText(candidates.find(function (v) { return sanitizePlainText(v); }));
}
function getMainImage($, url) {
    var imageSrc = firstNonEmpty([
        $("main article img").first().attr("src"),
        $("article img").first().attr("src"),
        $("main img").first().attr("src"),
        $("img").first().attr("src"),
    ]);
    return toAbsoluteUrl(url, imageSrc);
}
function getTitle($) {
    return firstNonEmpty([
        $('meta[name="title"]').attr("content"),
        $('meta[name="twitter:title"]').attr("content"),
        $('meta[property="og:title"]').attr("content"),
        $("title").first().text(),
        $("h1").first().text(),
    ]);
}
function getDescription($) {
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
function getImage($, url) {
    var metaImage = firstNonEmpty([
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
export function fetchPageMetadata(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, html, $, title, descriptionFromMeta, mainText, description, image;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url, {
                        headers: {
                            "user-agent": "Mozilla/5.0 (compatible; page-metadata/1.0)",
                            accept: "text/html,application/xhtml+xml",
                            referrerPolicy: "no-referrer"
                        },
                    })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Failed to fetch ".concat(url, ": ").concat(response.status, " ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    html = _a.sent();
                    $ = cheerio.load(html);
                    title = getTitle($);
                    descriptionFromMeta = getDescription($);
                    mainText = getMainText($);
                    description = sanitizePlainText(descriptionFromMeta || mainText.slice(0, 300));
                    image = getImage($, url) || getMainImage($, url);
                    return [2 /*return*/, {
                            url: toAbsoluteUrl(url, url),
                            title: sanitizePlainText(title),
                            description: description,
                            image: sanitizePlainText(image),
                        }];
            }
        });
    });
}
