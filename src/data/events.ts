import { imageAssets } from "./site";

export type BarEvent = {
  date: string;
  day: string;
  name: string;
  description: string;
  time: string;
  image: string;
};

export const events: BarEvent[] = [
  {
    date: "DÁTUM",
    day: "Piatok",
    name: "Friday Cocktail Night",
    description: "Večer postavený na signature drinkoch, dobrej hudbe a uvoľnenej nálade.",
    time: "Štart: DOPLNIŤ",
    image: imageAssets.SAHA_EVENT_01,
  },
  {
    date: "DÁTUM",
    day: "Sobota",
    name: "Live Music Evening",
    description: "Živá hudba zblízka a atmosféra, pri ktorej sa večer prirodzene predĺži.",
    time: "Štart: DOPLNIŤ",
    image: imageAssets.SAHA_EVENT_02,
  },
  {
    date: "DÁTUM",
    day: "Sobota",
    name: "Saturday Party",
    description: "Sobotná energia, obľúbené drinky a miesto pre všetkých, ktorí nechcú ísť skoro domov.",
    time: "Štart: DOPLNIŤ",
    image: imageAssets.SAHA_HERO_IMAGE,
  },
  {
    date: "DÁTUM",
    day: "Piatok",
    name: "DJ Night",
    description: "Starostlivo vybraný set, tlmené svetlá a noc s vlastným rytmom.",
    time: "Štart: DOPLNIŤ",
    image: imageAssets.SAHA_INTERIOR_01,
  },
  {
    date: "DÁTUM",
    day: "Štvrtok",
    name: "Ladies Night",
    description: "Elegantný večer s ľahkými cocktailmi a hudbou pre dobrú spoločnosť.",
    time: "Štart: DOPLNIŤ",
    image: imageAssets.SAHA_EXTERIOR_01,
  },
  {
    date: "DÁTUM",
    day: "Sobota",
    name: "Special Guest Event",
    description: "Špeciálny hosť, jedinečný program a limitovaný večer v SAHA BARE.",
    time: "Štart: DOPLNIŤ",
    image: imageAssets.SAHA_LOGO,
  },
];
