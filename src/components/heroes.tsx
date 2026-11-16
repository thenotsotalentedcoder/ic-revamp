import Link from "next/link";
import { CONFERENCE } from "@/lib/site";
import type { Person } from "@/lib/people";
import { EditionRail } from "./edition-rail";
import { HeroSlideshow, type Slide } from "./hero-slideshow";
import { Flag } from "./ui";
import opening24 from "../../public/slideshow/2024-opening-auditorium.jpg";
import siddiqi from "../../public/slideshow/2024-keynote-siddiqi.jpg";
import lectern22 from "../../public/slideshow/2022-lectern-banner.jpg";
import genovese from "../../public/slideshow/2024-keynote-genovese.jpg";
import qa22 from "../../public/slideshow/2022-qa-floor.jpg";
import keynote22 from "../../public/slideshow/2022-lectern-keynote.jpg";
import speaker16 from "../../public/slideshow/4.jpg";
import stage22 from "../../public/slideshow/2022-stage-inaugural.jpg";

/** Every image in public/slideshow/. First slide: 2024 opening; last slide: 2022 inaugural session. */
const SLIDES: Slide[] = [
  { src: opening24, caption: "Delegates and guests at the opening of iCONICS’24", position: "35% 40%" },
  { src: siddiqi, caption: "Prof. Irfan Siddiqi, University of California, Berkeley, delivering a keynote at iCONICS’24", position: "40% 50%" },
  { src: lectern22, caption: "A keynote address at iCONICS’22", position: "70% 35%" },
  { src: genovese, caption: "Prof. Marco Genovese, INRIM (Italy), on quantum sensing and imaging at iCONICS’24", position: "20% 40%" },
  { src: qa22, caption: "Questions from the floor during a session at iCONICS’22", position: "45% 30%" },
  { src: keynote22, caption: "A keynote address at the NED University lectern, iCONICS’22", position: "50% 40%" },
  { src: speaker16, caption: "A speaker presenting at iCONICS’16", position: "50% 35%" },
  { src: stage22, caption: "Inaugural session of iCONICS’22, NED University Main Auditorium", position: "50% 40%" },
];

/** Homepage hero: navy text panel + documentary slideshow (direction B layout, direction A type). */
export function Hero({ people }: { people: Person[] }) {
  const countries = [...new Map(people.filter((p) => p.country.code).map((p) => [p.country.code, p.country])).values()];

  return (
    <section className="on-dark grid bg-navy-950 text-white lg:min-h-[620px] lg:grid-cols-[min(58%,max(41.667%,calc((100vw-1200px)/2+32px+540px)))_1fr]">
      <div className="flex flex-col justify-center px-4 py-12 md:px-8 lg:py-16 lg:pl-[max(32px,calc((100vw-1200px)/2+32px))] lg:pr-12">
        <EditionRail onDark />
        <h1 className="mt-8 text-[52px] leading-[0.95] tracking-[-0.02em] md:text-[76px]">
          {CONFERENCE.brand}
          <span className="text-teal-300">’26</span>
        </h1>
        <p className="mt-5 max-w-[420px] font-display text-[20px] leading-snug text-white/90 md:text-[22px]">
          {CONFERENCE.edition} International Conference on Innovations in Computer Science
        </p>

        <dl className="mt-8 grid grid-cols-[88px_1fr] gap-y-3 border-t border-white/15 pt-6 text-[16px]">
          <dt className="text-white/60">Dates</dt>
          <dd className="font-semibold tabular-nums">{CONFERENCE.dates}</dd>
          <dt className="text-white/60">Venue</dt>
          <dd className="font-medium">{CONFERENCE.venue}, Karachi</dd>
          {countries.length > 0 && (
            <>
              <dt className="text-white/60">Speakers</dt>
              <dd>
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5" aria-label="Speakers travelling from">
                  {countries.map((c) => (
                    <li key={c.code} className="inline-flex items-center gap-1.5 text-[15px]">
                      <Flag code={c.code} />
                      {c.name}
                    </li>
                  ))}
                </ul>
              </dd>
            </>
          )}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            href="/registration"
            className="inline-flex h-12 items-center rounded-[2px] bg-white px-6 text-[16px] font-semibold text-navy-950 transition-colors duration-150 hover:bg-teal-50 active:translate-y-px"
          >
            Register now
          </Link>
          <Link href="/schedule" className="text-[16px] font-semibold underline decoration-white/40 underline-offset-[6px] transition-colors hover:decoration-white">
            Programme
          </Link>
        </div>
        <p className="mt-5 text-[14px] text-white/65">
          <span className="font-semibold text-teal-300">Registration is open.</span> Paper submissions have closed.
        </p>
      </div>

      <div className="relative">
        <HeroSlideshow slides={SLIDES} />
      </div>
    </section>
  );
}
