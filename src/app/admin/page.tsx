import { createStaffAccount, deleteStaffAccount, logout } from "./actions";
import type { Reservation } from "@/components/admin/ReservationTable";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminMotion } from "@/components/admin/AdminMotion";
import { AdminBackground } from "@/components/admin/AdminBackground";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { BLOCKED_SLOT_NAME } from "@/lib/reservationMetadata";
import { AdminInstallButton } from "@/components/admin/AdminInstallButton";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { user, role } = await requireAdmin();

  const { data, error } = await createSupabaseAdminClient().from("reservations").select("*").order("reservation_date", { ascending: true }).order("reservation_time", { ascending: true });
  const allRows = (data || []) as Reservation[];
  const reservations = allRows.filter((item) => item.full_name !== BLOCKED_SLOT_NAME);
  const blockedSlots = allRows.filter((item) => item.full_name === BLOCKED_SLOT_NAME);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Bratislava" }).format(new Date());
  const staff = role === "owner"
    ? (await createSupabaseAdminClient().auth.admin.listUsers()).data.users.filter((item) => item.app_metadata?.role === "staff")
    : [];

  return (
    <main className="admin-surface min-h-screen px-5 py-10 text-[#f5efe5] sm:px-8">
      <AdminBackground />
      <div className="relative z-10 mx-auto max-w-6xl">
        <AdminMotion>
          <header className="admin-dashboard-header mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div><p className="text-xs uppercase tracking-[0.35em] text-[#c9dda9]">SAHA BAR · CONCIERGE</p><h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl sm:text-6xl">Rezervácie</h1><p className="mt-2 text-sm text-white/55">Prihlásený: {user.email} · {role === "owner" ? "Majiteľ" : "Personál"}</p></div>
            <div className="admin-header-actions"><AdminInstallButton /><form action={logout}><button className="rounded-xl border border-white/15 bg-black/20 px-5 py-3 text-sm backdrop-blur-md transition hover:border-[#a6cd8f] hover:bg-white/5">Odhlásiť sa</button></form></div>
          </header>
        </AdminMotion>

        <AdminMotion delay={0.16}>
          {error ? <p className="rounded-xl bg-red-400/10 p-4 text-red-200">Rezervácie sa nepodarilo načítať: {error.message}</p> : <AdminDashboard reservations={reservations} blockedSlots={blockedSlots} today={today} role={role} />}
        </AdminMotion>

        {role === "owner" && <AdminMotion delay={0.22}><section className="admin-team-panel">
          <div><p>PRÍSTUPY PERSONÁLU</p><h2>Admin účty</h2><span>Personál môže meniť stavy a poznámky. Mazanie a blokovanie termínov zostáva iba majiteľovi.</span></div>
          <form action={createStaffAccount}><input type="email" name="email" placeholder="E-mail personálu" required /><input type="password" name="password" minLength={10} placeholder="Dočasné heslo (min. 10 znakov)" required /><button type="submit">Pridať účet</button></form>
          {staff.length > 0 && <div className="admin-team-list">{staff.map((member) => <div key={member.id}><span>{member.email}</span><form action={deleteStaffAccount}><input type="hidden" name="id" value={member.id} /><button type="submit">Odobrať</button></form></div>)}</div>}
        </section></AdminMotion>}
      </div>
    </main>
  );
}
