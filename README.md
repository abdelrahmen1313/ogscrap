# ogscrap

Lightweight utility to fetch a web page and extract clean metadata.

It returns a simple JSON object with:

- `url`
- `title`
- `description`
- `image`

## Install

```bash
 npm install ogscrap
```

## Usage

```ts
import { fetchPageMetadata } from "ogscrap";

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
