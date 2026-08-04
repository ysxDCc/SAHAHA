import { CalendarCheck, Clock3, Sparkles, UsersRound } from "lucide-react";
import { redirect } from "next/navigation";
import { logout } from "./actions";
import { ReservationTable, type Reservation } from "@/components/admin/ReservationTable";
import { AdminAutoRefresh } from "@/components/admin/AdminAutoRefresh";
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
  const stats = [
    { label: "Dnes", value: reservations.filter((item) => item.reservation_date === today).length, icon: CalendarCheck },
    { label: "Čakajú", value: reservations.filter((item) => item.status === "pending").length, icon: Clock3 },
    { label: "Potvrdené", value: reservations.filter((item) => item.status === "confirmed").length, icon: Sparkles },
    { label: "Hostia spolu", value: reservations.filter((item) => item.status !== "cancelled").reduce((sum, item) => sum + item.guests, 0), icon: UsersRound },
  ];

  return (
    <main className="admin-surface min-h-screen px-5 py-10 text-[#f5efe5] sm:px-8">
      <AdminBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <AdminMotion>
          <header className="admin-dashboard-header mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div><p className="text-xs uppercase tracking-[0.35em] text-[#c9dda9]">SAHA BAR · CONCIERGE</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl sm:text-6xl">Rezervácie</h1><p className="mt-2 text-sm text-white/45">Prihlásený: {user.email}</p><AdminAutoRefresh /></div>
            <form action={logout}><button className="rounded-xl border border-white/15 bg-black/20 px-5 py-3 text-sm backdrop-blur-md transition hover:border-[#a6cd8f] hover:bg-white/5">Odhlásiť sa</button></form>
          </header>
        </AdminMotion>

        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }, index) => (
            <AdminMotion key={label} delay={0.06 + index * 0.055}>
              <div className="admin-stat-card group rounded-2xl border border-white/10 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3"><span className="text-xs uppercase tracking-[.16em] text-white/45">{label}</span><Icon className="h-4 w-4 text-[#a6cd8f] transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" aria-hidden="true" /></div>
                <strong className="mt-4 block font-[family-name:var(--font-display)] text-4xl font-medium text-[#edf5e4]">{value}</strong>
              </div>
            </AdminMotion>
          ))}
        </div>

        <AdminMotion delay={0.16}>
          {error ? <p className="rounded-xl bg-red-400/10 p-4 text-red-200">Rezervácie sa nepodarilo načítať: {error.message}</p> : <ReservationTable reservations={reservations} />}
        </AdminMotion>
      </div>
    </main>
  );
}
