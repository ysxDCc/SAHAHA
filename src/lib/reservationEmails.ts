import { createReservationManageToken, reservationManageUrl } from "@/lib/reservationManageToken";

type NotifiableStatus = "pending" | "confirmed" | "cancelled" | "completed";

type ReservationForEmail = {
  id: string;
  full_name: string;
  email: string | null;
  reservation_date: string;
  reservation_time: string;
  guests: number;
};

const messages: Record<NotifiableStatus, { subject: string; heading: string; text: string }> = {
  pending: {
    subject: "Vaša rezervácia v SAHA BARE čaká na potvrdenie",
    heading: "Rezervácia čaká na potvrdenie",
    text: "Vašu rezerváciu evidujeme a čoskoro vás budeme informovať o jej potvrdení.",
  },
  confirmed: {
    subject: "Vaša rezervácia v SAHA BARE je potvrdená",
    heading: "Rezervácia potvrdená",
    text: "Tešíme sa na vašu návštevu. Váš stôl je rezervovaný.",
  },
  cancelled: {
    subject: "Informácia o rezervácii v SAHA BARE",
    heading: "Rezervácia odmietnutá",
    text: "Mrzí nás to, ale vašu rezerváciu v uvedenom termíne nemôžeme potvrdiť. Pre dohodnutie iného termínu nás, prosím, kontaktujte.",
  },
  completed: {
    subject: "Vaša rezervácia v SAHA BARE bola vybavená",
    heading: "Rezervácia bola vybavená",
    text: "Ďakujeme za vašu návštevu. Budeme sa tešiť opäť nabudúce.",
  },
};

const thankYouMessage = {
  subject: "Ďakujeme za návštevu SAHA BARU",
  heading: "Ďakujeme za návštevu",
  text: "Ďakujeme, že ste boli naším hosťom. Budeme sa tešiť na vašu ďalšiu návštevu.",
};

export async function sendReservationStatusEmail(reservation: ReservationForEmail, status: string) {
  if (!(status in messages)) return { sent: false, reason: "not-applicable" } as const;
  const message = messages[status as NotifiableStatus];
  const adminEmail = process.env.RESERVATION_NOTIFICATION_EMAIL || "sahabar.admin@gmail.com";
  const [customerResult, adminResult] = await Promise.allSettled([
    reservation.email
      ? sendEmail(reservation, reservation.email, message, undefined, `reservation-${reservation.id}-${status}-customer`)
      : Promise.resolve({ sent: false, reason: "missing-customer-email" } as const),
    sendEmail(reservation, adminEmail, {
      subject: `Zmena stavu rezervácie – ${reservation.full_name}`,
      heading: `Stav rezervácie: ${statusLabel(status as NotifiableStatus)}`,
      text: `Rezervácia zákazníka ${reservation.full_name} bola zmenená na stav „${statusLabel(status as NotifiableStatus)}“. E-mail zákazníka: ${reservation.email || "neuvedený"}.`,
    }, undefined, `reservation-${reservation.id}-${status}-admin`),
  ]);

  if (status === "confirmed") {
    const scheduledAt = getThankYouTime(reservation);
    if (scheduledAt === "too-far") {
      console.warn("Thank-you email cannot be scheduled more than 30 days in advance.");
    } else if (reservation.email) {
      await sendEmail(reservation, reservation.email, thankYouMessage, scheduledAt, `reservation-${reservation.id}-thank-you`);
    }
  }
  return { customerResult, adminResult } as const;
}

async function sendEmail(
  reservation: ReservationForEmail,
  recipient: string,
  message: { subject: string; heading: string; text: string },
  scheduledAt: string | undefined,
  idempotencyKey: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !recipient) return { sent: false, reason: "not-configured" } as const;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "SAHA BAR <onboarding@resend.dev>",
      to: [recipient],
      subject: message.subject,
      html: emailTemplate(reservation, message),
      ...(scheduledAt ? { scheduled_at: scheduledAt } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Customer email failed:", response.status, detail);
    return { sent: false, reason: "provider-error" } as const;
  }
  return { sent: true, scheduled: Boolean(scheduledAt) } as const;
}

