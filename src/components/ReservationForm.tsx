"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Sofa,
  Trees,
  UserRound,
  UsersRound,
} from "lucide-react";
import { getReservationTimeSlots, isLateNightReservationDate, siteConfig } from "@/data/site";

type FieldErrors = Record<string, string>;
type OpenPicker = "date" | "time" | null;

const weekDays = ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromIsoDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function ReservationForm() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [seating, setSeating] = useState("Interiér");
  const [openPicker, setOpenPicker] = useState<OpenPicker>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const formRef = useRef<HTMLFormElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const timePickerRef = useRef<HTMLDivElement>(null);
  const dateTriggerRef = useRef<HTMLButtonElement>(null);
  const timeTriggerRef = useRef<HTMLButtonElement>(null);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!openPicker) return;

    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      const activeRoot = openPicker === "date" ? datePickerRef.current : timePickerRef.current;
      if (activeRoot && !activeRoot.contains(target)) setOpenPicker(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenPicker(null);
      (openPicker === "date" ? dateTriggerRef : timeTriggerRef).current?.focus();
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [openPicker]);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const leadingEmptyDays = (new Date(year, month, 1).getDay() + 6) % 7;
    const numberOfDays = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: leadingEmptyDays }, () => null),
      ...Array.from({ length: numberOfDays }, (_, index) => new Date(year, month, index + 1)),
    ];
  }, [calendarMonth]);

  const availableTimeSlots = useMemo(() => getReservationTimeSlots(selectedDate), [selectedDate]);
  const lateNightSchedule = selectedDate ? isLateNightReservationDate(selectedDate) : false;

  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat("sk-SK", { day: "numeric", month: "long", year: "numeric" }).format(fromIsoDate(selectedDate))
    : "Vyberte dátum";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const pickerErrors: FieldErrors = {};
    if (!selectedDate) pickerErrors.date = "Vyberte dátum rezervácie.";
    if (!selectedTime) pickerErrors.time = "Vyberte preferovaný čas.";

    if (Object.keys(pickerErrors).length) {
      setErrors(pickerErrors);
      setStatus("idle");
      (pickerErrors.date ? dateTriggerRef : timeTriggerRef).current?.focus();
      return;
    }
    if (!form.reportValidity()) return;

    setStatus("loading");
    setErrors({});
    setMessage("");
    const payload = Object.fromEntries(new FormData(form));
    payload.startedAt = String(startedAt.current ?? 0);

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors ?? {});
        throw new Error(data.message ?? "Rezerváciu sa nepodarilo odoslať.");
      }
      setStatus("success");
      setMessage("Ďakujeme. Rezervácia bola odoslaná a čoskoro ju potvrdíme.");
      form.reset();
      setSelectedDate("");
      setSelectedTime("");
      setSeating("Interiér");
      startedAt.current = Date.now();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Nastala neočakávaná chyba.");
    }
  };

  const error = (name: string) => errors[name] ? <span className="field-error" role="alert">{errors[name]}</span> : null;
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoToPreviousMonth = calendarMonth > currentMonthStart;

  return (
    <form className="reservation-form" onSubmit={submit} ref={formRef} noValidate>
      <div className="reservation-form__intro">
        <p>Online rezervácia</p>
        <span>Vyberte si preferovaný termín. Rezerváciu vám následne potvrdíme.</span>
      </div>

      <fieldset className="booking-group">
        <legend>Vaše údaje</legend>
        <div className="booking-grid booking-grid--identity">
          <label className="booking-field">
            <UserRound aria-hidden="true" />
            <span><b>Meno a priezvisko *</b><input name="name" autoComplete="name" required maxLength={80} placeholder="Vaše meno" /></span>
            {error("name")}
          </label>
          <label className="booking-field">
            <Phone aria-hidden="true" />
            <span><b>Telefón *</b><input name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder="+421" /></span>
            {error("phone")}
          </label>
          <label className="booking-field">
            <Mail aria-hidden="true" />
            <span><b>E-mail <small>nepovinné</small></b><input name="email" type="email" autoComplete="email" maxLength={120} placeholder="vas@email.sk" /></span>
            {error("email")}
          </label>
        </div>
      </fieldset>

      <fieldset className="booking-group booking-group--details">
        <legend>Detaily rezervácie</legend>
        <div className="booking-grid booking-grid--details">
          <div className={`booking-field booking-field--picker ${openPicker === "date" ? "is-open" : ""} ${errors.date ? "is-error" : ""}`} ref={datePickerRef} data-picker-root>
            <button
              className="picker-trigger"
              type="button"
              ref={dateTriggerRef}
              aria-haspopup="dialog"
              aria-expanded={openPicker === "date"}
              aria-controls="reservation-calendar"
              onClick={() => setOpenPicker((current) => current === "date" ? null : "date")}
            >
              <CalendarDays aria-hidden="true" />
              <span><b>Dátum *</b><strong>{selectedDateLabel}</strong></span>
              <ChevronDown className="picker-chevron" aria-hidden="true" />
            </button>
            <input name="date" type="hidden" value={selectedDate} />
            {error("date")}
            {openPicker === "date" && (
              <div className="picker-popover calendar-popover" id="reservation-calendar" role="dialog" aria-label="Vyberte dátum rezervácie">
                <div className="calendar-header">
                  <button type="button" aria-label="Predchádzajúci mesiac" disabled={!canGoToPreviousMonth} onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft aria-hidden="true" /></button>
                  <strong>{new Intl.DateTimeFormat("sk-SK", { month: "long", year: "numeric" }).format(calendarMonth)}</strong>
                  <button type="button" aria-label="Nasledujúci mesiac" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight aria-hidden="true" /></button>
                </div>
                <div className="calendar-weekdays" aria-hidden="true">{weekDays.map((day) => <span key={day}>{day}</span>)}</div>
                <div className="calendar-days" role="grid">
                  {calendarDays.map((date, index) => {
                    if (!date) return <span className="calendar-day--empty" key={`empty-${index}`} />;
                    const isoDate = toIsoDate(date);
                    const isPast = date < today;
                    const isToday = isoDate === toIsoDate(today);
                    const isSelected = isoDate === selectedDate;
                    return (
                      <button
                        type="button"
                        role="gridcell"
                        key={isoDate}
                        disabled={isPast}
                        aria-label={new Intl.DateTimeFormat("sk-SK", { dateStyle: "full" }).format(date)}
                        aria-current={isToday ? "date" : undefined}
                        aria-selected={isSelected}
                        className={`${isToday ? "is-today" : ""} ${isSelected ? "is-selected" : ""}`}
                        onClick={() => {
                          if (selectedTime && !getReservationTimeSlots(isoDate).includes(selectedTime)) setSelectedTime("");
                          setSelectedDate(isoDate);
                          setErrors((current) => ({ ...current, date: "" }));
                          setOpenPicker(null);
                          dateTriggerRef.current?.focus();
                        }}
                      >{date.getDate()}</button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className={`booking-field booking-field--picker booking-field--time ${openPicker === "time" ? "is-open" : ""} ${errors.time ? "is-error" : ""}`} ref={timePickerRef} data-picker-root>
            <button
              className="picker-trigger"
              type="button"
              ref={timeTriggerRef}
              aria-haspopup="dialog"
              aria-expanded={openPicker === "time"}
              aria-controls="reservation-times"
              onClick={() => {
                if (!selectedDate) {
                  setErrors((current) => ({ ...current, date: "Najprv vyberte dátum rezervácie." }));
                  setOpenPicker("date");
                  window.requestAnimationFrame(() => dateTriggerRef.current?.focus());
                  return;
                }
                setOpenPicker((current) => current === "time" ? null : "time");
              }}
            >
              <Clock3 aria-hidden="true" />
              <span><b>Čas *</b><strong>{selectedTime || "Vyberte čas"}</strong></span>
              <ChevronDown className="picker-chevron" aria-hidden="true" />
            </button>
            <input name="time" type="hidden" value={selectedTime} />
            {error("time")}
            {openPicker === "time" && (
              <div className="picker-popover time-popover" id="reservation-times" role="dialog" aria-label="Vyberte preferovaný čas">
                <div className="time-popover__heading"><Clock3 aria-hidden="true" /><span><b>Preferovaný čas</b><small>{lateNightSchedule ? "Piatok a sobota · 10:00 – 04:00" : "Nedeľa až štvrtok · 10:00 – 22:00"}</small></span></div>
                <div className="time-slots" role="listbox" aria-label="Dostupné časy">
                  {availableTimeSlots.map((time) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected={selectedTime === time}
                      className={selectedTime === time ? "is-selected" : ""}
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setErrors((current) => ({ ...current, time: "" }));
                        setOpenPicker(null);
                        timeTriggerRef.current?.focus();
                      }}
                    >{time}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <label className="booking-field">
            <UsersRound aria-hidden="true" />
            <span><b>Počet osôb *</b><input name="guests" type="number" inputMode="numeric" min={1} max={30} required placeholder="2" /></span>
            {error("guests")}
          </label>
        </div>
      </fieldset>

      <fieldset className="booking-group booking-group--place">
        <legend>Miesto</legend>
        <div className="seating-options">
          {[
            { value: "Interiér", icon: Sofa },
            { value: "Terasa", icon: Trees },
          ].map(({ value, icon: Icon }) => (
            <label className={seating === value ? "is-selected" : ""} key={value}>
              <input name="seating" type="radio" value={value} checked={seating === value} onChange={() => setSeating(value)} />
              <Icon aria-hidden="true" /><span>{value}</span><i aria-hidden="true" />
            </label>
          ))}
        </div>
      </fieldset>

      <label className="booking-note">
        <span><MessageSquareText aria-hidden="true" /><b>Poznámka <small>nepovinné</small></b></span>
        <textarea name="note" rows={3} maxLength={700} placeholder="Oslava, preferované miesto alebo čokoľvek, čo máme vedieť…" />
      </label>

      <label className="honeypot" aria-hidden="true">Webová stránka<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="checkbox-label">
        <input name="privacy" type="checkbox" value="accepted" required />
        <span>Súhlasím so spracovaním údajov na vybavenie rezervácie. <a href="/ochrana-osobnych-udajov">Viac informácií</a>.</span>
      </label>
      {error("privacy")}

      <button className="reservation-form__submit" type="submit" disabled={status === "loading"}>
        <span>{status === "loading" ? "Odosielam…" : "Rezervovať stôl"}</span>
        {status === "loading" ? <LoaderCircle className="spin" aria-hidden="true" /> : status === "success" ? <Check aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
      </button>
      <p className="reservation-form__assurance"><ShieldCheck aria-hidden="true" /> Potvrdenie rezervácie vám zašleme telefonicky alebo e-mailom.</p>

      {message && (
        <div className={`form-message form-message--${status}`} role="status" aria-live="polite">
          <p>{message}</p>
          {status === "error" && <a href={`tel:${siteConfig.phoneHref}`}>Zavolať na {siteConfig.phoneDisplay}</a>}
        </div>
      )}
    </form>
  );
}
