import type { OGImageParams } from "../types";
import { getFonts, fetchCustomFont, type SatoriFont } from "./fonts";
import { getTemplate } from "../templates";
import { fetchImageAsDataUri } from "./image";

export async function renderOGImage(
  params: OGImageParams,
  ctx?: ExecutionContext
): Promise<{
  data: ArrayBuffer;
  contentType: string;
  fontFallback: boolean;
  timings: { svgMs: number; pngMs: number; totalMs: number };
}> {
  const start = Date.now();
  const format = params.format || "png";
  const width = params.width || 1200;
  const height = params.height || 630;

  // Pre-fetch external images in parallel
  const [avatarDataUri, logoDataUri] = await Promise.all([
    params.avatar ? fetchImageAsDataUri(params.avatar) : null,
    params.logo ? fetchImageAsDataUri(params.logo) : null,
  ]);
  params._avatarDataUri = avatarDataUri;
  params._logoDataUri = logoDataUri;

  // Resolve fonts: custom URL if provided, otherwise Inter
  let fonts: SatoriFont[] = getFonts();
  let fontFallback = false;

  if (params.fontUrl) {
    try {
      const customFonts = await fetchCustomFont(params.fontUrl, ctx);
      if (customFonts && customFonts.length > 0) {
        fonts = customFonts;
      } else {
        fontFallback = true;
      }
    } catch {
      fontFallback = true;
    }
  }

  const satori = (await import("@cf-wasm/satori")).default;
  const template = getTemplate(params);

  const svg = await satori(template, {
    width,
    height,
    fonts,
  });

  const svgMs = Date.now() - start;

  if (format === "svg") {
    return {
      data: new TextEncoder().encode(svg).buffer as ArrayBuffer,
      contentType: "image/svg+xml",
      fontFallback,
      timings: { svgMs, pngMs: 0, totalMs: svgMs },
    };
  }

  const pngStart = Date.now();
  const { Resvg } = await import("@cf-wasm/resvg");
  const resvg = await Resvg.async(svg, { fitTo: { mode: "width" as const, value: width } });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  const pngMs = Date.now() - pngStart;

  return {
    data: pngBuffer.buffer as ArrayBuffer,
    contentType: "image/png",
    fontFallback,
    timings: { svgMs, pngMs, totalMs: Date.now() - start },
  };
}
