"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const refreshInterval = 10_000;

export function AdminAutoRefresh({ latestReservationId, latestCreatedAt }: { latestReservationId: string; latestCreatedAt: string }) {
  const router = useRouter();
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [notice, setNotice] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const latestIdRef = useRef(latestReservationId);
  const latestCreatedAtRef = useRef(latestCreatedAt);

  useEffect(() => {
    const isNewReservation = Boolean(latestReservationId) && latestReservationId !== latestIdRef.current && latestCreatedAt > latestCreatedAtRef.current;
    if (isNewReservation) {
      setNotice("Prišla nová rezervácia");
      if (soundEnabled) playNotificationSound();
      const timeout = window.setTimeout(() => setNotice(""), 7000);
      latestIdRef.current = latestReservationId;
      latestCreatedAtRef.current = latestCreatedAt;
      return () => window.clearTimeout(timeout);
    }
    latestIdRef.current = latestReservationId;
    latestCreatedAtRef.current = latestCreatedAt;
  }, [latestReservationId, latestCreatedAt, soundEnabled]);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      router.refresh();
      setLastRefresh(new Date());
    };

    const interval = window.setInterval(refresh, refreshInterval);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  return <div className="admin-refresh-status">
    <p aria-live="polite">Automatická aktualizácia každých 10 sekúnd{lastRefresh && ` · naposledy ${lastRefresh.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}</p>
    <button type="button" onClick={() => setSoundEnabled((value) => !value)}>{soundEnabled ? "Zvuk zapnutý" : "Zapnúť zvuk upozornení"}</button>
    {notice && <div className="admin-new-reservation-toast" role="status"><span aria-hidden="true" />{notice}</div>}
  </div>;
}

function playNotificationSound() {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.setValueAtTime(660, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.18);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.36);
  oscillator.addEventListener("ended", () => void context.close());
}
