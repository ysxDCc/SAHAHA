"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendReservationStatusEmail } from "@/lib/reservationEmails";
import { BLOCKED_SLOT_NAME, blockedSlotNote, withAdminNote } from "@/lib/reservationMetadata";

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

export async function saveAdminNote(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const value = String(formData.get("adminNote") || "").trim().slice(0, 700);
  if (!id) throw new Error("Chýba ID rezervácie.");
  const admin = createSupabaseAdminClient();
  const { data, error: readError } = await admin.from("reservations").select("note").eq("id", id).single();
  if (readError || !data) throw new Error("Rezerváciu sa nepodarilo načítať.");
  const { error } = await admin.from("reservations").update({ note: withAdminNote(data.note, value) }).eq("id", id);
  if (error) throw new Error(`Internú poznámku sa nepodarilo uložiť: ${error.message}`);
  revalidatePath("/admin");
}

export async function createBlockedSlot(formData: FormData) {
  await requireAdmin();
  const date = String(formData.get("date") || "").trim();
  const time = String(formData.get("time") || "").trim();
  const place = String(formData.get("place") || "all").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time) || !["all", "Interiér", "Terasa"].includes(place)) throw new Error("Neplatný blokovaný termín.");

  const admin = createSupabaseAdminClient();
  const { data: existing } = await admin.from("reservations").select("id").eq("full_name", BLOCKED_SLOT_NAME).eq("reservation_date", date).eq("reservation_time", time).eq("note", blockedSlotNote(place)).maybeSingle();
  if (existing) { revalidatePath("/admin"); return; }

  const { error } = await admin.from("reservations").insert({
    full_name: BLOCKED_SLOT_NAME,
    phone: "0000000",
    email: null,
    reservation_date: date,
    reservation_time: time,
    guests: 1,
    note: blockedSlotNote(place),
    status: "cancelled",
  });
  if (error) throw new Error(`Termín sa nepodarilo zablokovať: ${error.message}`);
  revalidatePath("/admin");
}

export async function deleteBlockedSlot(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Chýba ID blokovaného termínu.");
  const { error } = await createSupabaseAdminClient().from("reservations").delete().eq("id", id).eq("full_name", BLOCKED_SLOT_NAME);
  if (error) throw new Error(`Blokovanie sa nepodarilo odstrániť: ${error.message}`);
  revalidatePath("/admin");
}
