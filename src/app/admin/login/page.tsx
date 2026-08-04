import { redirect } from "next/navigation";
import { login } from "../actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminMotion } from "@/components/admin/AdminMotion";
import { AdminBackground } from "@/components/admin/AdminBackground";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) redirect("/admin");

  return (
    <main className="admin-surface flex min-h-screen items-center justify-center px-5 text-[#f5efe5]">
      <AdminBackground />
      <AdminMotion className="relative z-10 w-full max-w-md"><section className="admin-login-card rounded-3xl border border-white/10 p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#d6b36a]">SAHA BAR</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl">Administrácia</h1>
        <p className="mt-3 text-sm text-white/55">Prihláste sa pre správu rezervácií.</p>
        {params.error && <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">Nesprávny e-mail alebo heslo.</p>}
        <form action={login} className="mt-7 space-y-4">
          <label className="block text-sm text-white/65">E-mail<input type="email" name="email" autoComplete="email" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-[#d6b36a]" /></label>
          <label className="block text-sm text-white/65">Heslo<input type="password" name="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none focus:border-[#d6b36a]" /></label>
          <button type="submit" className="w-full rounded-xl bg-[#d6b36a] px-5 py-3 font-bold text-[#140d0e] transition hover:bg-[#eed08c]">Prihlásiť sa</button>
        </form>
      </section></AdminMotion>
    </main>
  );
}
