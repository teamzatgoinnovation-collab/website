import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ZatGo Innovation — Operations that move with your teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3f6f8",
          padding: 64,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#1c2834",
              color: "#f4f7f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            ZG
          </div>
          <div style={{ fontSize: 34, fontWeight: 650, color: "#1c2834", letterSpacing: "-0.03em" }}>
            ZatGo
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 650,
              color: "#1c2834",
              lineHeight: 1.08,
              maxWidth: 920,
              letterSpacing: "-0.035em",
            }}
          >
            Operations that move with your teams.
          </div>
          <div style={{ fontSize: 24, color: "#5a6a78", maxWidth: 820, lineHeight: 1.4 }}>
            Field apps, desktop tools, and portals — one platform for how your
            teams work.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#0f7a7a",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          Enterprise operations platform
        </div>
      </div>
    ),
    { ...size },
  );
}
