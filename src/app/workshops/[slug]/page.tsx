import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSpeakers, getWorkshops } from "@/lib/api";
import { mergeSpeakers } from "@/lib/people";
import { SpeakerGrid } from "@/components/speakers";
import { Container, PageHeader, SectionHead } from "@/components/ui";
import { workshopFormUrl } from "@/components/workshop-card";
import Image from "next/image";
import { CONFERENCE } from "@/lib/site";

export async function generateStaticParams() {
  const workshops = await getWorkshops();
  return workshops.length ? workshops.map((w) => ({ slug: w.slug })) : [{ slug: "quantum-computing" }];
}

export async function generateMetadata({ params }: PageProps<"/workshops/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = (await getWorkshops()).find((x) => x.slug === slug);
  return w ? { title: w.title, description: w.tagline ?? w.description.slice(0, 150) } : { title: "Workshop" };
}

export default async function WorkshopPage({ params }: PageProps<"/workshops/[slug]">) {
  const { slug } = await params;
  const [workshops, speakers] = await Promise.all([getWorkshops(), getSpeakers()]);
  const w = workshops.find((x) => x.slug === slug);
  if (!w) notFound();
  const leads = mergeSpeakers(speakers).filter((p) => p.workshops.includes(w.title));
  const sessions = [...w.sessions].sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHeader
        title={w.title}
        intro={w.tagline ?? undefined}
        crumbs={[
          { label: "Workshops", href: "/workshops" },
          { label: w.title, href: `/workshops/${w.slug}` },
        ]}
        aside={
          <dl className="divide-y divide-white/15 border-y border-white/15 text-[15px]">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-white/60">When</dt>
              <dd className="text-right font-medium">{CONFERENCE.dates}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-white/60">Where</dt>
              <dd className="text-right font-medium">NED University, Karachi</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-white/60">Places</dt>
              <dd className="text-right font-medium">Limited · registration required</dd>
            </div>
          </dl>
        }
      />

      {/* Requirement: speakers first, details below, register at the end. */}
      {leads.length > 0 && (
        <section className="border-b border-line bg-white py-16 md:py-20">
          <Container>
            <SectionHead title={leads.length > 1 ? "Workshop speakers" : "Workshop speaker"} intro="Select a speaker to read their biography." />
            <SpeakerGrid people={leads} variant="standard" />
          </Container>
        </section>
      )}

      <section className="py-16 md:py-20">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead title="About the workshop" />
            <p className="text-[18px] leading-[1.75]">{w.description}</p>

            {w.learningOutcomes.length > 0 && (
              <>
                <h3 className="mt-12 text-[22px]">What you will learn</h3>
                <ol className="mt-4 border-t border-line">
                  {w.learningOutcomes.map((o, i) => (
                    <li key={o} className="flex gap-5 border-b border-line py-4 text-[17px]">
                      <span className="w-5 shrink-0 font-semibold tabular-nums text-teal-700">{i + 1}</span>
                      {o}
                    </li>
                  ))}
                </ol>
              </>
            )}

            {sessions.length > 0 && (
              <>
                <h3 className="mt-12 text-[22px]">Sessions</h3>
                <ol className="mt-4 border-t border-line">
                  {sessions.map((s) => (
                    <li key={s.id} className="border-b border-line py-5">
                      <p className="font-display text-[19px] font-semibold">{s.title}</p>
                      <p className="mt-1 text-[15px] text-ink-600">
                        {s.instructorName}, {s.instructorTitle}, {s.instructorInstitution} ({s.instructorCountry})
                      </p>
                      {s.topics.length > 0 && <p className="mt-2 text-[15px]">{s.topics.join(" · ")}</p>}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            {w.posterImage && (
              <div className="relative mb-10 aspect-[4/5] overflow-hidden bg-surface-100">
                <Image src={w.posterImage} alt={`${w.title} poster`} fill sizes="(min-width:1024px) 360px, 100vw" className="object-cover" />
              </div>
            )}
            {w.targetAudience && (
              <div className="border-t-2 border-navy-950 pt-5">
                <h3 className="text-[19px]">Who should attend</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-ink-600">{w.targetAudience}</p>
              </div>
            )}
            <div className="mt-10 border-t-2 border-navy-950 pt-5">
              <h3 className="text-[19px]">Certificate</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
                Participants who attend the full workshop can request a certificate of attendance when registering.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      <section className="on-dark bg-navy-950 py-14 text-white">
        <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[28px] leading-tight">Register for this workshop</h2>
            <p className="mt-2 text-white/75">Places are limited and confirmed in order of registration.</p>
          </div>
          {workshopFormUrl(w) ? (
            <a
              href={workshopFormUrl(w)!}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-[2px] bg-white px-6 text-[16px] font-semibold text-navy-950 transition-colors duration-150 hover:bg-teal-50 active:translate-y-px"
            >
              Register for the workshop
              <span className="sr-only"> (opens a Google Form in a new tab)</span>
            </a>
          ) : (
            <span className="inline-flex h-12 items-center rounded-[2px] border border-dashed border-white/35 px-6 text-[15px] text-white/75">Registration opens soon</span>
          )}
        </Container>
      </section>
    </>
  );
}
