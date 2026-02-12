import type { OGImageParams } from "../types";

/**
 * Event template — conference/meetup/webinar style
 * Good for: events, webinars, conferences, meetups
 */
export function eventTemplate(params: OGImageParams) {
  const bgColor = params.bgColor || "#0c0a1a";
  const accentColor = params.accentColor || "#8b5cf6";
  const textColor = params.textColor || "#ffffff";

  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        width: "1200px",
        height: "630px",
        background: `linear-gradient(160deg, ${bgColor} 0%, #1e1036 100%)`,
        fontFamily: "Inter",
        color: textColor,
        position: "relative",
      },
      children: [
        // Top decorative line
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              height: "4px",
              background: `linear-gradient(90deg, ${accentColor}, #ec4899, ${accentColor})`,
            },
            children: [],
          },
        },
        // Content
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              padding: "60px 80px",
              flex: 1,
              justifyContent: "space-between",
            },
            children: [
              // Top: eyebrow badge
              {
                type: "div",
                props: {
                  style: { display: "flex" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          padding: "8px 20px",
                          borderRadius: "24px",
                          border: `1px solid ${accentColor}`,
                          background: `${accentColor}20`,
                          fontSize: "16px",
                          fontWeight: 600,
                          color: accentColor,
                        },
                        children: params.eyebrow || "EVENT",
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
                          fontSize: params.title.length > 40 ? "46px" : "56px",
                          fontWeight: 700,
                          lineHeight: 1.15,
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
                              fontSize: "22px",
                              marginTop: "16px",
                              opacity: 0.6,
                              lineHeight: 1.4,
                            },
                            children: params.subtitle,
                          },
                        }
                      : null,
                  ].filter(Boolean),
                },
              },
              // Bottom: author (speaker) + domain
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  },
                  children: [
                    params.author
                      ? {
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
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "50%",
                                    background: `linear-gradient(135deg, ${accentColor}, #ec4899)`,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "18px",
                                    fontWeight: 700,
                                    marginRight: "14px",
                                  },
                                  children: params.author.charAt(0).toUpperCase(),
                                },
                              },
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
                                          fontSize: "18px",
                                          fontWeight: 600,
                                        },
                                        children: params.author,
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                          },
                        }
                      : { type: "div", props: { children: [] } },
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
            ],
          },
        },
      ],
    },
  };
}
