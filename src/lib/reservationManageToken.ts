import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_LIFETIME_SECONDS = 90 * 24 * 60 * 60;

function secret() {
  const value = process.env.RESERVATION_MANAGE_SECRET;
  if (!value) throw new Error("RESERVATION_MANAGE_SECRET is not configured.");
  return value;
}

function signature(id: string, expires: number) {
  return createHmac("sha256", secret()).update(`${id}.${expires}`).digest("base64url");
}

export function createReservationManageToken(id: string) {
  const expires = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS;
  return `${expires}.${signature(id, expires)}`;
}

export function verifyReservationManageToken(id: string, token: string) {
  const [expiresValue, suppliedSignature] = token.split(".");
  const expires = Number(expiresValue);
  if (!Number.isInteger(expires) || expires <= Math.floor(Date.now() / 1000) || !suppliedSignature) return false;
  const expected = Buffer.from(signature(id, expires));
  const supplied = Buffer.from(suppliedSignature);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

export function reservationManageUrl(id: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahabarrr.vercel.app";
  return `${siteUrl}/rezervacia/sprava/${encodeURIComponent(id)}?token=${encodeURIComponent(createReservationManageToken(id))}`;
}
