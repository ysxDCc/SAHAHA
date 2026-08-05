import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, UsersRound } from "lucide-react";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyReservationManageToken } from "@/lib/reservationManageToken";
import { manageReservation } from "./actions";

export const metadata: Metadata = { title: "Správa rezervácie", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "Čaká na potvrdenie",
  confirmed: "Potvrdená",
  cancelled: "Zrušená",
  completed: "Vybavená",
};

export default async function ManageReservationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string; result?: string }> }) {
  const { id } = await params;
  const { token = "", result = "" } = await searchParams;
  if (!verifyReservationManageToken(id, token)) notFound();

  const { data: reservation } = await createSupabaseAdminClient()
    .from("reservations")
    .select("id,full_name,reservation_date,reservation_time,guests,status")
    .eq("id", id)
    .single();
  if (!reservation) notFound();

  const messages: Record<string, string> = {
    cancelled: "Rezervácia bola úspešne zrušená.",
    "change-requested": "Žiadosť o zmenu sme prijali. Čoskoro vás budeme kontaktovať.",
    error: "Zmenu sa nepodarilo uložiť. Skúste to znova alebo nám zavolajte.",
  };

  return (
    <main className="manage-reservation-page">
      <section className="manage-reservation-card">
        <p className="eyebrow">SAHA BAR · ZLATÉ MORAVCE</p>
        <h1>Vaša rezervácia</h1>
        <p className="manage-reservation-name">Dobrý deň, {reservation.full_name}.</p>
        {messages[result] && <p className={`manage-reservation-message ${result === "error" ? "is-error" : ""}`} role="status">{messages[result]}</p>}
        <div className="manage-reservation-status"><span>Aktuálny stav</span><strong>{statusLabels[reservation.status] || reservation.status}</strong></div>
        <div className="manage-reservation-details">
          <div><CalendarDays aria-hidden="true" /><span>Dátum</span><strong>{new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${reservation.reservation_date}T12:00:00`))}</strong></div>
          <div><Clock3 aria-hidden="true" /><span>Čas</span><strong>{reservation.reservation_time.slice(0, 5)}</strong></div>
          <div><UsersRound aria-hidden="true" /><span>Počet osôb</span><strong>{reservation.guests}</strong></div>
        </div>

        {reservation.status !== "cancelled" && reservation.status !== "completed" && (
          <div className="manage-reservation-actions">
            <form action={manageReservation}>
              <input type="hidden" name="id" value={id} /><input type="hidden" name="token" value={token} /><input type="hidden" name="intent" value="change" />
              <label htmlFor="changeRequest">Požiadať o zmenu</label>
              <textarea id="changeRequest" name="changeRequest" minLength={5} maxLength={500} required placeholder="Napíšte nový dátum, čas, počet hostí alebo inú požiadavku." />
              <button type="submit" className="button">Odoslať žiadosť</button>
            </form>
            <form action={manageReservation}>
              <input type="hidden" name="id" value={id} /><input type="hidden" name="token" value={token} /><input type="hidden" name="intent" value="cancel" />
              <button type="submit" className="button button--secondary">Zrušiť rezerváciu</button>
            </form>
          </div>
        )}
        <Link href="/" className="manage-reservation-back">Späť na stránku SAHA BARU</Link>
      </section>
    </main>
  );
}
