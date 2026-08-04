"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const refreshInterval = 10_000;

export function AdminAutoRefresh() {
  const router = useRouter();
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

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

  return (
    <p className="mt-2 text-xs text-white/35" aria-live="polite">
      Automatická aktualizácia každých 10 sekúnd
      {lastRefresh && ` · naposledy ${lastRefresh.toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`}
    </p>
  );
}
