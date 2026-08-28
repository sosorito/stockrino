import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/data/settings";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const settings = await getSettings();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0c1930, #070f1e)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 90,
              height: 90,
              borderRadius: 20,
              background: "linear-gradient(135deg, #e8ac35, #bb7318)",
              color: "#0c1930",
              fontSize: 52,
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800, color: "white" }}>
            {settings.siteName}
            <span style={{ color: "#e8ac35" }}>.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#94a3b8", textAlign: "center", maxWidth: 900 }}>
          {settings.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
