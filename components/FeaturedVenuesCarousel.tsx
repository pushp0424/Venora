"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import VenueCard from "@/components/VenueCard";
import type { Venue } from "@/data/venues";

type FeaturedVenuesCarouselProps = {
  venues: Venue[];
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}

export default function FeaturedVenuesCarousel({
  venues,
}: FeaturedVenuesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const showNavigation = venues.length > 1;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer.disconnect();
    };
  }, [venues, updateScrollState]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const firstCard = el.querySelector<HTMLElement>("[data-carousel-card]");
    const gap = 24;
    const step = firstCard
      ? firstCard.offsetWidth + gap
      : Math.round(el.clientWidth * 0.85);

    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const motionProps = prefersReducedMotion
    ? { initial: false as const, animate: "visible" as const }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <div className="relative">
      {showNavigation ? (
        <>
          <motion.button
            type="button"
            aria-label="Scroll venues left"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute -left-2 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-lg transition-opacity disabled:pointer-events-none disabled:opacity-35 md:flex lg:-left-5"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="button"
            aria-label="Scroll venues right"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute -right-2 top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-900 shadow-lg transition-opacity disabled:pointer-events-none disabled:opacity-35 md:flex lg:-right-5"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </motion.button>
        </>
      ) : null}

      <motion.div
        ref={scrollRef}
        role="region"
        aria-label="Featured venues carousel"
        className="scrollbar-hide -mx-1 flex gap-6 overflow-x-auto overscroll-x-contain scroll-smooth px-1 pb-2 pt-1 snap-x snap-mandatory touch-pan-x"
        {...motionProps}
        variants={containerVariants}
      >
        {venues.map((venue) => {
          const badge = venue.tag?.trim() ? venue.tag : undefined;

          return (
            <motion.div
              key={venue.id}
              data-carousel-card
              className="w-[min(82vw,300px)] shrink-0 snap-start sm:w-[280px] md:w-[300px] lg:w-[calc((100%-4.5rem)/4)] lg:max-w-[320px]"
              variants={itemVariants}
            >
              <VenueCard
                id={venue.id}
                image={venue.image}
                title={venue.name}
                location={venue.location}
                price={venue.price}
                rating={venue.rating}
                tag={badge}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
