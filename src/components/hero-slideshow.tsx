"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

export type Slide = {
  src: StaticImageData;
  caption: string;
  credit?: string;
  position?: string; // object-position, keeps the speaker in frame on any crop
};

const INTERVAL = 6500;

/**
 * Slow crossfade between documentary photos of past editions.
 * WCAG 2.2.2: auto-advancing content gets a visible pause control, and
 * prefers-reduced-motion disables auto-advance entirely.
 */
export function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduced || slides.length < 2) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearTimeout(t);
  }, [index, paused, reduced, slides.length]);

  const current = slides[index];

  return (
    <figure className="relative h-full min-h-[340px] overflow-hidden bg-navy-900" aria-roledescription="carousel" aria-label="Photographs from previous editions">
      {slides.map((s, i) => (
        <Image
          key={s.caption}
          src={s.src}
          alt=""
          fill
          priority={i === 0}
          loading={i === 0 ? undefined : "lazy"}
          placeholder="blur"
          sizes="(min-width:1024px) 58vw, 100vw"
          style={{ objectPosition: s.position ?? "center" }}
          className={`object-cover transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Caption bar: tells visitors who is on stage, which is the point of the photos. */}
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[linear-gradient(0deg,rgba(11,27,51,0.88)_0%,rgba(11,27,51,0.55)_65%,transparent_100%)] px-4 pb-4 pt-12 text-white md:px-6">
        <p className="max-w-[560px] font-display text-[15px] italic leading-snug text-white/90" aria-live={paused ? "polite" : "off"}>
          {current.caption}
        </p>
        {slides.length > 1 && (
          <div className="flex shrink-0 items-center gap-3">
            <span className="text-[13px] tabular-nums text-white/70" aria-hidden="true">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="grid size-9 place-items-center rounded-[2px] border border-white/30 transition-colors duration-150 hover:border-white"
              aria-label="Previous photograph"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M8.5 3 4.5 7l4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="grid size-9 place-items-center rounded-[2px] border border-white/30 transition-colors duration-150 hover:border-white"
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              >
                {paused ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 1.5v9M9 1.5v9" stroke="currentColor" strokeWidth="2" />
                  </svg>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="grid size-9 place-items-center rounded-[2px] border border-white/30 transition-colors duration-150 hover:border-white"
              aria-label="Next photograph"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M5.5 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </figcaption>

      {/* Progress hairline */}
      {!reduced && !paused && slides.length > 1 && (
        <span key={index} aria-hidden="true" className="slide-progress absolute inset-x-0 top-0 h-[2px] origin-left bg-teal-300/80" />
      )}
    </figure>
  );
}
