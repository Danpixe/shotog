import type { OGImageParams } from "../types";

/**
 * Announcement template — bold centered announcement
 * Good for: product launches, major updates, company news, breaking changes
 */
export function announcementTemplate(params: OGImageParams) {
  const bgColor = params.bgColor || "#000000";
  const accentColor = params.accentColor || "#3b82f6";
  const textColor = params.textColor || "#ffffff";

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "1200px",
        height: "630px",
        background: bgColor,
        fontFamily: "Inter",
        color: textColor,
        position: "relative",
      },
      children: [
        // Top gradient line
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              height: "4px",
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            },
            children: [],
          },
        },
        // Eyebrow badge
        params.eyebrow
          ? {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  padding: "8px 24px",
                  borderRadius: "24px",
                  background: `${accentColor}20`,
                  border: `1px solid ${accentColor}40`,
                  fontSize: "16px",
                  fontWeight: 600,
                  color: accentColor,
                  textTransform: "uppercase",
                  letterSpacing: "3px",
                  marginBottom: "28px",
                },
                children: params.eyebrow,
              },
            }
          : null,
        // Title
        {
          type: "div",
          props: {
            style: {
              fontSize: params.title.length > 30 ? "52px" : "64px",
              fontWeight: 700,
              lineHeight: 1.1,
              textAlign: "center",
              maxWidth: "900px",
              letterSpacing: "-0.02em",
            },
            children: params.title,
          },
        },
        // Subtitle
        params.subtitle
          ? {
              type: "div",
              props: {
                style: {
                  fontSize: "24px",
                  marginTop: "24px",
                  opacity: 0.6,
                  textAlign: "center",
                  maxWidth: "700px",
                  lineHeight: 1.4,
                },
                children: params.subtitle,
              },
            }
          : null,
        // Bottom: domain
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              position: "absolute",
              bottom: "30px",
              fontSize: "16px",
              opacity: 0.3,
            },
            children: params.domain || "shotog.com",
          },
        },
        // Bottom gradient line
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              height: "4px",
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            },
            children: [],
          },
        },
      ].filter(Boolean),
    },
  };
}
