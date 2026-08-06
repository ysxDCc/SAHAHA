"use server";

import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyReservationManageToken } from "@/lib/reservationManageToken";
import { withCustomerRating } from "@/lib/reservationMetadata";

export async function submitRating(formData: FormData) {
  const id = String(formData.get("id") || "");
  const token = String(formData.get("token") || "");
  const rating = Number(formData.get("rating"));
  const destination = `/hodnotenie/${encodeURIComponent(id)}?token=${encodeURIComponent(token)}`;
  if (!id || !verifyReservationManageToken(id, token) || !Number.isInteger(rating) || rating < 1 || rating > 5) redirect(`${destination}&result=invalid`);
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("reservations").select("note").eq("id", id).single();
  if (error || !data) redirect(`${destination}&result=missing`);
  const { error: updateError } = await admin.from("reservations").update({ note: withCustomerRating(data.note, rating) }).eq("id", id);
  if (updateError) redirect(`${destination}&result=error`);
  redirect(`${destination}&result=thanks`);
}
