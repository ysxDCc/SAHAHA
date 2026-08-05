export const BLOCKED_SLOT_NAME = "__SAHA_BLOCKED_SLOT__";
const ADMIN_NOTE_PREFIX = "Interná poznámka:";
const BLOCK_PLACE_PREFIX = "Blokované miesto:";

export function adminNote(note: string | null) {
  return note?.split("\n").find((line) => line.startsWith(ADMIN_NOTE_PREFIX))?.slice(ADMIN_NOTE_PREFIX.length).trim() || "";
}

export function withAdminNote(note: string | null, value: string) {
  const visibleLines = (note || "").split("\n").filter((line) => line && !line.startsWith(ADMIN_NOTE_PREFIX));
  return [...visibleLines, value ? `${ADMIN_NOTE_PREFIX} ${value}` : ""].filter(Boolean).join("\n");
}

export function customerVisibleNote(note: string | null) {
  return (note || "").split("\n").filter((line) => line && !line.startsWith("Miesto:") && !line.startsWith(ADMIN_NOTE_PREFIX) && !line.startsWith(BLOCK_PLACE_PREFIX)).join("\n").trim();
}

export function blockedPlace(note: string | null) {
  return note?.split("\n").find((line) => line.startsWith(BLOCK_PLACE_PREFIX))?.slice(BLOCK_PLACE_PREFIX.length).trim() || "all";
}

export function blockedSlotNote(place: string) {
  return `${BLOCK_PLACE_PREFIX} ${place}`;
}
