import Image from "next/image";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { getImportantDates, getTracks, getWorkshops } from "@/lib/api";
import { annotateDates, type DateRow } from "@/lib/dates";
import { EDITIONS_ARCHIVE } from "@/lib/editions";
import { PAST_INSTITUTIONS } from "@/lib/institutions";
import type { Person } from "@/lib/people";
import { CONFERENCE, ORGANISERS } from "@/lib/site";
import { BalancedLogo } from "./logo";
import { SpeakerSlider } from "./speakers";
import { WorkshopCard } from "./workshop-card";
import { Container, SectionHead, StatusNote, TextLink } from "./ui";

/* ── Introduction ───────────────────────────────────────────────────── */

export function IntroSection() {
  const facts: [string, string][] = [
    ["Since 2016", "Fifth edition, held at NED University, Karachi"],
    ["IEEE Xplore", "Proceedings indexed since iCONICS’22"],
    ["11 countries", "Home countries of keynote speakers, 2016–2024"],
    ["Peer review", "Every paper double-blind reviewed by an international panel"],
  ];
  return (
    <section aria-labelledby="intro-h" className="py-16 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="intro-h" className="sr-only">
            About {CONFERENCE.short}
          </h2>
          <p className="font-display text-[24px] leading-[1.4] md:text-[30px] md:leading-[1.35]">
            {CONFERENCE.brand} brings researchers, practitioners and students together for two days of peer-reviewed
            papers, keynotes and hands-on workshops across artificial intelligence, quantum technologies,
            cybersecurity, networks, software systems and data science.
          </p>
          <p className="mt-6 max-w-[620px] text-ink-600">
            The conference is organised by the {CONFERENCE.department} at {CONFERENCE.venue}, Pakistan’s oldest
            engineering university, founded in 1921.
          </p>
          <p className="mt-6">
            <TextLink href="/about">About the conference</TextLink>
          </p>
        </div>
        <dl className="grid self-start gap-px bg-navy-950/10 lg:col-span-5 sm:grid-cols-2">
          {facts.map(([k, v]) => (
            <div key={k} className="bg-surface-50 p-5 sm:p-6">
              <dt className="font-display text-[24px] font-semibold leading-tight">{k}</dt>
              <dd className="mt-2 text-[15px] leading-snug text-ink-600">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

/* ── Speakers ───────────────────────────────────────────────────────── */

export function SpeakersSection({ people }: { people: Person[] }) {
  return (
    <section aria-labelledby="speakers-h" className="border-t border-line bg-white py-16 md:py-24">
      <Container>
        <SectionHead
          id="speakers-h"
          title="Speakers"
          intro="Keynote speakers from universities and industry research labs, and the researchers leading this year’s workshop. Select a speaker for their biography."
          action={<TextLink href="/speakers">All speakers</TextLink>}
        />
        {people.length > 0 ? <SpeakerSlider people={people} /> : <p className="text-ink-600">The speaker line-up will be announced here.</p>}
      </Container>
    </section>
  );
}

/* ── Important dates: a real timeline ───────────────────────────────── */

function Timeline({ rows }: { rows: DateRow[] }) {
  return (
    <ol className="relative grid gap-0 md:grid-flow-col md:auto-cols-fr">
      {rows.map((d, i) => {
        const dot = d.isConference
          ? "size-4 bg-navy-950"
          : d.isNext
            ? "size-4 bg-teal-700 ring-4 ring-teal-700/15"
            : d.passed
              ? "size-3 border-2 border-ink-400 bg-white"
              : "size-3 bg-navy-950";
        return (
          <li key={d.id} className="relative grid grid-cols-[24px_1fr] gap-x-4 pb-8 md:block md:pb-0 md:pr-6">
            {/* connector */}
            {i < rows.length - 1 && (
              <span aria-hidden="true" className={`absolute left-[11px] top-3 h-full w-px md:left-0 md:top-[7px] md:h-px md:w-full ${d.passed ? "bg-ink-400/60" : "bg-navy-950/30"}`} />
            )}
            <span aria-hidden="true" className="relative z-10 flex h-4 w-6 items-center justify-center md:w-4 md:justify-start">
              <span className={`block rounded-full ${dot}`} />
            </span>
            <div className="md:mt-5">
              <p className={`text-[14px] tabular-nums ${d.passed ? "text-ink-600" : "font-semibold text-navy-950"}`}>
                {d.passed ? <s className="decoration-ink-400">{d.display}</s> : d.display}
              </p>
              <p className={`mt-1 leading-snug ${d.passed ? "text-ink-600" : "font-semibold"} ${d.isConference ? "font-display text-[19px]" : "text-[16px]"}`}>
                {d.title}
              </p>
              <p className="mt-1 text-[13px] text-ink-600">
                {d.passed ? "Passed" : d.isNext ? <span className="font-semibold text-teal-700">Next</span> : null}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export async function DatesSection() {
  "use cache";
  cacheLife("hours");
  cacheTag("dates");
  // Inside "use cache": the timestamp is captured once per cache lifetime (hourly), which is intended.
  // eslint-disable-next-line react-hooks/purity
  const rows = annotateDates(await getImportantDates(), Date.now());
  return (
    <section aria-labelledby="dates-h" className="py-16 md:py-24">
      <Container>
        <SectionHead id="dates-h" title="Important dates" intro="Deadlines close at 23:59 Pakistan Standard Time (UTC+5)." action={<TextLink href="/call-for-papers#dates">Call for papers</TextLink>} />
        <div className="mb-12">
          <StatusNote>
            <strong className="font-semibold">Paper submissions are closed.</strong> Authors of accepted papers, co-authors and
            attendees can now <TextLink href="/registration">register</TextLink>.
          </StatusNote>
        </div>
        {rows.length > 0 ? <Timeline rows={rows} /> : <p className="text-ink-600">Dates will be published shortly.</p>}
      </Container>
    </section>
  );
}

/* ── Tracks ─────────────────────────────────────────────────────────── */

export async function TracksSection() {
  const tracks = await getTracks();
  return (
    <section aria-labelledby="tracks-h" className="border-t border-line bg-white py-16 md:py-24">
      <Container>
        <SectionHead
          id="tracks-h"
          title="Research tracks"
          intro="Six tracks. Topics include, but are not limited to, those listed."
          action={<TextLink href="/call-for-papers#tracks">Full call for papers</TextLink>}
        />
        <ol className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((t, i) => (
            <li key={t.id} className="border-t border-navy-950/15 py-6">
              <p className="text-[13px] font-semibold tabular-nums text-teal-700">Track {i + 1}</p>
              <h3 className="mt-1 text-[20px] leading-snug">{t.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{t.topics.map((x) => x.name).join(" · ")}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ── Workshops ──────────────────────────────────────────────────────── */

export async function WorkshopsSection() {
  const workshops = await getWorkshops();
  if (workshops.length === 0) return null;
  return (
    <section aria-labelledby="workshops-h" className="on-dark bg-navy-950 py-16 text-white md:py-24">
      <Container>
        <SectionHead id="workshops-h" onDark title="Workshops" intro="Hands-on sessions that run alongside the paper presentations. Each workshop has its own registration." action={<TextLink onDark href="/workshops">All workshops</TextLink>} />
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {workshops.map((w) => (
            <WorkshopCard key={w.id} w={w} onDark />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Previous editions ─────────────────────────────────────────────── */

export function EditionsSection() {
  return (
    <section aria-labelledby="editions-h" className="py-16 md:py-24">
      <Container>
        <SectionHead id="editions-h" title="Previous editions" intro="Four editions since 2016, with keynote speakers from Berkeley, Leeds, INRIM, ID Quantique and more." action={<TextLink href="/previous-conferences">Previous conferences</TextLink>} />
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {EDITIONS_ARCHIVE.map((e) => (
            <li key={e.year}>
              <Link href={`/previous-conferences#y${e.year}`} className="group block">
                <span className="relative block aspect-[4/3] overflow-hidden bg-surface-100">
                  <Image src={e.cover.src} alt={e.cover.alt} fill sizes="(min-width:1024px) 280px, 50vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                </span>
                <span className="mt-4 flex items-baseline justify-between gap-3">
                  <span className="font-display text-[22px] font-semibold group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{e.label}</span>
                  <span className="text-[13px] text-ink-600">{e.ordinal}</span>
                </span>
                <span className="mt-1 block text-[14px] tabular-nums text-ink-600">{e.dates}</span>
                <span className="mt-3 block text-[15px] leading-snug">
                  Keynotes incl. {e.keynotes[0].name}, <span className="text-ink-600">{e.keynotes[0].affiliation}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ── Institutions strip (logos) ─────────────────────────────────────── */

export function InstitutionsStrip() {
  const items = PAST_INSTITUTIONS;
  const row = (dup: boolean) =>
    items.map((l) => (
      <li key={(dup ? "d-" : "") + l.key} aria-hidden={dup || undefined} className="flex h-20 shrink-0 items-center px-8">
        <BalancedLogo src={l.src} alt={dup ? "" : l.name} w={l.w} h={l.h} area={3800} maxW={160} maxH={60} className="grayscale transition-[filter] duration-200 hover:grayscale-0" />
      </li>
    ));
  return (
    <section aria-labelledby="inst-h" className="border-t border-line bg-white py-14 md:py-16">
      <Container>
        <h2 id="inst-h" className="max-w-[760px] text-[20px] leading-snug">
          Researchers from these institutions have spoken at, reviewed for, or organised {CONFERENCE.brand}
        </h2>
      </Container>
      <div className="marquee mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
        <ul className="marquee-track flex w-max items-center">
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </section>
  );
}

/* ── Organisers & partners ──────────────────────────────────────────── */

export function OrganisersSection() {
  return (
    <section aria-labelledby="org-h" className="border-b border-line bg-white">
      <Container className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:gap-12">
        <h2 id="org-h" className="shrink-0 text-[15px] font-semibold leading-snug text-ink-600 lg:w-[150px]">
          Organisers &amp; partners
        </h2>
        <ul className="flex flex-1 flex-wrap items-center gap-x-10 gap-y-6 lg:justify-between">
          {ORGANISERS.map((o) => (
            <li key={o.name}>
              <BalancedLogo src={o.src} alt={o.name} w={o.w} h={o.h} area={3400} maxW={170} maxH={56} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
