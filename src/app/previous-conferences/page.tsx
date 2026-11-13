import type { Metadata } from "next";
import Image from "next/image";
import { getPublications } from "@/lib/api";
import { EDITIONS_ARCHIVE } from "@/lib/editions";
import { country } from "@/lib/people";
import { Caption, Container, Flag, PageHeader, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Previous conferences",
  description: "iCONICS 2016–2024: keynote speakers, themes, statistics and proceedings from previous editions.",
};

const validISSN = (s: string | null) => !!s && /^\d{4}-\d{3}[\dXx]$/.test(s.trim());
const validISBN = (s: string | null) => !!s && [10, 13].includes(s.replace(/[^\dXx]/g, "").length);

export default async function PreviousConferencesPage() {
  const publications = await getPublications();

  return (
    <>
      <PageHeader
        title="Previous conferences"
        intro="Four editions since 2016. Keynote speakers, themes and proceedings from each."
        crumbs={[
          { label: "About", href: "/about" },
          { label: "Previous conferences", href: "/previous-conferences" },
        ]}
      />

      <nav aria-label="Editions" className="sticky top-16 z-30 border-b border-line bg-white">
        <Container>
          <ul className="flex gap-8 overflow-x-auto text-[15px] font-medium">
            {EDITIONS_ARCHIVE.map((e) => (
              <li key={e.year}>
                <a href={`#y${e.year}`} className="inline-flex h-12 items-center whitespace-nowrap text-navy-950/80 hover:text-teal-700">
                  {e.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {EDITIONS_ARCHIVE.map((e, idx) => {
        const pub = publications.find((p) => p.year === String(e.year));
        const ids = [
          validISBN(pub?.isbn ?? null) ? `ISBN ${pub!.isbn}` : null,
          validISSN(pub?.issn ?? null) ? `ISSN ${pub!.issn}` : null,
        ].filter(Boolean);
        return (
          <section key={e.year} id={`y${e.year}`} aria-labelledby={`h${e.year}`} className={`scroll-mt-32 py-16 md:py-20 ${idx % 2 ? "bg-white" : ""} border-b border-line`}>
            <Container className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-[14px] font-semibold text-teal-700">{e.ordinal}</p>
                <h2 id={`h${e.year}`} className="mt-1 text-[40px] leading-none tracking-[-0.01em]">
                  {e.label}
                </h2>
                <p className="mt-3 text-[16px] tabular-nums text-ink-600">{e.dates} · NED University, Karachi</p>
                <p className="mt-6 font-display text-[19px] italic leading-snug">{e.theme}</p>
                <p className="mt-4 text-[17px] leading-[1.7]">{e.summary}</p>

                <dl className="mt-8 grid grid-cols-2 gap-y-6 border-t border-navy-950/15 pt-6 sm:grid-cols-4 lg:grid-cols-2">
                  {e.stats.map((s) => (
                    <div key={s.label} className="border-l-2 border-teal-700/60 pl-4 pr-2">
                      <dt className="text-[13px] leading-snug text-ink-600">{s.label}</dt>
                      <dd className="mt-1 font-display text-[24px] font-semibold tabular-nums">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                {(e.proceedings || ids.length > 0) && (
                  <p className="mt-6 text-[15px]">
                    {e.proceedings && (
                      <TextLink href={e.proceedings.href} external>
                        {e.proceedings.label}
                      </TextLink>
                    )}
                    {ids.length > 0 && <span className="ml-3 text-ink-600">{ids.join(" · ")}</span>}
                  </p>
                )}
              </div>

              <div className="lg:col-span-7">
                <figure>
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-100">
                    <Image src={e.photos[0].src} alt={e.photos[0].alt} fill sizes="(min-width:1024px) 680px, 100vw" className="object-cover" />
                  </div>
                  <Caption>{e.photos[0].alt}.</Caption>
                </figure>
                {e.photos.length > 1 && (
                  <div className="mt-6 grid grid-cols-2 gap-6">
                    {e.photos.slice(1, 3).map((p) => (
                      <figure key={p.src}>
                        <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
                          <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 330px, 50vw" className="object-cover" />
                        </div>
                        <Caption>{p.alt}.</Caption>
                      </figure>
                    ))}
                  </div>
                )}

                <h3 className="mt-10 text-[20px]">Keynote speakers</h3>
                <ul className="mt-4 grid gap-x-8 border-t border-line sm:grid-cols-2">
                  {e.keynotes.map((k) => {
                    const c = country(k.affiliation.split(",").pop() ?? "");
                    return (
                      <li key={k.name} className="border-b border-line py-3">
                        <p className="font-semibold">{k.name}</p>
                        <p className="mt-0.5 flex items-start gap-2 text-[15px] leading-snug text-ink-600">
                          <Flag code={c.code} className="mt-[3px]" />
                          {k.affiliation}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                {e.highlights.length > 0 && (
                  <ul className="mt-6 space-y-2 text-[15px] text-ink-600">
                    {e.highlights.map((h) => (
                      <li key={h} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[10px] h-px w-3 shrink-0 bg-navy-950/40" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
