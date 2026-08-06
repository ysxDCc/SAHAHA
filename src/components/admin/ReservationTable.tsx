"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, CalendarDays, Clock3, Hash, Mail, MapPin, MessageCircle, MessageSquareText, PartyPopper, Phone, Sparkles, StickyNote, UsersRound, type LucideIcon } from "lucide-react";
import { saveAdminNote, updateReservationStatus } from "@/app/admin/actions";
import { adminNote, customerRating, customerVisibleNote, reservationOccasion, reservationPrivateEvent, reservationSpecialRequests } from "@/lib/reservationMetadata";
import { useHydrationSafeReducedMotion } from "@/lib/useReducedMotion";
import { DeleteReservationButton } from "./DeleteReservationButton";

export type Reservation = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  reservation_date: string;
  reservation_time: string;
  guests: number;
  note: string | null;
  created_at: string;
  table_number: string | number | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

const labels: Record<Reservation["status"], string> = {
  pending: "Čaká na potvrdenie",
  confirmed: "Potvrdená",
  cancelled: "Odmietnutá",
  completed: "Vybavená",
};

type Flight = { key: number; label: string; fromX: number; fromY: number; toX: number; toY: number };

export function ReservationTable({ reservations, canDelete }: { reservations: Reservation[]; canDelete: boolean }) {
  const reduceMotion = useHydrationSafeReducedMotion();
  if (!reservations.length) return <motion.div initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-white/10 bg-white/[.03] p-10 text-center text-white/50">Zatiaľ neboli vytvorené žiadne rezervácie.</motion.div>;
  return (
    <motion.div className="grid gap-4" layout>
      {reservations.map((reservation, index) => <ReservationCard key={reservation.id} reservation={reservation} index={index} reduceMotion={reduceMotion} canDelete={canDelete} />)}
    </motion.div>
  );
}

