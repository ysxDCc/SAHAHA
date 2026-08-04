"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendReservationStatusEmail } from "@/lib/reservationEmails";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) redirect("/admin/login");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) redirect("/admin/login?error=1");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updateReservationStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "").trim().toLowerCase();
  if (!id || !["pending", "confirmed", "cancelled", "completed"].includes(status)) throw new Error("Neplatná zmena rezervácie.");
  const admin = createSupabaseAdminClient();
  const { data: current, error: readError } = await admin
    .from("reservations")
    .select("id,full_name,email,reservation_date,reservation_time,guests,status")
    .eq("id", id)
    .single();
  if (readError || !current) throw new Error(`Rezerváciu sa nepodarilo načítať: ${readError?.message || "záznam neexistuje"}`);

  const { error } = await admin.from("reservations").update({ status }).eq("id", id);
  if (error) throw new Error(`Rezerváciu sa nepodarilo upraviť: ${error.message}`);

  if (current.status !== status) {
    await sendReservationStatusEmail(current, status);
  }
  revalidatePath("/admin");
}

export async function deleteReservation(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Chýba ID rezervácie.");

  const { error } = await createSupabaseAdminClient()
    .from("reservations")
    .delete()
    .eq("id", id);

  if (error) throw new Error(`Rezerváciu sa nepodarilo odstrániť: ${error.message}`);
  revalidatePath("/admin");
}
