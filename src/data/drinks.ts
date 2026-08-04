import { imageAssets } from "./site";

export type Drink = {
  name: string;
  description: string;
  ingredients: string;
  price: string;
  type: string;
  image: string;
  position?: string;
};

export const drinks: Drink[] = [
  {
    name: "SAHA SIGNATURE",
    description: "Prémiový signature cocktail s ovocnými a jemne citrusovými tónmi.",
    ingredients: "Signature blend · citrus · ovocie",
    price: "€ —,—",
    type: "Signature",
    image: imageAssets.SAHA_DRINK_01,
    position: "50% 35%",
  },
  {
    name: "PINK NEON",
    description: "Svieži cocktail s výraznou farbou a ľahkým sladkokyslým profilom.",
    ingredients: "Vodka · ružový cordial · limeta",
    price: "€ —,—",
    type: "Fresh",
    image: imageAssets.SAHA_HERO_IMAGE,
    position: "78% 46%",
  },
  {
    name: "MIDNIGHT SOUR",
    description: "Elegantný večerný drink s dokonale vyváženou kyslosťou.",
    ingredients: "Whiskey · citrus · pena",
    price: "€ —,—",
    type: "Sour",
    image: imageAssets.SAHA_DRINK_01,
    position: "28% 42%",
  },
  {
    name: "GOLDEN HOUR",
    description: "Jemný, aromatický cocktail s prémiovým charakterom.",
    ingredients: "Gin · bylinky · champagne notes",
    price: "€ —,—",
    type: "Aromatic",
    image: imageAssets.SAHA_HERO_IMAGE,
    position: "56% 52%",
  },
  {
    name: "ESPRESSO MARTINI",
    description: "Výrazné espresso, vodka a bohatá kávová pena.",
    ingredients: "Espresso · vodka · coffee liqueur",
    price: "€ —,—",
    type: "Classic",
    image: imageAssets.SAHA_DRINK_01,
    position: "70% 36%",
  },
  {
    name: "SAHA SPRITZ",
    description: "Ľahký, osviežujúci drink ideálny na začiatok večera.",
    ingredients: "Bubbles · bitter · citrus",
    price: "€ —,—",
    type: "Spritz",
    image: imageAssets.SAHA_PEOPLE_01,
    position: "72% 65%",
  },
];

export const menuGroups = [
  { title: "Signature cocktails", items: drinks.slice(0, 4) },
  { title: "Classics & favourites", items: drinks.slice(4) },
] as const;
