import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 32, background: "#2A0B16", color: "#F4ECE6", border: "2px solid #C9A56D", fontSize: 38, fontFamily: "serif" }}>S</div>, size);
}
