import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return ["", "/drink-menu", "/podujatia", "/galeria", "/kontakt", "/ochrana-osobnych-udajov", "/cookies"].map((route) => ({
    url: `${base}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/ochrana-osobnych-udajov" || route === "/cookies" ? 0.2 : 0.8,
  }));
}
