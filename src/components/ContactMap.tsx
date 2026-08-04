"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { CONSENT_KEY, setCookieConsent, type ConsentValue } from "./CookieBanner";
import { siteConfig } from "@/data/site";

export function ContactMap() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setAllowed(localStorage.getItem(CONSENT_KEY) === "all"), 0);
    const update = (event: Event) => setAllowed((event as CustomEvent<ConsentValue>).detail === "all");
    window.addEventListener("saha-consent", update);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("saha-consent", update);
    };
  }, []);

  const query = encodeURIComponent(siteConfig.mapQuery);

  if (allowed) {
    return (
      <div className="map-frame">
        <iframe
          title="Mapa s polohou SAHA BARU"
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="map-placeholder">
      <MapPin aria-hidden="true" />
      <div>
        <h3>Mapa čaká na váš súhlas</h3>
        <p>Externý obsah od Google načítame iba vtedy, keď si to želáte.</p>
      </div>
      <button className="button button--secondary" type="button" onClick={() => { setCookieConsent("all"); setAllowed(true); }}>
        Načítať mapu
      </button>
    </div>
  );
}
