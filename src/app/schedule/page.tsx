import type { Metadata } from "next";
import { CONFERENCE } from "@/lib/site";
import { ButtonLink, Container, PageHeader, StatusNote, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Programme outline for iCONICS’26, Wednesday 23 and Thursday 24 December 2026, NED University, Karachi.",
};

type Item = { title: string; detail?: string; venue?: string; kind: "ceremony" | "talk" | "break" | "sessions" };

const DAYS: { id: string; label: string; date: string; items: Item[] }[] = [
  {
    id: "day-1",
    label: "Day 1",
    date: "Wednesday 23 December 2026",
    items: [
      { kind: "ceremony", title: "Registration and welcome" },
      { kind: "ceremony", title: "Opening session", detail: "Recitation, national anthem, welcome address and address by the chief guest", venue: "Main Auditorium" },
      { kind: "talk", title: "Keynote talks", venue: "Main Auditorium" },
      { kind: "break", title: "Lunch and prayer break" },
      { kind: "sessions", title: "Technical paper sessions and workshops", detail: "Parallel tracks" },
    ],
  },
  {
    id: "day-2",
    label: "Day 2",
    date: "Thursday 24 December 2026",
    items: [
      { kind: "sessions", title: "Technical paper sessions and workshops", detail: "Parallel tracks" },
      { kind: "talk", title: "Keynote talks", venue: "Main Auditorium" },
      { kind: "break", title: "Lunch and prayer break" },
      { kind: "ceremony", title: "Closing session", detail: "Address by the guest of honour, awards and vote of thanks", venue: "Main Auditorium" },
    ],
  },
];

const KIND_LABEL: Record<Item["kind"], string> = {
  ceremony: "Ceremony",
  talk: "Keynotes",
  break: "Break",
  sessions: "Sessions",
};

export default function SchedulePage() {
  return (
    <>
      <PageHeader
        title="Schedule"
        intro={`Two days at NED University, Karachi: ${CONFERENCE.dates}.`}
        crumbs={[{ label: "Programme", href: "/schedule" }]}
      />
      <Container className="py-16 md:py-20">
        <StatusNote>
          <strong className="font-semibold">Provisional outline.</strong> Session timings, paper assignments and rooms will be
          published here once the technical programme is final. Registered authors will also be notified by email.
        </StatusNote>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-10">
          {DAYS.map((day) => (
            <section key={day.id} aria-labelledby={day.id}>
              <header className="border-b-2 border-navy-950 pb-4">
                <p className="text-[14px] font-semibold text-teal-700">{day.label}</p>
                <h2 id={day.id} className="mt-1 text-[28px] leading-tight">
                  {day.date}
                </h2>
              </header>
              <ol>
                {day.items.map((it, i) => (
                  <li key={i} className={`grid grid-cols-[96px_1fr] gap-5 border-b border-line py-5 ${it.kind === "break" ? "bg-surface-100/60" : ""}`}>
                    <span className={`pl-0 text-[13px] font-semibold ${it.kind === "break" ? "text-ink-600" : "text-teal-700"}`}>{KIND_LABEL[it.kind]}</span>
                    <div>
                      <p className={`leading-snug ${it.kind === "break" ? "text-ink-600" : "font-display text-[19px] font-semibold"}`}>{it.title}</p>
                      {it.detail && <p className="mt-1 text-[15px] text-ink-600">{it.detail}</p>}
                      {it.venue && <p className="mt-1 text-[14px] text-ink-600">{it.venue}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[560px] text-ink-600">
            Keynote speakers and workshop leads are listed on the <TextLink href="/speakers">speakers</TextLink> and{" "}
            <TextLink href="/workshops">workshops</TextLink> pages.
          </p>
          <ButtonLink href="/registration">Register</ButtonLink>
        </div>
      </Container>
    </>
  );
}