function ReservationCard({ reservation, index, reduceMotion, canDelete }: { reservation: Reservation; index: number; reduceMotion: boolean; canDelete: boolean }) {
  const [selectedStatus, setSelectedStatus] = useState(reservation.status);
  const [displayedStatus, setDisplayedStatus] = useState(reservation.status);
  const [flight, setFlight] = useState<Flight | null>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  const chooseStatus = (nextStatus: Reservation["status"]) => {
    setSelectedStatus(nextStatus);
    if (reduceMotion || !selectRef.current || !badgeRef.current) {
      setDisplayedStatus(nextStatus);
      return;
    }
    const from = selectRef.current.getBoundingClientRect();
    const to = badgeRef.current.getBoundingClientRect();
    setFlight({
      key: Date.now(),
      label: labels[nextStatus],
      fromX: from.left + from.width / 2,
      fromY: from.top + from.height / 2,
      toX: to.left + to.width / 2,
      toY: to.top + to.height / 2,
    });
  };

  return (
    <motion.article
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? undefined : { opacity: 0, x: 28, scale: 0.97 }}
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.006, borderColor: "rgba(164,196,130,0.38)", boxShadow: "0 24px 70px rgba(0,0,0,.32), 0 0 40px rgba(112,154,91,.09)" }}
      transition={{ duration: 0.48, delay: Math.min(index * 0.045, 0.3), ease: [0.16, 1, 0.3, 1], layout: { duration: 0.4 } }}
      className={`admin-reservation-card ${reservation.guests >= 10 ? "admin-reservation-card--priority" : ""} rounded-2xl border border-white/10 p-5 shadow-[0_16px_50px_rgba(0,0,0,0.12)]`}
    >
      {flight && createPortal(
        <AnimatePresence>
          <motion.span
            key={flight.key}
            className="admin-status-flight"
            style={{ left: flight.fromX, top: flight.fromY }}
            initial={{ opacity: 0, scale: 0.72, x: "-50%", y: "-50%" }}
            animate={{ opacity: [0, 1, 1, 0.85], scale: [0.72, 1.08, 1, 0.82], left: flight.toX, top: flight.toY }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => { setDisplayedStatus(selectedStatus); setFlight(null); }}
          >
            {flight.label}
          </motion.span>
        </AnimatePresence>,
        document.body,
      )}
      <div className="admin-visitor-heading flex flex-wrap items-center justify-between gap-4 border-b border-white/[.07] pb-5">
        <div className="flex items-center gap-4">
          <motion.div whileHover={reduceMotion ? undefined : { rotate: -4, scale: 1.06 }} className="admin-visitor-avatar">{initials(reservation.full_name)}</motion.div>
          <div><p className="mb-1 text-[.62rem] uppercase tracking-[.22em] text-white/35">Návštevník</p><h2 className="text-2xl font-semibold">{reservation.full_name}</h2></div>
        </div>
        <motion.span ref={badgeRef} key={displayedStatus} initial={reduceMotion ? false : { scale: 0.86, opacity: 0.35 }} animate={{ scale: 1, opacity: 1 }} className="admin-status-badge rounded-full px-3 py-1 text-xs">{labels[displayedStatus]}</motion.span>
      </div>
      {reservation.guests >= 10 && <div className="admin-large-group-alert"><UsersRound aria-hidden="true" /><div><span>PRIORITNÁ REZERVÁCIA</span><strong>Veľká skupina · {reservation.guests} hostí</strong><small>Skontrolujte kapacitu a prípravu stolov.</small></div></div>}

      <QuickContact reservation={reservation} />
      <motion.div className="admin-visitor-grid" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.045, delayChildren: 0.08 } } }}>
        <Info icon={Phone} label="Telefón"><a href={`tel:${reservation.phone}`}>{reservation.phone}</a></Info>
        <Info icon={Mail} label="E-mail">{reservation.email ? <a href={`mailto:${reservation.email}`}>{reservation.email}</a> : <span className="text-white/30">Neuvedený</span>}</Info>
        <Info icon={CalendarDays} label="Dátum">{formatDate(reservation.reservation_date)}</Info>
        <Info icon={Clock3} label="Čas">{reservation.reservation_time.slice(0, 5)}</Info>
        <Info icon={UsersRound} label="Počet osôb">{reservation.guests}</Info>
        <Info icon={MapPin} label="Miesto">{reservationPlace(reservation.note)}</Info>
        <Info icon={Hash} label="Stôl">{reservation.table_number || "Nepriradený"}</Info>
        <Info icon={Clock3} label="Vytvorená">{formatCreatedAt(reservation.created_at)}</Info>
      </motion.div>

      {customerNote(reservation.note) && <motion.div initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="admin-visitor-note"><MessageSquareText aria-hidden="true" /><div><span>Poznámka návštevníka</span><p>{customerNote(reservation.note)}</p></div></motion.div>}
      {reservationOccasion(reservation.note) && <div className="admin-occasion-badge"><PartyPopper aria-hidden="true" /><span>Špeciálna udalosť</span><strong>{reservationOccasion(reservation.note)}</strong></div>}
      {reservationSpecialRequests(reservation.note) && <div className="admin-special-requests"><Sparkles aria-hidden="true" /><div><span>ŠPECIÁLNE POŽIADAVKY</span><strong>{reservationSpecialRequests(reservation.note)}</strong></div></div>}
      {customerRating(reservation.note) && <div className="admin-rating-badge"><span aria-hidden="true">{"★".repeat(customerRating(reservation.note) || 0)}</span><strong>Hodnotenie návštevy {customerRating(reservation.note)}/5</strong></div>}

      {reservationPrivateEvent(reservation.note) && <div className="admin-private-event"><Building2 aria-hidden="true" /><div><span>ŽIADOSŤ O SÚKROMNÚ AKCIU</span><strong>{reservationPrivateEvent(reservation.note)}</strong><small>Kontaktujte zákazníka a dohodnite dostupnosť, cenu a podmienky.</small></div></div>}

      <form action={saveAdminNote} className="admin-internal-note">
        <input type="hidden" name="id" value={reservation.id} />
        <label htmlFor={`admin-note-${reservation.id}`}><StickyNote aria-hidden="true" /><span>Interná poznámka · zákazník ju neuvidí</span></label>
        <div><textarea id={`admin-note-${reservation.id}`} name="adminNote" maxLength={700} defaultValue={adminNote(reservation.note)} placeholder="Napr. narodeniny, VIP hosť, preferovaný stôl…" /><button type="submit">Uložiť poznámku</button></div>
      </form>

      <div className="mt-5 flex flex-wrap items-end justify-end gap-2 border-t border-white/[.07] pt-5">
          <form action={updateReservationStatus} className="flex flex-wrap items-end gap-2">
            <input type="hidden" name="id" value={reservation.id} />
            <select ref={selectRef} name="status" value={selectedStatus} onChange={(event) => chooseStatus(event.target.value as Reservation["status"])} className="admin-status-select rounded-xl border border-white/10 bg-black/55 px-4 py-3 text-sm"><option value="pending">Čaká</option><option value="confirmed">Potvrdená</option><option value="cancelled">Odmietnutá</option><option value="completed">Vybavená</option></select>
            <button type="submit" className="admin-save-button rounded-xl px-5 py-3 text-sm font-bold text-[#07100a]">Uložiť</button>
          </form>
          {canDelete && <DeleteReservationButton id={reservation.id} name={reservation.full_name} />}
      </div>
    </motion.article>
  );
}

