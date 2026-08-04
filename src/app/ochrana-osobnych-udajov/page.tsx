import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Ochrana osobných údajov", description: "Základné informácie o spracovaní osobných údajov na webe SAHA BAR.", robots: { index: false, follow: true } };

export default function PrivacyPage() {
  return (
    <article className="legal-page shell">
      <p className="eyebrow">PRÁVNE INFORMÁCIE</p>
      <h1>Ochrana osobných údajov</h1>
      <p className="legal-page__lead">Táto stránka je pripravená ako základný GDPR rámec. Pred zverejnením doplňte identifikačné a kontaktné údaje prevádzkovateľa podľa skutočného právneho stavu.</p>
      <section><h2>1. Prevádzkovateľ</h2><p><b>DOPLNIŤ OBCHODNÉ MENO / PREVÁDZKOVATEĽA</b><br />Sídlo: DOPLNIŤ<br />IČO: DOPLNIŤ<br />E-mail pre ochranu osobných údajov: DOPLNIŤ</p></section>
      <section><h2>2. Rezervačný formulár</h2><p>Pri rezervácii spracúvame meno, telefón, voliteľne e-mail, dátum a čas rezervácie, počet hostí a obsah poznámky. Údaje používame iba na prijatie, potvrdenie a organizáciu rezervácie.</p></section>
      <section><h2>3. Právny základ a uchovávanie</h2><p>Právnym základom je vykonanie opatrení pred uzatvorením zmluvy a oprávnený záujem na organizácii prevádzky. Konkrétnu dobu uchovávania je potrebné doplniť podľa interného procesu prevádzkovateľa.</p></section>
      <section><h2>4. Príjemcovia údajov</h2><p>Po technickom prepojení formulára môžu údaje spracúvať poskytovatelia hostingu, e-mailu alebo rezervačného systému. Ich zoznam doplňte podľa skutočne použitých služieb.</p></section>
      <section><h2>5. Vaše práva</h2><p>Máte právo na prístup, opravu, vymazanie, obmedzenie spracúvania, prenosnosť údajov a namietanie. Máte tiež právo podať sťažnosť na Úrad na ochranu osobných údajov SR.</p></section>
      <section><h2>6. Cookies a externý obsah</h2><p>Informácie o lokálnom uložení voľby a načítaní mapy nájdete na stránke <Link href="/cookies">Používanie cookies</Link>.</p></section>
      <Link className="button button--secondary" href="/">Späť na domovskú stránku</Link>
    </article>
  );
}
