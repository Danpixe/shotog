import type { OGImageParams } from "../types";

/**
 * Changelog template — version/release update style
 * Good for: changelogs, release notes, version updates, patch notes
 */
export function changelogTemplate(params: OGImageParams) {
  const bgColor = params.bgColor || "#09090b";
  const accentColor = params.accentColor || "#22c55e";
  const textColor = params.textColor || "#fafafa";

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "1200px",
        height: "630px",
        background: bgColor,
        fontFamily: "Inter",
        color: textColor,
        padding: "60px 80px",
        justifyContent: "space-between",
      },
      children: [
        // Top: version badge + domain
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                  },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: accentColor,
                          marginRight: "10px",
                        },
                        children: [],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "18px",
                          fontWeight: 600,
                          color: accentColor,
                        },
                        children: params.eyebrow || "Changelog",
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "16px",
                    opacity: 0.4,
                  },
                  children: params.domain || "shotog.com",
                },
              },
            ],
          },
        },
        // Middle: title + subtitle
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: params.title.length > 40 ? "48px" : "60px",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    maxWidth: "900px",
                  },
                  children: params.title,
                },
              },
              params.subtitle
                ? {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "24px",
                        marginTop: "20px",
                        color: "#a1a1aa",
                        lineHeight: 1.5,
                        maxWidth: "700px",
                      },
                      children: params.subtitle,
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },
        // Bottom: author + line
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              borderTop: "1px solid #27272a",
              paddingTop: "24px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    background: `linear-gradient(135deg, ${accentColor}, #16a34a)`,
                    marginRight: "12px",
                  },
                  children: [],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#a1a1aa",
                  },
                  children: params.author || "Release Notes",
                },
              },
            ],
          },
        },
      ],
    },
  };
}
