"use client";

import { useMemo, useState } from "react";
import VenueCard from "@/components/VenueCard";
import type { Venue } from "@/data/venues";

type BudgetFilter = "all" | "under-2000" | "2000-2500" | "over-2500";
type CapacityFilter = "all" | "under-100" | "100-150" | "150-200" | "over-200";

const animationDelays = [
  "delay-100",
  "delay-200",
  "delay-300",
  "delay-400",
  "delay-500",
];

function matchesBudget(priceAmount: number, budget: BudgetFilter): boolean {
  switch (budget) {
    case "under-2000":
      return priceAmount < 2000;
    case "2000-2500":
      return priceAmount >= 2000 && priceAmount <= 2500;
    case "over-2500":
      return priceAmount > 2500;
    default:
      return true;
  }
}

function matchesCapacity(capacityMax: number, capacity: CapacityFilter): boolean {
  switch (capacity) {
    case "under-100":
      return capacityMax < 100;
    case "100-150":
      return capacityMax >= 100 && capacityMax <= 150;
    case "150-200":
      return capacityMax > 150 && capacityMax <= 200;
    case "over-200":
      return capacityMax > 200;
    default:
      return true;
  }
}

function filterVenues(
  venues: Venue[],
  search: string,
  budget: BudgetFilter,
  capacity: CapacityFilter
): Venue[] {
  const query = search.trim().toLowerCase();

  return venues.filter((venue) => {
    const matchesSearch =
      query === "" ||
      venue.name.toLowerCase().includes(query) ||
      venue.city.toLowerCase().includes(query);

    return (
      matchesSearch &&
      matchesBudget(venue.priceAmount, budget) &&
      matchesCapacity(venue.capacityMax, capacity)
    );
  });
}

type VenuesListingProps = {
  venues: Venue[];
};

export default function VenuesListing({ venues }: VenuesListingProps) {
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState<BudgetFilter>("all");
  const [capacity, setCapacity] = useState<CapacityFilter>("all");

  const filteredVenues = useMemo(
    () => filterVenues(venues, search, budget, capacity),
    [venues, search, budget, capacity]
  );

  const hasActiveFilters =
    search.trim() !== "" || budget !== "all" || capacity !== "all";

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
            <div>
              <label htmlFor="venue-search" className="sr-only">
                Search venues
              </label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  id="venue-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by venue name or city..."
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-12 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200 sm:text-base"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="budget-filter"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-500"
                >
                  Budget
                </label>
                <select
                  id="budget-filter"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as BudgetFilter)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                >
                  <option value="all">Any budget</option>
                  <option value="under-2000">Under $2,000</option>
                  <option value="2000-2500">$2,000 – $2,500</option>
                  <option value="over-2500">Over $2,500</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="capacity-filter"
                  className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-500"
                >
                  Capacity
                </label>
                <select
                  id="capacity-filter"
                  value={capacity}
                  onChange={(e) =>
                    setCapacity(e.target.value as CapacityFilter)
                  }
                  className="w-full cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                >
                  <option value="all">Any capacity</option>
                  <option value="under-100">Under 100 guests</option>
                  <option value="100-150">100 – 150 guests</option>
                  <option value="150-200">150 – 200 guests</option>
                  <option value="over-200">Over 200 guests</option>
                </select>
              </div>
            </div>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setBudget("all");
                setCapacity("all");
              }}
              className="mt-4 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Clear all filters
            </button>
          ) : null}
        </div>

        <p className="mb-10 mt-8 text-sm text-neutral-500">
          {filteredVenues.length}{" "}
          {filteredVenues.length === 1 ? "venue" : "venues"} available
        </p>

        {filteredVenues.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVenues.map((venue, i) => (
              <VenueCard
                key={venue.id}
                id={venue.id}
                image={venue.image}
                title={venue.name}
                location={venue.location}
                price={venue.price}
                rating={venue.rating}
                tag={venue.tag}
                className={animationDelays[i % animationDelays.length]}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-6 py-16 text-center">
            <p className="text-lg font-semibold tracking-tight text-neutral-900">
              No venues match your filters
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Try adjusting your search, budget, or capacity preferences.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setBudget("all");
                setCapacity("all");
              }}
              className="mt-6 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-700"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}
