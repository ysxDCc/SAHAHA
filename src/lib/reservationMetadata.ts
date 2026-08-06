export const BLOCKED_SLOT_NAME = "__SAHA_BLOCKED_SLOT__";
const ADMIN_NOTE_PREFIX = "Interná poznámka:";
const BLOCK_PLACE_PREFIX = "Blokované miesto:";
const OCCASION_PREFIX = "Udalosť:";
const RATING_PREFIX = "Hodnotenie:";

export function adminNote(note: string | null) {
  return note?.split("\n").find((line) => line.startsWith(ADMIN_NOTE_PREFIX))?.slice(ADMIN_NOTE_PREFIX.length).trim() || "";
}

export function withAdminNote(note: string | null, value: string) {
  const visibleLines = (note || "").split("\n").filter((line) => line && !line.startsWith(ADMIN_NOTE_PREFIX));
  return [...visibleLines, value ? `${ADMIN_NOTE_PREFIX} ${value}` : ""].filter(Boolean).join("\n");
}

export function customerVisibleNote(note: string | null) {
  return (note || "").split("\n").filter((line) => line && !line.startsWith("Miesto:") && !line.startsWith(ADMIN_NOTE_PREFIX) && !line.startsWith(BLOCK_PLACE_PREFIX) && !line.startsWith(OCCASION_PREFIX) && !line.startsWith(RATING_PREFIX)).join("\n").trim();
}

export function customerRating(note: string | null) {
  const value = Number(note?.split("\n").find((line) => line.startsWith(RATING_PREFIX))?.slice(RATING_PREFIX.length).trim());
  return value >= 1 && value <= 5 ? value : null;
}

export function withCustomerRating(note: string | null, value: number) {
  const lines = (note || "").split("\n").filter((line) => line && !line.startsWith(RATING_PREFIX));
  return [...lines, `${RATING_PREFIX} ${value}/5`].join("\n");
}

export function reservationOccasion(note: string | null) {
  return note?.split("\n").find((line) => line.startsWith(OCCASION_PREFIX))?.slice(OCCASION_PREFIX.length).trim() || "";
}

export function occasionNote(value: string) {
  return value ? `${OCCASION_PREFIX} ${value}` : "";
}

export function blockedPlace(note: string | null) {
  return note?.split("\n").find((line) => line.startsWith(BLOCK_PLACE_PREFIX))?.slice(BLOCK_PLACE_PREFIX.length).trim() || "all";
}

export function blockedSlotNote(place: string) {
  return `${BLOCK_PLACE_PREFIX} ${place}`;
}
