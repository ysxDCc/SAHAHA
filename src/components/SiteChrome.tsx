"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";
import { CursorAura, Preloader, ScrollProgress } from "./SiteEffects";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;

  return (
    <>
      <a className="skip-link" href="#main-content">Preskočiť na obsah</a>
      <Preloader />
      <ScrollProgress />
      <CursorAura />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
