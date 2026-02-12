export type Template =
  | "basic"
  | "blog"
  | "product"
  | "social"
  | "event"
  | "changelog"
  | "testimonial"
  | "announcement";

export type Format = "png" | "svg";

export interface OGImageOptions {
  /** Template name */
  template?: Template;
  /** Main title (required) */
  title: string;
  /** Subtitle text */
  subtitle?: string;
  /** Small text above title (e.g. "NEW", "Blog", category) */
  eyebrow?: string;
  /** Author name */
  author?: string;
  /** Domain watermark */
  domain?: string;
  /** Background color (hex) */
  bgColor?: string;
  /** Text color (hex) */
  textColor?: string;
  /** Accent color (hex) */
  accentColor?: string;
  /** Output format */
  format?: Format;
  /** Image width (200-2400, default 1200) */
  width?: number;
  /** Image height (200-1260, default 630) */
  height?: number;
}

export interface ShotOGConfig {
  /** API key (sk_...). Optional for demo mode (10/day limit). */
  apiKey?: string;
  /** Base URL of the ShotOG API. Defaults to https://shotog.2214962083.workers.dev */
  baseUrl?: string;
}

export interface UsageResponse {
  key_id: string;
  name: string;
  tier: string;
  monthly_limit: number;
  period: string;
  usage: {
    billable_requests: number;
    cached_requests: number;
    failed_requests: number;
    remaining: number;
  };
}

export interface CreateKeyResponse {
  id: string;
  key: string;
  tier: string;
  monthly_limit: number;
  message: string;
}

export interface TemplatesResponse {
  templates: string[];
  docs: string;
}

const DEFAULT_BASE_URL = "https://shotog.2214962083.workers.dev";

export class ShotOG {
  private apiKey?: string;
  private baseUrl: string;

  constructor(config: ShotOGConfig = {}) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
  }

  /**
   * Generate an OG image URL. Does NOT make a network request.
   * Use this to embed in <meta property="og:image"> tags.
   */
  url(options: OGImageOptions): string {
    const params = new URLSearchParams();
    params.set("title", options.title);
    if (options.template) params.set("template", options.template);
    if (options.subtitle) params.set("subtitle", options.subtitle);
    if (options.eyebrow) params.set("eyebrow", options.eyebrow);
    if (options.author) params.set("author", options.author);
    if (options.domain) params.set("domain", options.domain);
    if (options.bgColor) params.set("bgColor", options.bgColor);
    if (options.textColor) params.set("textColor", options.textColor);
    if (options.accentColor) params.set("accentColor", options.accentColor);
    if (options.format) params.set("format", options.format);
    if (options.width) params.set("width", String(options.width));
    if (options.height) params.set("height", String(options.height));
    if (this.apiKey) params.set("api_key", this.apiKey);
    return `${this.baseUrl}/v1/og?${params.toString()}`;
  }

  /**
   * Generate an OG image and return the binary data.
   * Makes a network request to the ShotOG API.
   */
  async generate(options: OGImageOptions): Promise<ArrayBuffer> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      headers["X-Api-Key"] = this.apiKey;
    }

    const res = await fetch(`${this.baseUrl}/v1/og`, {
      method: "POST",
      headers,
      body: JSON.stringify(options),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(
        `ShotOG API error (${res.status}): ${(error as any).error || res.statusText}`
      );
    }

    return res.arrayBuffer();
  }

  /**
   * List available templates.
   */
  async templates(): Promise<TemplatesResponse> {
    const res = await fetch(`${this.baseUrl}/v1/og/templates`);
    if (!res.ok) throw new Error(`Failed to fetch templates: ${res.statusText}`);
    return res.json() as Promise<TemplatesResponse>;
  }

  /**
   * Get current usage stats for the configured API key.
   * Requires an API key to be set.
   */
  async usage(): Promise<UsageResponse> {
    if (!this.apiKey) throw new Error("API key required for usage stats");

    const res = await fetch(`${this.baseUrl}/v1/keys/usage`, {
      headers: { "X-Api-Key": this.apiKey },
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(
        `Usage API error (${res.status}): ${(error as any).error || res.statusText}`
      );
    }
    return res.json() as Promise<UsageResponse>;
  }

  /**
   * Create a new API key (self-service).
   */
  static async createKey(
    email: string,
    options: { baseUrl?: string; name?: string } = {}
  ): Promise<CreateKeyResponse> {
    const base = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
    const res = await fetch(`${base}/v1/keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: options.name }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(
        `Create key error (${res.status}): ${(error as any).error || res.statusText}`
      );
    }
    return res.json() as Promise<CreateKeyResponse>;
  }
}

export default ShotOG;
