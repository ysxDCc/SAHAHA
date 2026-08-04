import { imageAssets } from "./site";

export const galleryItems = [
  { src: imageAssets.SAHA_HERO_IMAGE, alt: "Nasvietený barový pult v SAHA BARE", category: "Bar", span: "wide" },
  { src: imageAssets.SAHA_INTERIOR_01, alt: "Pohodlné večerné posedenie v interiéri", category: "Interiér", span: "tall" },
  { src: imageAssets.SAHA_PEOPLE_01, alt: "Hostia na vonkajšej terase SAHA BARU", category: "Atmosféra", span: "wide" },
  { src: imageAssets.SAHA_LOGO, alt: "Svetelné logo SAHA BARU obklopené zeleňou", category: "Detail", span: "square" },
  { src: imageAssets.SAHA_DRINK_01, alt: "Výber fliaš na barovej polici", category: "Drinky", span: "wide" },
  { src: imageAssets.SAHA_EXTERIOR_01, alt: "Vstup do SAHA BARU večer", category: "Exteriér", span: "tall" },
  { src: imageAssets.SAHA_INTERIOR_02, alt: "Interiérový detail s logom SAHA BARU", category: "Svetlo", span: "wide" },
  { src: imageAssets.SAHA_PEOPLE_01, alt: "Večerné posedenie pod svetlami na terase", category: "Ľudia", span: "square" },
] as const;
