"use client";

import { deleteReservation } from "@/app/admin/actions";

export function DeleteReservationButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteReservation}
      onSubmit={(event) => {
        if (!window.confirm(`Naozaj chcete odstrániť rezerváciu pre ${name}? Táto akcia sa nedá vrátiť späť.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-xl border border-red-400/35 px-5 py-3 text-sm text-red-200 transition hover:border-red-400 hover:bg-red-400/10"
      >
        Odstrániť
      </button>
    </form>
  );
}
