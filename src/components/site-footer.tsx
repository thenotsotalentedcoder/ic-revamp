import Link from "next/link";
import { CONFERENCE } from "@/lib/site";
import { EditionRail } from "./edition-rail";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Conference",
    links: [
      ["About", "/about"],
      ["Previous conferences", "/previous-conferences"],
      ["Committees", "/committee"],
      ["Reviewers", "/reviewers"],
    ],
  },
  {
    title: "Programme",
    links: [
      ["Call for papers", "/call-for-papers"],
      ["Schedule", "/schedule"],
      ["Speakers", "/speakers"],
      ["Workshops", "/workshops"],
    ],
  },
  {
    title: "Attend",
    links: [
      ["Registration & fees", "/registration"],
      ["Sponsors & partners", "/sponsors"],
      ["Contact & venue", "/contact"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="on-dark bg-navy-950 text-white">
      <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-[30px] font-semibold leading-none tracking-[-0.01em]">
              {CONFERENCE.brand}
              <span className="text-teal-300">’26</span>
            </p>
            <p className="mt-4 max-w-[340px] text-[16px] leading-relaxed text-white/75">
              {CONFERENCE.edition} {CONFERENCE.name}
              <br />
              <span className="tabular-nums">{CONFERENCE.dates}</span>, Karachi
            </p>
            <div className="mt-6">
              <EditionRail onDark compact />
            </div>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-5">
            {COLUMNS.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <h2 className="text-[14px] font-semibold text-white/55">{c.title}</h2>
                <ul className="mt-4 space-y-2.5 text-[15px]">
                  {c.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-white/85 transition-colors hover:text-white hover:underline hover:decoration-1 hover:underline-offset-4">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <address className="not-italic lg:col-span-3">
            <h2 className="text-[14px] font-semibold text-white/55">Contact</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/85">
              {CONFERENCE.department}
              <br />
              {CONFERENCE.venue}
              <br />
              {CONFERENCE.address}
            </p>
            <p className="mt-4 space-y-1 text-[15px]">
              <a href={`mailto:${CONFERENCE.email}`} className="block text-teal-300 underline decoration-teal-300/40 underline-offset-4 hover:decoration-teal-300">
                {CONFERENCE.email}
              </a>
              <a href={CONFERENCE.phoneHref} className="block text-white/85">
                {CONFERENCE.phone}
              </a>
            </p>
            <p className="mt-4 flex gap-4 text-[15px]">
              <a href={CONFERENCE.social.linkedin} target="_blank" rel="noreferrer" className="text-white/85 underline decoration-white/30 underline-offset-4 hover:decoration-white">
                LinkedIn
              </a>
              <a href={CONFERENCE.social.facebook} target="_blank" rel="noreferrer" className="text-white/85 underline decoration-white/30 underline-offset-4 hover:decoration-white">
                Facebook
              </a>
            </p>
          </address>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-6 text-[13px] text-white/55 sm:flex-row sm:justify-between">
          <p>© 2026 NED University of Engineering & Technology, Karachi.</p>
          <p>
            {CONFERENCE.brand} is organised by the {CONFERENCE.department}.
          </p>
        </div>
      </div>
    </footer>
  );
}
