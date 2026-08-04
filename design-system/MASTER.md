# SAHA BAR — dizajnový systém

## Vizuálny smer

- Charakter: filmový, večerný, elegantný a spoločenský; prémiový dojem vytvárajú fotografia, typografia, priestor a materiály.
- Paleta: `#080709` (ink), `#12090D` (charcoal wine), `#2A0B16` (burgundy), `#8F214B` (rose), `#E9B3C7` (soft pink), `#C9A56D` (champagne), `#F4ECE6` (cream).
- Povrchy: tmavé vrstvy s 1 px okrajom, obmedzeným blur efektom a mäkkým tieňom; žiadny agresívny neón.
- Tvary: fotografie a hlavné povrchy používajú mäkké rádiusy 20–32 px; kruhové prvky sú vyhradené pre oficiálne logo a ikonické akcie.
- Typografia: Cormorant Garamond pre titulky, Manrope pre text a navigáciu.

## Rozloženie

- Mobil-first, 20 px okraje na malých displejoch; max. šírka obsahu 1280 px.
- Vertikálny rytmus sekcií 96–160 px na desktope a 72–104 px na mobile.
- Jedna dominantná akcia v každom bloku, sekundárna akcia je vizuálne tichšia.
- Klikateľné prvky majú min. 44 × 44 px; formuláre používajú viditeľné labely.

## Pohyb a prístupnosť

- Mikrointerakcie 180–300 ms, odhaľovanie obsahu 500–800 ms; animovať len transform a opacity.
- Fotografie sa odhaľujú mäkkým mask reveal pohybom, karty vstupujú v krátkom stagger rytme a scroll progress používa pružinové vyhladenie.
- Parallax iba na veľkých obrazovkách a vypnúť pri `prefers-reduced-motion`.
- Viditeľný focus ring, kontrast textu WCAG AA, logické poradie nadpisov a ovládanie klávesnicou.
- Lightbox a mobilné menu sa zatvárajú cez Escape a po otvorení uzamknú scroll.
