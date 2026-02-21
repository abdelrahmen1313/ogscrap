# ogscrap

Lightweight utility to fetch a web page and extract clean metadata.

It returns a simple JSON object with:

- `url`
- `title`
- `description`
- `image`

## Install

```bash
npm install
```

## Usage

```ts
import { fetchPageMetadata } from "./app/page-metadata";

const data = await fetchPageMetadata("https://example.com/post");
console.log(data);
```

Response shape:

```json
{
  "url": "https://example.com/post",
  "title": "Page title",
  "description": "Short summary about the content",
  "image": "https://example.com/image.jpg"
}
```

## Local Example

You can run the sample in `app/example.ts` (depending on your TS runtime setup):

```ts
import { fetchPageMetadata } from "./page-metadata";

const data = await fetchPageMetadata("https://example.com/post");
console.log(data);
```
