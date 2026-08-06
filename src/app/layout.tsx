import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SAHA BAR Zlaté Moravce | Cocktaily, hudba a večerná atmosféra",
    template: "%s | SAHA BAR",
  },
  description: "Objavte SAHA BAR v Zlatých Moravciach. Kvalitné cocktaily, živá hudba, príjemné posedenie a večery plné nezabudnuteľnej atmosféry.",
  keywords: ["SAHA BAR", "SAHA BAR Zlaté Moravce", "bar Zlaté Moravce", "cocktail bar Zlaté Moravce", "drinky Zlaté Moravce", "živá hudba Zlaté Moravce", "večerné posedenie Zlaté Moravce", "podnik Zlaté Moravce", "rezervácia baru Zlaté Moravce"],
  authors: [{ name: "SAHA BAR" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "SAHA BAR Zlaté Moravce",
    description: "Cocktaily, hudba a večerná atmosféra v centre Zlatých Moraviec.",
    type: "website",
    locale: "sk_SK",
    siteName: "SAHA BAR",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "SAHA BAR Zlaté Moravce" }],
  },
  twitter: { card: "summary_large_image", title: "SAHA BAR Zlaté Moravce", description: "Cocktaily, hudba a večerná atmosféra.", images: ["/og.png"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080709",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body><ServiceWorkerRegister /><SiteChrome>{children}</SiteChrome></body>
    </html>
  );
}
