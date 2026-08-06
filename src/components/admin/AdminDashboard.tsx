"use client";

import { useMemo, useState } from "react";
import { Ban, CalendarCheck, ChevronLeft, ChevronRight, Clock3, Download, Search, Sparkles, Trash2, TrendingUp, UsersRound } from "lucide-react";
import { createBlockedSlot, deleteBlockedSlot } from "@/app/admin/actions";
import { blockedPlace } from "@/lib/reservationMetadata";
import { ReservationTable, type Reservation } from "./ReservationTable";
import { AdminAutoRefresh } from "./AdminAutoRefresh";
import type { AdminRole } from "@/lib/adminAuth";

type StatusFilter = "all" | Reservation["status"];

export function AdminDashboard({ reservations, blockedSlots, today, role }: { reservations: Reservation[]; blockedSlots: Reservation[]; today: string; role: AdminRole }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "upcoming">("upcoming");
  const [place, setPlace] = useState<"all" | "Interiér" | "Terasa">("all");
  const [month, setMonth] = useState(today.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState("");

  const latest = useMemo(() => [...reservations].sort((a, b) => b.created_at.localeCompare(a.created_at))[0], [reservations]);
  const filtered = useMemo(() => reservations.filter((reservation) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("sk");
    const matchesQuery = !normalizedQuery || [reservation.full_name, reservation.phone, reservation.email || "", String(reservation.table_number || ""), reservation.note || ""].some((value) => value.toLocaleLowerCase("sk").includes(normalizedQuery));
    const matchesStatus = status === "all" || reservation.status === status;
    const matchesDate = selectedDate ? reservation.reservation_date === selectedDate : dateFilter === "all" || (dateFilter === "today" ? reservation.reservation_date === today : reservation.reservation_date >= today);
    const reservationPlace = getPlace(reservation.note);
    const matchesPlace = place === "all" || reservationPlace === place;
    return matchesQuery && matchesStatus && matchesDate && matchesPlace;
  }), [reservations, query, status, dateFilter, place, selectedDate, today]);

  const active = reservations.filter((item) => item.status !== "cancelled");
  const confirmed = reservations.filter((item) => item.status === "confirmed").length;
  const decided = reservations.filter((item) => item.status === "confirmed" || item.status === "cancelled").length;
  const confirmationRate = decided ? Math.round((confirmed / decided) * 100) : 0;
  const peakTime = mostCommon(active.map((item) => item.reservation_time.slice(0, 5))) || "—";
  const peakDay = mostCommon(active.map((item) => weekday(item.reservation_date))) || "—";
  const stats = [
    { label: "Dnes", value: reservations.filter((item) => item.reservation_date === today).length, icon: CalendarCheck },
    { label: "Čakajú", value: reservations.filter((item) => item.status === "pending").length, icon: Clock3 },
    { label: "Hostia spolu", value: active.reduce((sum, item) => sum + item.guests, 0), icon: UsersRound },
    { label: "Úspešnosť", value: `${confirmationRate}%`, icon: TrendingUp },
  ];

  return <>
    <AdminAutoRefresh latestReservationId={latest?.id || ""} latestCreatedAt={latest?.created_at || ""} latestGuests={latest?.guests || 0} latestName={latest?.full_name || ""} />

    <div className="admin-stats-grid">
      {stats.map(({ label, value, icon: Icon }) => <div key={label} className="admin-stat-card"><div><span>{label}</span><Icon aria-hidden="true" /></div><strong>{value}</strong></div>)}
    </div>

    <section className="admin-insights" aria-label="Štatistiky rezervácií">
      <div><Sparkles aria-hidden="true" /><span>Najvyťaženejší deň</span><strong>{peakDay}</strong></div>
      <div><Clock3 aria-hidden="true" /><span>Najžiadanejší čas</span><strong>{peakTime}</strong></div>
      <div><UsersRound aria-hidden="true" /><span>Priemer hostí</span><strong>{active.length ? (active.reduce((sum, item) => sum + item.guests, 0) / active.length).toFixed(1) : "0"}</strong></div>
      <div><TrendingUp aria-hidden="true" /><span>Odmietnuté</span><strong>{reservations.length ? Math.round((reservations.filter((item) => item.status === "cancelled").length / reservations.length) * 100) : 0}%</strong></div>
    </section>

    {role === "owner" && <section className="admin-blocked-slots">
      <div className="admin-blocked-heading"><div><Ban aria-hidden="true" /><div><p>UZATVORENÉ TERMÍNY</p><h2>Blokovanie rezervácií</h2></div></div><span>{blockedSlots.length} blokovaní</span></div>
      <form action={createBlockedSlot} className="admin-block-form">
        <label><span>Dátum</span><input type="date" name="date" min={today} defaultValue={today} required /></label>
        <label><span>Čas</span><input type="time" name="time" required /></label>
        <label><span>Miesto</span><select name="place" defaultValue="all"><option value="all">Celý podnik</option><option value="Interiér">Interiér</option><option value="Terasa">Terasa</option></select></label>
        <button type="submit"><Ban aria-hidden="true" />Zablokovať termín</button>
      </form>
      {blockedSlots.length > 0 && <div className="admin-block-list">{blockedSlots.map((slot) => <div key={slot.id}><div><strong>{formatShortDate(slot.reservation_date)} · {slot.reservation_time.slice(0, 5)}</strong><span>{blockedPlaceLabel(blockedPlace(slot.note))}</span></div><form action={deleteBlockedSlot}><input type="hidden" name="id" value={slot.id} /><button type="submit" aria-label={`Odblokovať ${slot.reservation_date} ${slot.reservation_time.slice(0, 5)}`}><Trash2 aria-hidden="true" />Odblokovať</button></form></div>)}</div>}
    </section>}

    <section className="admin-calendar-panel">
      <div className="admin-calendar-heading"><div><p>PREHĽAD OBSADENOSTI</p><h2>{formatMonth(month)}</h2></div><div><button type="button" aria-label="Predchádzajúci mesiac" onClick={() => setMonth(shiftMonth(month, -1))}><ChevronLeft /></button><button type="button" onClick={() => { setMonth(today.slice(0, 7)); setSelectedDate(""); }}>Dnes</button><button type="button" aria-label="Nasledujúci mesiac" onClick={() => setMonth(shiftMonth(month, 1))}><ChevronRight /></button></div></div>
      <div className="admin-calendar-weekdays">{["Po", "Ut", "St", "Št", "Pi", "So", "Ne"].map((day) => <span key={day}>{day}</span>)}</div>
      <div className="admin-calendar-grid">{calendarDays(month).map((day, index) => {
        if (!day) return <span key={`empty-${index}`} className="is-empty" />;
        const date = `${month}-${String(day).padStart(2, "0")}`;
        const dailyReservations = reservations.filter((item) => item.reservation_date === date && item.status !== "cancelled");
        const guests = dailyReservations.reduce((sum, item) => sum + item.guests, 0);
        return <button type="button" key={date} onClick={() => setSelectedDate((value) => value === date ? "" : date)} className={`${date === today ? "is-today" : ""} ${selectedDate === date ? "is-selected" : ""}`}><b>{day}</b>{dailyReservations.length > 0 && <><span>{dailyReservations.length} rez.</span><small>{guests} hostí</small></>}</button>;
      })}</div>
    </section>

    <section className="admin-toolbar" aria-label="Filtrovanie rezervácií">
      <label className="admin-search"><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Hľadať meno, telefón, e-mail, stôl…" /></label>
      <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} aria-label="Filtrovať podľa stavu"><option value="all">Všetky stavy</option><option value="pending">Čakajúce</option><option value="confirmed">Potvrdené</option><option value="cancelled">Odmietnuté</option><option value="completed">Vybavené</option></select>
      <select value={dateFilter} onChange={(event) => { setDateFilter(event.target.value as typeof dateFilter); setSelectedDate(""); }} aria-label="Filtrovať podľa dátumu"><option value="upcoming">Nadchádzajúce</option><option value="today">Dnes</option><option value="all">Všetky dátumy</option></select>
      <select value={place} onChange={(event) => setPlace(event.target.value as typeof place)} aria-label="Filtrovať podľa miesta"><option value="all">Všetky miesta</option><option value="Interiér">Interiér</option><option value="Terasa">Terasa</option></select>
      <button type="button" className="admin-export-button" onClick={() => exportCsv(filtered)}><Download aria-hidden="true" />Export CSV</button>
      <p>{filtered.length} z {reservations.length} rezervácií{selectedDate && <> · <button type="button" onClick={() => setSelectedDate("")}>zrušiť dátum {selectedDate}</button></>}</p>
    </section>

    <ReservationTable reservations={filtered} canDelete={role === "owner"} />
  </>;
}

