export default function FeaturedVenuesSkeleton() {
  return (
    <section id="venues" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-3">
            <div className="h-9 w-56 animate-pulse rounded-lg bg-neutral-200" />
            <div className="h-5 w-72 max-w-md animate-pulse rounded-lg bg-neutral-100" />
          </div>
          <div className="h-5 w-20 animate-pulse rounded-lg bg-neutral-100" />
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-2xl bg-neutral-200" />
              <div className="mt-4 h-5 w-3/4 rounded bg-neutral-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-neutral-100" />
              <div className="mt-3 h-4 w-1/3 rounded bg-neutral-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
