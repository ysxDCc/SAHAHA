# SAHA BAR — pokyny pre Codex

## Projekt

- Produkčný web SAHA BARU v Zlatých Moravciach.
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS a Framer Motion.
- Používaj `pnpm` a zachovaj existujúcu komponentovú architektúru.

## Vizuálny smer

- Zachovaj luxusný tmavý vzhľad, bordovú, champagne zlatú a krémový text.
- Používaj Cormorant Garamond na veľké nadpisy a Manrope na bežný text.
- Uprednostni mäkké zaoblenia, filmové fotografie a decentné animácie.
- Nepoužívaj agresívne neónové farby, generické stock fotografie ani preplnené rozloženie.
- Zachovaj plnú responzivitu, klávesnicové ovládanie a `prefers-reduced-motion`.

## Kde sa upravuje obsah

- Kontakty, sociálne siete, otváracie hodiny, rezervačný rozvrh a obrázkové cesty: `src/data/site.ts`
- Drinky a ceny: `src/data/drinks.ts`
- Podujatia: `src/data/events.ts`
- Galéria: `src/data/gallery.ts`
- Fotografie: `public/images/`
- Hlavné sekcie: `src/components/HomeSections.tsx`
- Rezervačný formulár a kalendár: `src/components/ReservationForm.tsx`
- Dizajn stránky: `src/app/globals.css`

## Rezervácie

- Klientská aj serverová validácia musia zostať zosúladené.
- Časové sloty generuje `getReservationTimeSlots()` podľa konfigurácie v `src/data/site.ts`.
- Skutočné doručenie rezervácie vyžaduje `RESERVATION_WEBHOOK_URL` v `.env.local` alebo v hostingu.
- Nikdy nevkladaj tajné kľúče priamo do zdrojového kódu.

## Kontrola pred odovzdaním

- Po úpravách spusti `pnpm lint`.
- Potom spusti `pnpm build` a oprav všetky chyby.
- Pri vizuálnych zmenách skontroluj minimálne desktop a mobil so šírkou 375 px.
