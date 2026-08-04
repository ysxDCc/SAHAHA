"use client";

import { type MouseEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Brand } from "./Brand";
import { navItems } from "@/data/site";

function scrollToReservation() {
  const section = document.getElementById("rezervacia");
  if (!section) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (pathname !== "/" || window.location.hash !== "#rezervacia") return;
    const timer = window.setTimeout(scrollToReservation, 80);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const handleReservationClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (pathname !== "/") return;
    event.preventDefault();
    if (window.location.hash !== "#rezervacia") window.history.pushState(null, "", "/#rezervacia");
    window.requestAnimationFrame(() => window.requestAnimationFrame(scrollToReservation));
  };

  return (
    <header className={`site-header ${scrolled || open ? "site-header--solid" : ""}`}>
      <div className="site-header__inner shell">
        <Brand compact />
        <nav className="desktop-nav" aria-label="Hlavná navigácia">
          {navItems.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}
        </nav>
        <Link className="header-cta" href="/#rezervacia" onClick={handleReservationClick}>Rezervovať stôl</Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <div className={`mobile-menu ${open ? "mobile-menu--open" : ""}`} id="mobile-menu" aria-hidden={!open}>
        <nav aria-label="Mobilná navigácia">
          {navItems.map((item, index) => (
            <Link href={item.href} key={item.label} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>{item.label}
            </Link>
          ))}
          <Link className="button button--primary" href="/#rezervacia" onClick={handleReservationClick}>Rezervovať stôl</Link>
        </nav>
        <p>Župná 16 · Zlaté Moravce</p>
      </div>
    </header>
  );
}