function getPlace(note: string | null) { return note?.split("\n").find((line) => line.startsWith("Miesto:"))?.replace("Miesto:", "").trim() || ""; }
function weekday(date: string) { return new Intl.DateTimeFormat("sk-SK", { weekday: "long" }).format(new Date(`${date}T12:00:00`)); }
function mostCommon(values: string[]) { const counts = new Map<string, number>(); values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1)); return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]; }
function formatMonth(value: string) { const [year, month] = value.split("-").map(Number); return new Intl.DateTimeFormat("sk-SK", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1)); }
function formatShortDate(value: string) { return new Intl.DateTimeFormat("sk-SK", { weekday: "short", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }
function blockedPlaceLabel(value: string) { return value === "all" ? "Celý podnik" : value; }
function shiftMonth(value: string, amount: number) { const [year, month] = value.split("-").map(Number); const date = new Date(year, month - 1 + amount, 1); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function calendarDays(value: string) { const [year, month] = value.split("-").map(Number); const first = new Date(year, month - 1, 1); const offset = (first.getDay() + 6) % 7; const count = new Date(year, month, 0).getDate(); return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => index + 1)]; }

function exportCsv(reservations: Reservation[]) {
  const headers = ["Meno", "Telefón", "E-mail", "Dátum", "Čas", "Počet osôb", "Miesto", "Stôl", "Stav", "Poznámka", "Vytvorená"];
  const rows = reservations.map((item) => [item.full_name, item.phone, item.email || "", item.reservation_date, item.reservation_time.slice(0, 5), item.guests, getPlace(item.note), item.table_number || "", item.status, item.note || "", item.created_at]);
  const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = `saha-rezervacie-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
}
