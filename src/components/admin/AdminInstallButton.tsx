"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function AdminInstallButton() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); };
    const onInstalled = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, []);

  if (installed) return <span className="admin-app-installed">Aplikácia nainštalovaná</span>;
  if (!prompt) return null;

  return <button type="button" className="admin-install-button" onClick={async () => { await prompt.prompt(); const choice = await prompt.userChoice; if (choice.outcome === "accepted") setInstalled(true); setPrompt(null); }}><Download aria-hidden="true" />Nainštalovať aplikáciu</button>;
}
