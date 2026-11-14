import type { Metadata } from "next";
import Image from "next/image";
import { CONFERENCE } from "@/lib/site";
import { Caption, Container, PageHeader, SectionHead, TextLink } from "@/components/ui";
import rows from "../../../public/slideshow/2022-audience-rows.jpg";

export const metadata: Metadata = {
  title: "Contact & venue",
  description: "Contact the iCONICS’26 organisers and find the venue at NED University of Engineering & Technology, Karachi.",
};

const CONTACTS = [
  { topic: "General enquiries", who: "Conference secretariat", email: CONFERENCE.email },
  { topic: "Programme and papers", who: "Conference secretary", email: CONFERENCE.secretaryEmail },
  { topic: "Registration and payments", who: "Ms. Samia Masood Awan, registration coordinator", email: CONFERENCE.email },
  { topic: "Sponsorship", who: "Grants & Sponsorship Committee", email: CONFERENCE.email },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact & venue" intro="Questions about papers, registration, travel or sponsorship." crumbs={[{ label: "Contact", href: "/contact" }]} />

      <Container className="grid gap-14 py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHead title="Who to contact" />
          <ul className="border-t border-navy-950">
            {CONTACTS.map((c) => (
              <li key={c.topic} className="grid gap-2 border-b border-line py-5 sm:grid-cols-[220px_1fr] sm:gap-6">
                <p className="font-display text-[18px] font-semibold">{c.topic}</p>
                <div>
                  <p className="text-[15px] text-ink-600">{c.who}</p>
                  <p className="mt-1">
                    <TextLink href={`mailto:${c.email}`} external>
                      {c.email}
                    </TextLink>
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-[14px] font-semibold text-ink-600">Telephone</dt>
              <dd className="mt-1">
                <a href={CONFERENCE.phoneHref} className="text-[17px] font-medium tabular-nums hover:text-teal-700">
                  {CONFERENCE.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[14px] font-semibold text-ink-600">Social</dt>
              <dd className="mt-1 flex gap-5">
                <TextLink href={CONFERENCE.social.linkedin} external>
                  LinkedIn
                </TextLink>
                <TextLink href={CONFERENCE.social.facebook} external>
                  Facebook
                </TextLink>
              </dd>
            </div>
          </dl>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
              <Image src={rows} alt="Participants in a lecture hall at NED University during iCONICS’22" fill sizes="(min-width:1024px) 400px, 100vw" placeholder="blur" className="object-cover" />
            </div>
            <Caption>NED University main campus, Karachi.</Caption>
          </figure>
          <h2 className="mt-8 text-[22px]">Venue</h2>
          <address className="mt-3 text-[16px] not-italic leading-relaxed">
            {CONFERENCE.department}
            <br />
            {CONFERENCE.venue}
            <br />
            {CONFERENCE.address}
          </address>
          <p className="mt-4">
            <TextLink href={CONFERENCE.mapUrl} external>
              Open in Google Maps
            </TextLink>
          </p>
          <h3 className="mt-8 text-[18px]">Travelling from abroad</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
            Jinnah International Airport (KHI) is about 15 km from the campus. International speakers and delegates
            who need an invitation letter for a visa application can request one from the secretariat, quoting their
            and paper ID.
          </p>
        </aside>
      </Container>
    </>
  );
}
