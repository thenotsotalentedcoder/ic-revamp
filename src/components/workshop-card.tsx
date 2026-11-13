import Image from "next/image";
import Link from "next/link";
import type { Workshop } from "@/lib/api";

/** Only real http(s) links count as a registration link (the DB currently holds placeholders like "google.com"). */
export function workshopFormUrl(w: Workshop) {
  const u = w.registrationLink?.trim();
  return u && /^https?:\/\/[^/]+\.[^/]+/.test(u) && !/^https?:\/\/(www\.)?google\.com\/?$/.test(u) ? u : null;
}

/** Poster-led card: poster (or a typographic cover until the poster is uploaded), then register + details. */
export function WorkshopCard({ w, onDark = false, priority = false }: { w: Workshop; onDark?: boolean; priority?: boolean }) {
  const form = workshopFormUrl(w);
  return (
    <article className="flex flex-col">
      <Link href={`/workshops/${w.slug}`} className="group block" aria-label={`${w.title}: workshop details`}>
        <div className={`relative aspect-[4/5] overflow-hidden ${onDark ? "bg-navy-900 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" : "bg-navy-950"}`}>
          {w.posterImage ? (
            <Image src={w.posterImage} alt={`${w.title} poster`} fill priority={priority} sizes="(min-width:1024px) 360px, (min-width:640px) 45vw, 90vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" />
          ) : (
            <div className="absolute inset-0 flex flex-col justify-between p-7 text-white">
              <div className="flex items-center justify-between text-[13px] text-white/60">
                <span className="font-display text-[16px] font-semibold text-white">
                  iCONICS<span className="text-teal-300">’26</span>
                </span>
                <span>Workshop</span>
              </div>
              <div>
                <span aria-hidden="true" className="mb-5 block h-[3px] w-12 bg-teal-300" />
                <p className="font-display text-[30px] font-semibold leading-[1.08]">{w.title}</p>
                {w.tagline && <p className="mt-3 font-display text-[17px] italic text-white/75">{w.tagline}</p>}
              </div>
              <p className="text-[13px] text-white/55">23–24 December 2026 · NED University, Karachi</p>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-5 flex flex-col gap-3">
        <h3 className={`text-[21px] leading-snug ${onDark ? "text-white" : ""}`}>
          <Link href={`/workshops/${w.slug}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {w.title}
          </Link>
        </h3>
        {form ? (
          <a
            href={form}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex h-12 items-center justify-center rounded-[2px] px-5 text-[16px] font-semibold transition-colors duration-150 active:translate-y-px ${
              onDark ? "bg-white text-navy-950 hover:bg-teal-50" : "bg-teal-700 text-white hover:bg-teal-800"
            }`}
          >
            Register for this workshop
            <span className="sr-only"> (opens a Google Form in a new tab)</span>
          </a>
        ) : (
          <span className={`inline-flex h-12 items-center justify-center rounded-[2px] border border-dashed px-5 text-[15px] ${onDark ? "border-white/30 text-white/70" : "border-ink-400 text-ink-600"}`}>
            Registration opens soon
          </span>
        )}
        <Link href={`/workshops/${w.slug}`} className={`text-[15px] font-semibold underline underline-offset-[5px] ${onDark ? "text-teal-300 decoration-teal-300/40" : "text-teal-700 decoration-teal-700/35"}`}>
          Speakers and details
        </Link>
      </div>
    </article>
  );
}
