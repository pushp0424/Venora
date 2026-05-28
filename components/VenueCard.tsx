import Image from "next/image";
import Link from "next/link";

type VenueCardProps = {
  id?: string;
  image: string;
  title: string;
  location: string;
  price: string;
  rating: string;
  tag?: string;
  className?: string;
};

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
    </svg>
  );
}

export default function VenueCard({
  id,
  image,
  title,
  location,
  price,
  rating,
  tag,
  className,
}: VenueCardProps) {
  const card = (
    <article className={`group animate-fade-in-up cursor-pointer ${className ?? ""}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {tag ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-900 backdrop-blur-sm">
            {tag}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold tracking-tight group-hover:underline">{title}</h3>
          <p className="mt-0.5 text-sm text-neutral-500">{location}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-sm">
          <StarIcon className="h-3.5 w-3.5 text-neutral-900" />
          <span className="font-medium">{rating}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-neutral-600">
        <span className="font-semibold text-neutral-900">{price}</span> / event
      </p>
    </article>
  );

  if (id) {
    return (
      <Link href={`/venue/${id}`} className="block">
        {card}
      </Link>
    );
  }

  return card;
}
