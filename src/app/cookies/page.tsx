import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Používanie cookies", description: "Informácie o cookies a externom obsahu na webe SAHA BAR.", robots: { index: false, follow: true } };

export default function CookiesPage() {
  return (
    <article className="legal-page shell">
      <p className="eyebrow">PRÁVNE INFORMÁCIE</p>
      <h1>Používanie cookies</h1>
      <p className="legal-page__lead">Web v základnom režime nepoužíva marketingové ani analytické cookies. Do lokálneho úložiska prehliadača sa uloží iba vaša voľba súhlasu.</p>
      <section><h2>Nevyhnutná voľba</h2><p>Kľúč <code>saha-cookie-consent</code> si zapamätá, či ste povolili externý obsah. Je potrebný na to, aby sa banner nezobrazoval pri každej návšteve.</p></section>
      <section><h2>Ochrana rezervačného formulára</h2><p>Po úspešnom odoslaní rezervácie uložíme nevyhnutnú bezpečnostnú cookie <code>saha_reservation_cooldown</code> na 5 minút. Bráni opakovanému spamovému odosielaniu formulára, nepoužíva sa na sledovanie ani reklamu a po uplynutí času sa automaticky vymaže.</p></section>
      <section><h2>Google Maps</h2><p>Interaktívna mapa sa načíta až po aktívnom súhlase. Po jej načítaní môže spoločnosť Google spracúvať technické údaje podľa svojich pravidiel.</p></section>
      <section><h2>Zmena voľby</h2><p>Voľbu môžete vymazať odstránením údajov tejto stránky v nastaveniach prehliadača. Banner sa následne zobrazí znova.</p></section>
      <Link className="button button--secondary" href="/">Späť na domovskú stránku</Link>
    </article>
  );
}
