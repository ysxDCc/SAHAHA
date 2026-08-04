# SAHA BAR — webstránka

Produkčný responzívny web pre SAHA BAR v Zlatých Moravciach. Projekt používa Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, optimalizované obrázky a je pripravený na Vercel.

## Otvorenie projektu v Codexe

1. Rozbaľ celý priečinok `saha-bar` na počítači.
2. V aplikácii Codex vyber možnosť otvorenia lokálneho priečinka a otvor koreň `saha-bar` — priečinok, v ktorom je `package.json` a `AGENTS.md`.
3. Začni novú úlohu. Codex si automaticky načíta pokyny z `AGENTS.md`.
4. V integrovanom termináli spusti príkazy z nasledujúcej sekcie.

Projekt neobsahuje `node_modules`, preto je prenosný a po rozbalení sa závislosti nainštalujú nanovo.

## Lokálne spustenie

```bash
pnpm install
pnpm dev
```

Stránka sa otvorí na adrese [http://localhost:3000](http://localhost:3000). Ak príkaz `pnpm` nie je dostupný, treba najskôr nainštalovať Node.js a zapnúť Corepack alebo nainštalovať pnpm.

Produkčná kontrola:

```bash
pnpm lint
pnpm build
```

## Kde sa upravuje obsah

- kontakty, hodiny, sociálne siete, navigácia a mapovanie fotografií: `src/data/site.ts`
- drinky, ingrediencie a ceny: `src/data/drinks.ts`
- dátumy a popisy podujatí: `src/data/events.ts`
- poradie a popisy galérie: `src/data/gallery.ts`
- fotografie: `public/images/`
- text ochrany osobných údajov: `src/app/ochrana-osobnych-udajov/page.tsx`

Položky označené `DOPLNIŤ`, `DÁTUM` alebo `€ —,—` sú zámerné placeholdery. Pred publikovaním treba doplniť aktuálne ceny, termíny, firemný e-mail a ďalšie chýbajúce firemné údaje.

Otváracie hodiny a časové sloty rezervácií sú centralizované v `src/data/site.ts`. Aktuálne sa rezervácie ponúkajú po 30 minútach od 10:00 do 22:00, v piatok a sobotu do 04:00.

## Rezervácie

Formulár validuje údaje na klientovi aj serveri, obsahuje honeypot, časovú kontrolu a jednoduchý rate limit. Na skutočné doručenie rezervácie nastavte:

```env
RESERVATION_WEBHOOK_URL=https://...
```

Webhook dostane JSON s menom, kontaktom, termínom, počtom hostí a poznámkou. Bez tejto premennej formulár návštevníkovi korektne ponúkne telefonickú rezerváciu a nestratí jeho požiadavku potichu.

Lokálne premenné nastavíte skopírovaním `.env.example` do `.env.local`. Súbor `.env.local` neposielajte ďalej a neukladajte ho do Git repozitára.

## Odovzdávanie zmien

Na jednorazové poslanie stačí ZIP projektu. Ak majú web upravovať viacerí ľudia dlhodobo, odporúča sa nahrať projekt do súkromného GitHub repozitára. Každý potom pracuje vo vlastnej vetve a zmeny sa dajú bezpečne porovnávať a spájať.

## Nasadenie na Vercel

1. Importujte priečinok projektu do Vercelu.
2. Nastavte `NEXT_PUBLIC_SITE_URL` na finálnu doménu.
3. Nastavte `RESERVATION_WEBHOOK_URL`.
4. Skontrolujte všetky placeholdery uvedené vyššie.
5. Spustite deployment; build príkaz je automaticky `pnpm build`.

Google mapa sa načíta až po súhlase návštevníka. Web rešpektuje `prefers-reduced-motion`, podporuje klávesnicu, obsahuje sitemap, robots.txt, JSON-LD, Open Graph kartu, favicon a základné GDPR stránky.