const quickMessages = [
  { label: "Stôl je pripravený", text: "Dobrý deň, váš stôl v SAHA BARE je pripravený. Tešíme sa na vás." },
  { label: "Prosíme, zavolajte nám", text: "Dobrý deň, prosíme, ozvite sa nám telefonicky ohľadom vašej rezervácie v SAHA BARE na čísle 037 642 41 11." },
  { label: "Potvrdenie rezervácie", text: "Dobrý deň, potvrdzujeme vašu rezerváciu v SAHA BARE. Tešíme sa na vašu návštevu." },
  { label: "Meškanie stola", text: "Dobrý deň, príprava vášho stola sa mierne oneskorí. Ďakujeme za pochopenie, ozveme sa hneď, ako bude pripravený." },
] as const;

function QuickContact({ reservation }: { reservation: Reservation }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const message = `${quickMessages[messageIndex].text}\n\nRezervácia: ${formatDate(reservation.reservation_date)} o ${reservation.reservation_time.slice(0, 5)}.`;
  return <div className="admin-quick-contact"><div className="admin-quick-contact__heading"><MessageCircle aria-hidden="true" /><span>RÝCHLY KONTAKT</span></div><select value={messageIndex} onChange={(event) => setMessageIndex(Number(event.target.value))} aria-label="Vybrať pripravenú správu">{quickMessages.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}</select><div className="admin-quick-contact__actions"><a className="is-call" href={`tel:${reservation.phone}`}><Phone aria-hidden="true" />Zavolať</a><a href={`sms:${reservation.phone}?body=${encodeURIComponent(message)}`}><MessageCircle aria-hidden="true" />Poslať SMS</a>{reservation.email && <a href={`mailto:${reservation.email}?subject=${encodeURIComponent("Vaša rezervácia v SAHA BARE")}&body=${encodeURIComponent(message)}`}><Mail aria-hidden="true" />Poslať e-mail</a>}</div></div>;
}

function Info({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.42 }} className="admin-info-item"><Icon aria-hidden="true" /><div><span>{label}</span><p>{children}</p></div></motion.div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sk-SK", { weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("sk-SK", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Bratislava" }).format(new Date(value));
}

function reservationPlace(note: string | null) {
  return note?.split("\n").find((line) => line.startsWith("Miesto:"))?.replace("Miesto:", "").trim() || "Neuvedené";
}

function customerNote(note: string | null) {
  return customerVisibleNote(note);
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "?";
}
