"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export type ConsentValue = "all" | "essential";
export const CONSENT_KEY = "saha-cookie-consent";

export function setCookieConsent(value: ConsentValue) {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("saha-consent", { detail: value }));
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(!localStorage.getItem(CONSENT_KEY)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const choose = (value: ConsentValue) => {
    setCookieConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="cookie-banner" aria-label="Nastavenie cookies">
      <div>
        <p className="cookie-banner__title">Súkromie bez malých písmen</p>
        <p>Web si pamätá iba vašu voľbu. Google mapu načítame až po súhlase s externým obsahom.</p>
        <Link href="/cookies">Ako používame cookies</Link>
      </div>
      <div className="cookie-banner__actions">
        <button type="button" className="button button--secondary" onClick={() => choose("essential")}>Len nevyhnutné</button>
        <button type="button" className="button button--primary" onClick={() => choose("all")}>Povoliť mapu</button>
      </div>
    </aside>
  );
}
