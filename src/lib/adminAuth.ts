import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminRole = "owner" | "staff";

export function adminRoleFor(user: User | null): AdminRole | null {
  if (!user?.email) return null;
  if (user.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) return "owner";
  return user.app_metadata?.role === "staff" ? "staff" : null;
}

export async function requireAdmin(requiredRole?: AdminRole) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const role = adminRoleFor(user);
  if (!user || !role || (requiredRole === "owner" && role !== "owner")) redirect("/admin/login");
  return { user, role };
}
