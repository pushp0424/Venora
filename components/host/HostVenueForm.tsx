import type { Venue } from "@/data/venues";
import { VENUE_AVAILABILITY } from "@/data/venues";
import {
  hostCreateVenueAction,
  hostUpdateVenueAction,
} from "@/app/host/dashboard/venues/actions";

type HostVenueFormProps = {
  venue?: Venue;
};

export default function HostVenueForm({ venue }: HostVenueFormProps) {
  const action = venue ? hostUpdateVenueAction : hostCreateVenueAction;

  return (
    <form action={action} className="mx-auto max-w-2xl space-y-5">
      {venue ? <input type="hidden" name="id" value={venue.id} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">Venue name</label>
          <input
            name="name"
            defaultValue={venue?.name}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">City</label>
          <input
            name="city"
            defaultValue={venue?.city}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Location</label>
          <input
            name="location"
            defaultValue={venue?.location}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Price label</label>
          <input
            name="price"
            defaultValue={venue?.price}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Price amount</label>
          <input
            name="priceAmount"
            type="number"
            defaultValue={venue?.priceAmount}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Image URL</label>
          <input
            name="image"
            defaultValue={venue?.image}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
            placeholder="Upload URL or image link"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Availability</label>
          <select
            name="availability"
            defaultValue={venue?.availability ?? "available"}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          >
            {VENUE_AVAILABILITY.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Capacity</label>
          <input
            name="capacity"
            defaultValue={venue?.capacity}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Max guests</label>
          <input
            name="capacityMax"
            type="number"
            defaultValue={venue?.capacityMax}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={venue?.description}
            required
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm"
          />
        </div>
        <input type="hidden" name="rating" value={venue?.rating ?? "4.8"} />
        <input type="hidden" name="tag" value={venue?.tag ?? "Event Space"} />
      </div>

      <p className="text-xs text-neutral-500">
        New listings are submitted for admin approval before going live.
      </p>

      <button
        type="submit"
        className="rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-semibold text-black"
      >
        {venue ? "Save changes" : "Submit venue"}
      </button>
    </form>
  );
}
