import { redirect } from "next/navigation";
import { logout } from "./actions";
import type { Reservation } from "@/components/admin/ReservationTable";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminMotion } from "@/components/admin/AdminMotion";
import { AdminBackground } from "@/components/admin/AdminBackground";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) redirect("/admin/login");

  const { data, error } = await createSupabaseAdminClient().from("reservations").select("*").order("reservation_date", { ascending: true }).order("reservation_time", { ascending: true });
  const reservations = (data || []) as Reservation[];
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Bratislava" }).format(new Date());

  return (
    <main className="admin-surface min-h-screen px-5 py-10 text-[#f5efe5] sm:px-8">
      <AdminBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <AdminMotion>
          <header className="admin-dashboard-header mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div><p className="text-xs uppercase tracking-[0.35em] text-[#c9dda9]">SAHA BAR · CONCIERGE</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl sm:text-6xl">Rezervácie</h1><p className="mt-2 text-sm text-white/45">Prihlásený: {user.email}</p></div>
            <form action={logout}><button className="rounded-xl border border-white/15 bg-black/20 px-5 py-3 text-sm backdrop-blur-md transition hover:border-[#a6cd8f] hover:bg-white/5">Odhlásiť sa</button></form>
          </header>
        </AdminMotion>

        <AdminMotion delay={0.16}>
          {error ? <p className="rounded-xl bg-red-400/10 p-4 text-red-200">Rezervácie sa nepodarilo načítať: {error.message}</p> : <AdminDashboard reservations={reservations} today={today} />}
        </AdminMotion>
      </div>
    </main>
  );
}
