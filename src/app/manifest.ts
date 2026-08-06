import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/admin",
    name: "SAHA BAR · Rezervácie",
    short_name: "SAHA Admin",
    description: "Administrácia rezervácií SAHA BARU v Zlatých Moravciach.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#07100a",
    theme_color: "#07100a",
    lang: "sk",
    categories: ["business", "productivity"],
    icons: [
      { src: "/images/SAHA_PWA_ICON_192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/images/SAHA_PWA_ICON_512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/images/SAHA_PWA_ICON_512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
