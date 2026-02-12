# shotog

TypeScript SDK for [ShotOG](https://github.com/nicepkg/shotog) — generate beautiful OG images with one API call.

## Install

```bash
npm install shotog
```

## Quick Start

```typescript
import { ShotOG } from "shotog";

const og = new ShotOG({ apiKey: "sk_your_key" });

// Generate a URL (no network request — use in <meta> tags)
const imageUrl = og.url({
  title: "My Blog Post",
  template: "blog",
  subtitle: "A great read",
  author: "Jane Doe",
});
// => https://shotog.2214962083.workers.dev/v1/og?title=My+Blog+Post&...

// Generate image binary (makes API call)
const imageBuffer = await og.generate({
  title: "Hello World",
  template: "basic",
});
```

## Templates

8 built-in templates: `basic`, `blog`, `product`, `social`, `event`, `changelog`, `testimonial`, `announcement`.

```typescript
// List available templates
const { templates } = await og.templates();
console.log(templates);
// => ["basic", "blog", "product", "social", "event", "changelog", "testimonial", "announcement"]
```

## API Key

```typescript
// Create a free API key (500 images/month)
const { key } = await ShotOG.createKey("you@example.com");
console.log(key); // sk_...

// Check usage
const og = new ShotOG({ apiKey: key });
const usage = await og.usage();
console.log(usage.usage.remaining); // 497
```

## All Options

```typescript
og.url({
  title: "Required title",     // Required
  template: "blog",            // basic|blog|product|social|event|changelog|testimonial|announcement
  subtitle: "Optional",        // Subtitle text
  eyebrow: "NEW",             // Small text above title
  author: "Jane Doe",         // Author name
  domain: "example.com",      // Domain watermark
  bgColor: "#667eea",         // Background color (hex)
  textColor: "#ffffff",        // Text color (hex)
  accentColor: "#764ba2",     // Accent color (hex)
  format: "png",              // png or svg
  width: 1200,                // 200-2400
  height: 630,                // 200-1260
});
```

## Demo Mode

No API key? ShotOG works in demo mode with a 10 requests/day limit:

```typescript
const og = new ShotOG(); // No API key
const url = og.url({ title: "Demo Mode Works!" });
```

## License

MIT
