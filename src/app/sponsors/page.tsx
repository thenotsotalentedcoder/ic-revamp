import type { Metadata } from "next";
import { BalancedLogo } from "@/components/logo";
import { Container, PageHeader, SectionHead } from "@/components/ui";
import { CONFERENCE, ORGANISERS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sponsors & partners",
  description: "Organisers, partners and sponsorship opportunities for iCONICS’26.",
};

const ROLES: Record<string, string> = {
  "NED University of Engineering & Technology": "Host university",
  IEEE: "IEEE Karachi Section",
  "Higher Education Commission, Pakistan": "Partner",
  "Sindh Higher Education Commission": "Partner",
  "ORIC, NED University": "Office of Research, Innovation & Commercialization",
  Ignite: "Partner, National Technology Fund",
};

export default function SponsorsPage() {
  const mail = `mailto:${CONFERENCE.email}?subject=${encodeURIComponent("Sponsorship enquiry, iCONICS’26")}`;
  return (
    <>
      <PageHeader
        title="Sponsors & partners"
        intro="iCONICS’26 is made possible by its host university, academic partners and sponsors."
        crumbs={[{ label: "Sponsors", href: "/sponsors" }]}
      />

      <Container className="py-16 md:py-20">
        <SectionHead title="Organisers & partners" />
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {ORGANISERS.map((o) => (
            <li key={o.name} className="flex flex-col bg-white p-8">
              <div className="flex h-24 items-center">
                <BalancedLogo src={o.src} alt="" w={o.w} h={o.h} area={6400} maxW={220} maxH={88} />
              </div>
              <p className="mt-6 font-display text-[19px] font-semibold leading-snug">{o.name}</p>
              <p className="mt-1 text-[15px] text-ink-600">{ROLES[o.name]}</p>
            </li>
          ))}
        </ul>
      </Container>

      <section className="border-t border-line bg-white py-16 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHead title="Sponsor iCONICS’26" />
            <div className="prose-ic text-[17px] leading-[1.7]">
              <p>
                Sponsorship puts your organisation in front of researchers, faculty and graduating students from
                universities across Pakistan and abroad, over two days at NED University.
              </p>
              <p>
                We are happy to discuss packages such as logo placement on the website and conference materials, a
                sponsored session or workshop, and recognition during the opening and closing sessions.
              </p>
            </div>
            <a href={mail} className="mt-8 inline-flex h-12 items-center rounded-[2px] bg-teal-700 px-6 text-[16px] font-semibold text-white transition-colors hover:bg-teal-800">
              Email the sponsorship team
            </a>
            <p className="mt-3 text-[14px] text-ink-600">{CONFERENCE.email}</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="text-[19px]">Past sponsors include</h3>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-600">
              Trend Micro, Gaditek, Pakistan Single Window, Neuro Computation Lab, OctDaily, Shispare (iCONICS’24); HEC
              Pakistan, USEFP and Pak Suzuki (iCONICS’16).
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
