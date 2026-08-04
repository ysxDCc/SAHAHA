export const siteConfig = {
  name: "SAHA BAR",
  slogan: "Cocktails. Music. Nights to remember.",
  description:
    "Objavte SAHA BAR v Zlatých Moravciach. Kvalitné cocktaily, živá hudba, príjemné posedenie a večery plné nezabudnuteľnej atmosféry.",
  address: {
    street: "Župná 16",
    postalCode: "953 01",
    city: "Zlaté Moravce",
    country: "Slovensko",
  },
  phoneDisplay: "037 642 41 11",
  phoneHref: "+421376424111",
  email: "DOPLNIŤ E-MAIL",
  mapQuery: "SAHA BAR, Župná 16, 953 01 Zlaté Moravce",
  social: {
    instagram: "https://www.instagram.com/saha.bar.zm/",
    instagramHandle: "@saha.bar.zm",
  },
  reservationSchedule: {
    start: "10:00",
    regularEnd: "22:00",
    lateNightEnd: "04:00",
    lateNightDays: [5, 6],
    intervalMinutes: 30,
  },
  openingHours: [
    { days: "Pondelok – Štvrtok", hours: "10:00 – 22:00" },
    { days: "Piatok – Sobota", hours: "10:00 – 04:00" },
    { days: "Nedeľa", hours: "10:00 – 22:00" },
  ],
} as const;

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function isLateNightReservationDate(dateIso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) return false;
  const [year, month, day] = dateIso.split("-").map(Number);
  const weekDay = new Date(year, month - 1, day).getDay();
  return siteConfig.reservationSchedule.lateNightDays.some((value) => value === weekDay);
}

export function getReservationTimeSlots(dateIso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) return [];
  const { start, regularEnd, lateNightEnd, intervalMinutes } = siteConfig.reservationSchedule;
  const startMinutes = timeToMinutes(start);
  let endMinutes = timeToMinutes(isLateNightReservationDate(dateIso) ? lateNightEnd : regularEnd);
  if (endMinutes <= startMinutes) endMinutes += 24 * 60;

  const slots: string[] = [];
  for (let minutes = startMinutes; minutes <= endMinutes; minutes += intervalMinutes) {
    const normalized = minutes % (24 * 60);
    slots.push(`${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`);
  }
  return slots;
}

export const navItems = [
  { label: "Domov", href: "/" },
  { label: "O nás", href: "/#o-nas" },
  { label: "Drink menu", href: "/drink-menu" },
  { label: "Podujatia", href: "/podujatia" },
  { label: "Galéria", href: "/galeria" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

export const imageAssets = {
  SAHA_HERO_IMAGE: "/images/SAHA_HERO_IMAGE.webp",
  SAHA_INTERIOR_01: "/images/SAHA_INTERIOR_01.webp",
  SAHA_INTERIOR_02: "/images/SAHA_INTERIOR_02.webp",
  SAHA_INTERIOR_03: "/images/SAHA_LOGO.webp",
  SAHA_DRINK_01: "/images/SAHA_DRINK_01.webp",
  SAHA_DRINK_02: "/images/SAHA_HERO_IMAGE.webp",
  SAHA_DRINK_03: "/images/SAHA_DRINK_01.webp",
  SAHA_EVENT_01: "/images/SAHA_PEOPLE_01.webp",
  SAHA_EVENT_02: "/images/SAHA_INTERIOR_01.webp",
  SAHA_PEOPLE_01: "/images/SAHA_PEOPLE_01.webp",
  SAHA_EXTERIOR_01: "/images/SAHA_EXTERIOR_01.webp",
  SAHA_LOGO: "/images/SAHA_LOGO.webp",
  SAHA_LOGO_OFFICIAL: "/images/SAHA_LOGO_OFFICIAL.png",
} as const;
