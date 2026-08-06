import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyReservationManageToken } from "@/lib/reservationManageToken";
import { customerRating } from "@/lib/reservationMetadata";
import { submitRating } from "./actions";

export const dynamic = "force-dynamic";

export default async function RatingPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ token?: string; result?: string }> }) {
  const { id } = await params;
  const { token = "", result } = await searchParams;
  if (!verifyReservationManageToken(id, token)) return <RatingShell><h1>Odkaz už nie je platný</h1><p>Ak nám chcete poslať spätnú väzbu, kontaktujte nás priamo.</p></RatingShell>;
  const { data } = await createSupabaseAdminClient().from("reservations").select("full_name,note").eq("id", id).single();
  if (!data) return <RatingShell><h1>Rezervácia sa nenašla</h1></RatingShell>;
  const saved = customerRating(data.note);
  return <RatingShell><p className="eyebrow">SAHA BAR · SPÄTNÁ VÄZBA</p><h1>Ďakujeme za návštevu</h1><p>{result === "thanks" || saved ? `Ďakujeme, ${data.full_name}. Vaše hodnotenie ${saved || ""}/5 sme prijali.` : `${data.full_name}, ako ste sa u nás cítili?`}</p>{!saved && <form action={submitRating} className="rating-stars"><input type="hidden" name="id" value={id} /><input type="hidden" name="token" value={token} />{[1,2,3,4,5].map((rating) => <button key={rating} type="submit" name="rating" value={rating} aria-label={`${rating} z 5 hviezdičiek`}><span aria-hidden="true">★</span><small>{rating}</small></button>)}</form>}<Link href="/">Späť na stránku SAHA BARU</Link></RatingShell>;
}

function RatingShell({ children }: { children: React.ReactNode }) {
  return <main className="rating-page"><section className="rating-card">{children}</section></main>;
}