function statusLabel(status: NotifiableStatus) {
  return ({
    pending: "Čaká na potvrdenie",
    confirmed: "Potvrdená",
    cancelled: "Odmietnutá",
    completed: "Vybavená",
  } as const)[status];
}

function getThankYouTime(reservation: ReservationForEmail): string | undefined | "too-far" {
  const [year, month, day] = reservation.reservation_date.split("-").map(Number);
  const [hour, minute] = reservation.reservation_time.slice(0, 5).split(":").map(Number);
  const startsAt = zonedTimeToUtc(year, month, day, hour, minute, "Europe/Bratislava");
  const sendAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
  const now = Date.now();
  if (sendAt.getTime() <= now + 60_000) return undefined;
  if (sendAt.getTime() > now + 30 * 24 * 60 * 60 * 1000) return "too-far";
  return sendAt.toISOString();
}

function zonedTimeToUtc(year: number, month: number, day: number, hour: number, minute: number, timeZone: string) {
  const target = Date.UTC(year, month - 1, day, hour, minute);
  const guess = new Date(target);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(guess);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  const represented = Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"));
  return new Date(target + (target - represented));
}

function emailTemplate(reservation: ReservationForEmail, message: { heading: string; text: string }) {
  const date = new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${reservation.reservation_date}T12:00:00`));
  const manageUrl = reservationManageUrl(reservation.id);
  const rating = message === thankYouMessage ? ratingButtons(reservation.id) : "";
  return `<!doctype html><html lang="sk"><body style="margin:0;background:#080709;color:#f4ece6;font-family:Arial,sans-serif"><div style="max-width:600px;margin:auto;padding:40px 24px"><p style="color:#c9a56d;font-size:12px;letter-spacing:3px">SAHA BAR · ZLATÉ MORAVCE</p><div style="margin-top:24px;padding:32px;border:1px solid rgba(201,165,109,.3);border-radius:20px;background:#12090d"><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:36px;font-weight:normal">${escapeHtml(message.heading)}</h1><p>Dobrý deň, ${escapeHtml(reservation.full_name)}.</p><p style="color:#d6cbca;line-height:1.7">${escapeHtml(message.text)}</p><div style="margin-top:24px;padding:18px;border-radius:14px;background:#080709"><p style="margin:0 0 8px"><strong>Dátum:</strong> ${escapeHtml(date)}</p><p style="margin:0 0 8px"><strong>Čas:</strong> ${escapeHtml(reservation.reservation_time.slice(0, 5))}</p><p style="margin:0"><strong>Počet osôb:</strong> ${reservation.guests}</p></div>${rating}<p style="margin:26px 0"><a href="${escapeHtml(manageUrl)}" style="display:inline-block;padding:14px 20px;border-radius:12px;background:#c9a56d;color:#110d07;text-decoration:none;font-weight:bold">Spravovať rezerváciu</a></p><p style="margin-top:26px;color:#a99da0;font-size:13px">SAHA BAR · Župná 24, Zlaté Moravce · 037 642 41 11</p></div></div></body></html>`;
}

function ratingButtons(id: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahabarrr.vercel.app";
  const token = createReservationManageToken(id);
  const stars = [1, 2, 3, 4, 5].map((value) => `<a href="${siteUrl}/hodnotenie/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}&rating=${value}" style="display:inline-block;margin:4px;padding:10px 12px;border:1px solid #c9a56d;border-radius:10px;color:#f0c972;text-decoration:none;font-size:22px">★<small style="display:block;font-size:10px;color:#d6cbca">${value}</small></a>`).join("");
  return `<div style="margin-top:26px;text-align:center"><p style="color:#d6cbca">Ako ste boli spokojní?</p>${stars}</div>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[char] || char);
}
