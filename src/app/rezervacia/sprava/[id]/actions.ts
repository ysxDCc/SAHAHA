"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendReservationStatusEmail } from "@/lib/reservationEmails";
import { verifyReservationManageToken } from "@/lib/reservationManageToken";

export async function manageReservation(formData: FormData) {
  const id = String(formData.get("id") || "");
  const token = String(formData.get("token") || "");
  const intent = String(formData.get("intent") || "");
  const changeRequest = String(formData.get("changeRequest") || "").trim().slice(0, 500);
  const destination = `/rezervacia/sprava/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`;

  if (!id || !verifyReservationManageToken(id, token)) redirect(`${destination}&result=invalid`);

  const admin = createSupabaseAdminClient();
  const { data: reservation, error: readError } = await admin
    .from("reservations")
    .select("id,full_name,email,reservation_date,reservation_time,guests,status,note")
    .eq("id", id)
    .single();

  if (readError || !reservation) redirect(`${destination}&result=missing`);

  if (intent === "cancel") {
    if (reservation.status !== "cancelled") {
      const { error } = await admin.from("reservations").update({ status: "cancelled" }).eq("id", id);
      if (error) redirect(`${destination}&result=error`);
      await sendReservationStatusEmail(reservation, "cancelled");
    }
    redirect(`${destination}&result=cancelled`);
  }

  if (intent === "change" && changeRequest.length >= 5) {
    const existingNote = String(reservation.note || "").trim();
    const note = [existingNote, `Žiadosť zákazníka o zmenu: ${changeRequest}`].filter(Boolean).join("\n");
    const { error } = await admin.from("reservations").update({ note, status: "pending" }).eq("id", id);
    if (error) redirect(`${destination}&result=error`);
    await sendReservationStatusEmail(reservation, "pending");
    redirect(`${destination}&result=change-requested`);
  }

  redirect(`${destination}&result=invalid-request`);
}
