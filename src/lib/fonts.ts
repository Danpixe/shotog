import InterRegular from "../fonts/Inter-Regular.ttf";
import InterBold from "../fonts/Inter-Bold.ttf";

function ensureArrayBuffer(data: unknown): ArrayBuffer {
  if (data instanceof ArrayBuffer) return data;
  if (ArrayBuffer.isView(data)) {
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  }
  return data as ArrayBuffer;
}

export type SatoriFont = {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
};

/** Default Inter fonts -- always available, zero latency. */
export function getFonts(): SatoriFont[] {
  return [
    {
      name: "Inter",
      data: ensureArrayBuffer(InterRegular),
      weight: 400,
      style: "normal",
    },
    {
      name: "Inter",
      data: ensureArrayBuffer(InterBold),
      weight: 700,
      style: "normal",
    },
  ];
}

const MAX_FONT_SIZE = 5 * 1024 * 1024; // 5MB
const FONT_CACHE_TTL = 3600; // 1 hour

/** Validate font file by magic bytes. Returns format or null. */
function detectFontFormat(buffer: ArrayBuffer): "ttf" | "otf" | null {
  if (buffer.byteLength < 4) return null;
  const bytes = new Uint8Array(buffer, 0, 4);
  // TTF: 00 01 00 00
  if (bytes[0] === 0x00 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00) {
    return "ttf";
  }
  // OTF: 4F 54 54 4F ("OTTO")
  if (bytes[0] === 0x4f && bytes[1] === 0x54 && bytes[2] === 0x54 && bytes[3] === 0x4f) {
    return "otf";
  }
  return null;
}

/**
 * Fetch a custom font from a URL with Cache API caching.
 *
 * Flow:
 * 1. Check Workers Cache API (fast, in-region)
 * 2. On miss: fetch font from URL, validate magic bytes + size
 * 3. Cache the font binary via Workers Cache API (1 hour TTL)
 *
 * Returns null on any error (caller falls back to Inter).
 */
export async function fetchCustomFont(
  fontUrl: string,
  ctx?: ExecutionContext
): Promise<SatoriFont[] | null> {
  // Basic URL validation
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(fontUrl);
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      return null;
    }
  } catch {
    return null;
  }

  const cacheKey = `https://shotog.com/_internal/font-url-cache/${encodeURIComponent(fontUrl)}`;
  const cache = caches.default;

  // 1. Try cache
  try {
    const cached = await cache.match(cacheKey);
    if (cached) {
      const buffer = await cached.arrayBuffer();
      if (detectFontFormat(buffer)) {
        return [
          { name: "Custom", data: buffer, weight: 400, style: "normal" },
        ];
      }
      // Cached data was corrupt -- fall through to re-fetch
    }
  } catch {
    // Cache read error -- fall through
  }

  // 2. Fetch from URL
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(fontUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "ShotOG/0.5" },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    // Check Content-Length header before downloading body (if available)
    const contentLength = res.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_FONT_SIZE) {
      return null;
    }

    const buffer = await res.arrayBuffer();

    // Validate size
    if (buffer.byteLength > MAX_FONT_SIZE) return null;

    // Validate magic bytes
    const format = detectFontFormat(buffer);
    if (!format) return null;

    // 3. Cache via Workers Cache API (non-blocking)
    if (ctx) {
      ctx.waitUntil(
        cache.put(
          cacheKey,
          new Response(buffer, {
            headers: {
              "Content-Type": "application/octet-stream",
              "Cache-Control": `public, max-age=${FONT_CACHE_TTL}`,
            },
          })
        ).catch(() => {})
      );
    }

    return [
      { name: "Custom", data: buffer, weight: 400, style: "normal" },
    ];
  } catch {
    return null;
  }
}
