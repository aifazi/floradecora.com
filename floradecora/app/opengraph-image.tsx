import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Flora Decora — Landscaping, Themed Gardens & Tourist Attractions";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          background: "linear-gradient(135deg, #0F1B14 0%, #16261C 60%, #1E3327 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.9 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#D6A852" }} />
          <span style={{ fontSize: 14, letterSpacing: "0.18em", textTransform: "uppercase" }}>Est. 2003 — Al Ain, UAE</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em" }}>
            We draw <span style={{ color: "#D6A852" }}>the plan,</span>
            <br />
            then we grow it.
          </div>
          <div style={{ fontSize: 18, opacity: 0.7, maxWidth: 700, lineHeight: 1.5 }}>
            Flora Decora — themed gardens, butterfly houses, public parks & irrigation across the UAE. 300+ projects.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.6, fontSize: 13 }}>
          <span>floradecora.com • Al Reef Bldg, Al Ain</span>
          <span style={{ background: "white", color: "#0F1B14", padding: "8px 16px", borderRadius: 999 }}>20+ Years • 300+ Projects</span>
        </div>
      </div>
    ),
    size
  );
}
