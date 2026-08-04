import { NextRequest } from "next/server";
import { getReservationTimeSlots } from "@/data/site";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ReservationPayload = Record<string, unknown>;
const attempts = new Map<string, number[]>();

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validate(body: ReservationPayload) {
  const errors: Record<string, string> = {};
  if (text(body.name).length < 2 || text(body.name).length > 100) errors.name = "Doplňte meno a priezvisko.";
  if (!/^[+\d\s()/-]{7,30}$/.test(text(body.phone))) errors.phone = "Doplňte platné telefónne číslo.";
  if (text(body.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(body.email))) errors.email = "Skontrolujte e-mailovú adresu.";
  const date = text(body.date);
  const time = text(body.time);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.date = "Vyberte dátum rezervácie.";
  if (!/^\d{2}:\d{2}$/.test(time) || !getReservationTimeSlots(date).includes(time)) errors.time = "Vyberte čas v rámci otváracích hodín.";
  if (date && time) {
    const selected = new Date(`${date}T${time}:00`);
    if (Number.isNaN(selected.getTime()) || selected.getTime() < Date.now() + 60 * 60 * 1000) errors.date = "Rezerváciu je možné vytvoriť najskôr hodinu vopred.";
  }
  const guests = Number(body.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 30) errors.guests = "Počet osôb musí byť od 1 do 30.";
  if (!["Interiér", "Terasa"].includes(text(body.seating))) errors.seating = "Vyberte preferované miesto.";
  if (text(body.note).length > 700) errors.note = "Poznámka je príliš dlhá.";
  if (body.privacy !== "accepted") errors.privacy = "Na vybavenie rezervácie potrebujeme váš súhlas.";
  return errors;
}

export async function POST(request: NextRequest) {
  let body: ReservationPayload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Neplatný formát požiadavky." }, { status: 400 });
  }
  if (text(body.website)) return Response.json({ ok: true });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const windowStart = Date.now() - 10 * 60 * 1000;
  const recent = (attempts.get(ip) || []).filter((attempt) => attempt > windowStart);
  if (recent.length >= 5) return Response.json({ message: "Príliš veľa pokusov. Skúste to o niekoľko minút." }, { status: 429 });
  recent.push(Date.now());
  attempts.set(ip, recent);

  const errors = validate(body);
  if (Object.keys(errors).length) return Response.json({ message: "Skontrolujte označené polia.", errors }, { status: 400 });

  const seating = text(body.seating);
  const storedNote = [`Miesto: ${seating}`, text(body.note)].filter(Boolean).join("\n");
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.from("reservations").insert({
      full_name: text(body.name),
      phone: text(body.phone),
      email: text(body.email) || null,
      reservation_date: text(body.date),
      reservation_time: text(body.time),
      guests: Number(body.guests),
      note: storedNote,
      status: "pending",
    }).select("id").single();

    if (error) {
      console.error("Reservation insert failed:", error.message);
      return Response.json({ message: "Rezerváciu sa nepodarilo uložiť. Skúste to znova alebo nám zavolajte." }, { status: 500 });
    }
    await Promise.allSettled([
      sendNotification(body, seating),
      sendCustomerReceipt(body, data.id),
    ]);
    return Response.json({ ok: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error("Reservation request failed:", error instanceof Error ? error.message : error);
    return Response.json({ message: "Rezervačný systém nie je správne nastavený. Kontaktujte nás, prosím, telefonicky." }, { status: 503 });
  }
}

async function sendNotification(body: ReservationPayload, seating: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESERVATION_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "SAHA BAR <onboarding@resend.dev>",
      to: [to],
      subject: `Nová rezervácia – ${text(body.name)}, ${text(body.date)} ${text(body.time)}`,
      html: `<h2>Nová rezervácia SAHA BAR</h2><p><strong>Meno:</strong> ${escapeHtml(text(body.name))}</p><p><strong>Telefón:</strong> ${escapeHtml(text(body.phone))}</p><p><strong>E-mail:</strong> ${escapeHtml(text(body.email) || "neuvedený")}</p><p><strong>Dátum:</strong> ${escapeHtml(text(body.date))}</p><p><strong>Čas:</strong> ${escapeHtml(text(body.time))}</p><p><strong>Počet osôb:</strong> ${Number(body.guests)}</p><p><strong>Miesto:</strong> ${escapeHtml(seating)}</p><p><strong>Poznámka:</strong> ${escapeHtml(text(body.note) || "—")}</p>`,
    }),
  });
  if (!response.ok) console.error("Reservation notification failed with status", response.status);
}

async function sendCustomerReceipt(body: ReservationPayload, reservationId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const customerEmail = text(body.email);
  if (!apiKey || !customerEmail) return;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `reservation-${reservationId}-received`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "SAHA BAR <onboarding@resend.dev>",
      to: [customerEmail],
      subject: "Prijali sme vašu rezerváciu v SAHA BARE",
      html: `<!doctype html><html lang="sk"><body style="margin:0;background:#080709;color:#f4ece6;font-family:Arial,sans-serif"><div style="max-width:600px;margin:auto;padding:40px 24px"><p style="color:#c9a56d;font-size:12px;letter-spacing:3px">SAHA BAR · ZLATÉ MORAVCE</p><div style="margin-top:24px;padding:32px;border:1px solid rgba(201,165,109,.3);border-radius:20px;background:#12090d"><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:34px;font-weight:normal">Rezerváciu sme prijali</h1><p>Dobrý deň, ${escapeHtml(text(body.name))}.</p><p style="color:#d6cbca;line-height:1.7">Ďakujeme. Vašu rezerváciu sme prijali a čoskoro vám pošleme potvrdenie alebo informáciu o zmene jej stavu.</p><div style="margin-top:24px;padding:18px;border-radius:14px;background:#080709"><p style="margin:0 0 8px"><strong>Dátum:</strong> ${escapeHtml(text(body.date))}</p><p style="margin:0 0 8px"><strong>Čas:</strong> ${escapeHtml(text(body.time))}</p><p style="margin:0"><strong>Počet osôb:</strong> ${Number(body.guests)}</p></div><p style="margin-top:26px;color:#a99da0;font-size:13px">SAHA BAR · Župná 24, Zlaté Moravce · 037 642 41 11</p></div></div></body></html>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Customer reservation receipt failed:", response.status, detail);
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[char] || char);
}
