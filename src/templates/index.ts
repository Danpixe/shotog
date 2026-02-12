import type { OGImageParams } from "../types";
import { basicTemplate } from "./basic";
import { blogTemplate } from "./blog";
import { productTemplate } from "./product";
import { socialTemplate } from "./social";
import { eventTemplate } from "./event";
import { changelogTemplate } from "./changelog";
import { testimonialTemplate } from "./testimonial";
import { announcementTemplate } from "./announcement";

const templates: Record<string, (params: OGImageParams) => any> = {
  basic: basicTemplate,
  blog: blogTemplate,
  product: productTemplate,
  social: socialTemplate,
  event: eventTemplate,
  changelog: changelogTemplate,
  testimonial: testimonialTemplate,
  announcement: announcementTemplate,
};

export function getTemplate(params: OGImageParams): any {
  const templateFn = templates[params.template] || templates.basic;
  return templateFn(params);
}

export function listTemplates(): string[] {
  return Object.keys(templates);
}
