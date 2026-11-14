import type { Metadata } from "next";
import Image from "next/image";
import { getCommittee, getTracks } from "@/lib/api";
import { CONFERENCE } from "@/lib/site";
import { ButtonLink, Caption, Container, PageHeader, SectionHead, TextLink } from "@/components/ui";
import lecternSeal from "../../../public/photos/2022-speaker-lectern-seal.jpg";
import hall from "../../../public/slideshow/2022-qa-floor.jpg";

export const metadata: Metadata = {
  title: "About",
  description: `About ${CONFERENCE.short}: scope, organisers and the host institution, NED University of Engineering & Technology, Karachi.`,
};

export default async function AboutPage() {
  const [tracks, committee] = await Promise.all([getTracks(), getCommittee()]);
  const leads = committee.filter((m) => m.committeeName === "Organizing Committee").slice(0, 6);

  return (
    <>
      <PageHeader
        title={`About ${CONFERENCE.brand}`}
        intro={`The ${CONFERENCE.edition} International Conference on Innovations in Computer Science, hosted by NED University of Engineering & Technology in Karachi.`}
        crumbs={[{ label: "About", href: "/about" }]}
      />

      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="prose-ic max-w-[680px] text-[18px] leading-[1.7] lg:col-span-7">
            <p className="font-display text-[24px] leading-[1.45]">
              {CONFERENCE.brand} is an international conference for original research in computer science,
              organised by the {CONFERENCE.department} at NED University since 2016.
            </p>
            <p>
              Each edition brings researchers, industry practitioners and students together for two days of
              peer-reviewed paper presentations, invited keynote talks and hands-on workshops. Submissions are reviewed
              double-blind by an international technical programme committee, and accepted papers are published in{" "}
              {CONFERENCE.proceedings.replace(" (subject to approval)", "")} (subject to approval).
            </p>
            <p>
              The {CONFERENCE.edition.toLowerCase()} edition takes place on {CONFERENCE.dates} at NED University’s main
              campus in Karachi, with keynote speakers from universities and industry research labs in the United States,
              the United Kingdom and New Zealand.
            </p>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-line border-y border-line text-[16px]">
              {[
                ["Edition", `${CONFERENCE.edition}, since 2016`],
                ["Dates", CONFERENCE.dates],
                ["Venue", `${CONFERENCE.venue}, Karachi`],
                ["Organised by", CONFERENCE.department],
                ["Proceedings", CONFERENCE.proceedings],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[120px_1fr] gap-4 py-4">
                  <dt className="text-ink-600">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/registration">Register</ButtonLink>
              <ButtonLink href="/previous-conferences" variant="secondary">
                Previous conferences
              </ButtonLink>
            </div>
          </aside>
        </Container>
      </section>

      <section className="border-t border-line bg-white py-16 md:py-24">
        <Container>
          <SectionHead title="Scope" intro="Six research tracks cover the breadth of contemporary computer science." action={<TextLink href="/call-for-papers#tracks">Track topics</TextLink>} />
          <ol className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((t, i) => (
              <li key={t.id} className="flex gap-4 border-t border-navy-950/15 py-5">
                <span className="w-6 shrink-0 pt-0.5 text-[14px] font-semibold tabular-nums text-teal-700">{i + 1}</span>
                <span className="font-display text-[19px] leading-snug">{t.name}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden bg-surface-100">
              <Image src={lecternSeal} alt="A speaker at the NED University lectern during iCONICS’22" fill sizes="(min-width:1024px) 680px, 100vw" placeholder="blur" className="object-cover object-[60%_30%]" />
            </div>
            <Caption>The NED University lectern, Main Auditorium, iCONICS’22.</Caption>
          </figure>
          <div className="lg:col-span-5">
            <SectionHead title="The host" />
            <div className="prose-ic text-[17px] leading-[1.7]">
              <p>
                NED University of Engineering & Technology, founded in 1921, is Pakistan’s oldest engineering
                institution and one of its leading public universities for engineering and computing.
              </p>
              <p>
                The {CONFERENCE.department} organises {CONFERENCE.brand} with partners including IEEE Karachi Section, HEC,
                Sindh HEC, ORIC NED and Ignite.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {leads.length > 0 && (
        <section className="border-t border-line bg-white py-16 md:py-24">
          <Container>
            <SectionHead title="Conference leadership" action={<TextLink href="/committee">All committees</TextLink>} />
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {leads.map((m) => (
                <li key={m.id} className="border-t border-navy-950/15 py-5">
                  <p className="text-[14px] font-semibold text-teal-700">{m.role}</p>
                  <p className="mt-1 font-display text-[19px]">{m.name}</p>
                  <p className="mt-1 text-[15px] text-ink-600">{m.institution}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-5 lg:order-2 lg:col-start-8">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
              <Image src={hall} alt="Audience during a technical session at iCONICS’24" fill sizes="(min-width:1024px) 480px, 100vw" placeholder="blur" className="object-cover" />
            </div>
            <Caption>A technical session at iCONICS’24.</Caption>
          </figure>
          <div className="lg:col-span-6">
            <h2 className="text-[30px] leading-tight">Join us in Karachi this December</h2>
            <p className="mt-4 max-w-[520px] text-ink-600">
              Registration is open for authors of accepted papers, co-authors and attendees. Workshop places are limited.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/registration">Register</ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Contact the organisers
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
