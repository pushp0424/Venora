"use client";

import {
  deleteVenueAction,
  setVenueStatusAction,
} from "@/app/admin/venues/actions";
import type { VenueStatus } from "@/data/venues";

type AdminVenueActionsProps = {
  venueId: string;
  status: VenueStatus;
};

export default function AdminVenueActions({
  venueId,
  status,
}: AdminVenueActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "approved" ? (
        <form action={setVenueStatusAction}>
          <input type="hidden" name="id" value={venueId} />
          <input type="hidden" name="status" value="approved" />
          <button
            type="submit"
            className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            Approve
          </button>
        </form>
      ) : null}
      {status !== "rejected" ? (
        <form action={setVenueStatusAction}>
          <input type="hidden" name="id" value={venueId} />
          <input type="hidden" name="status" value="rejected" />
          <button
            type="submit"
            className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700"
          >
            Reject
          </button>
        </form>
      ) : null}
      <form action={deleteVenueAction}>
        <input type="hidden" name="id" value={venueId} />
        <button
          type="submit"
          className="rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          Delete
        </button>
      </form>
    </div>
  );
}
