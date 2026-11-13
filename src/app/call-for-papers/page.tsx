import type { Metadata } from "next";
import { getSettings, getTracks } from "@/lib/api";
import { API_BASE } from "@/lib/api";
import { CONFERENCE } from "@/lib/site";
import { DatesSection } from "@/components/home-sections";
import { ButtonLink, Container, DisabledButton, PageHeader, SectionHead, StatusNote, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Call for papers",
  description: "Research tracks, submission guidelines, templates and publication for iCONICS’26. Paper submissions are now closed.",
};

const SECTIONS = [
  ["status", "Submission status"],
  ["tracks", "Research tracks"],
  ["guidelines", "Submission guidelines"],
  ["templates", "Templates"],
  ["publication", "Publication"],
  ["dates", "Important dates"],
] as const;

export default async function CallForPapersPage() {
  const [tracks, settings] = await Promise.all([getTracks(), getSettings()]);
  const asset = (p?: string) => (p ? (p.startsWith("http") ? p : `${API_BASE}${p}`) : null);
  const latex = asset(settings.cfp_latex_template_url);
  const poster = asset(settings.cfp_poster_url);
  const overleaf = settings.cfp_overleaf_template_url ?? null;

  return (
    <>
      <PageHeader
        title="Call for papers"
        intro="Original, unpublished research across six tracks of computer science. Accepted papers are presented at the conference in Karachi and submitted for publication in IEEE Conference Proceedings."
        crumbs={[{ label: "Call for papers", href: "/call-for-papers" }]}
        aside={
          <div className="border border-white/20 p-5">
            <p className="text-[14px] text-white/60">Submission status</p>
            <p className="mt-1 font-display text-[24px] font-semibold">Closed</p>
            <p className="mt-2 text-[15px] text-white/75">Accepted authors can now register for the conference.</p>
            <ButtonLink href="/registration" variant="on-dark" className="mt-5 w-full">
              Register as an author
            </ButtonLink>
          </div>
        }
      />

      <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-12">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-24">
            <p className="text-[14px] font-semibold text-ink-600">On this page</p>
            <ul className="mt-3 space-y-2 border-l border-line text-[15px]">
              {SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="-ml-px block border-l-2 border-transparent pl-4 text-navy-950/80 hover:border-teal-700 hover:text-teal-700">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="space-y-20 lg:col-span-9">
          <section id="status" className="scroll-mt-24">
            <SectionHead title="Submission status" />
            <StatusNote>
              <strong className="font-semibold">Paper submissions for {CONFERENCE.short} are closed.</strong> Decisions have been
              sent to authors by email. If your paper was accepted, at least one author must register before the
              camera-ready deadline for the paper to be included in the programme and proceedings.
            </StatusNote>
            <div className="mt-8 flex flex-wrap items-start gap-6">
              <DisabledButton reason="The submission system (PaperDesk) no longer accepts new papers.">Submit a paper</DisabledButton>
              <ButtonLink href="/registration">Register an accepted paper</ButtonLink>
            </div>
          </section>

          <section id="tracks" className="scroll-mt-24">
            <SectionHead title="Research tracks" intro="Topics of interest include, but are not limited to, the following." />
            <ol className="border-t border-navy-950">
              {tracks.map((t, i) => (
                <li key={t.id} className="grid gap-2 border-b border-line py-6 md:grid-cols-[96px_1fr] md:gap-4">
                  <span className="pt-1.5 text-[14px] font-semibold tabular-nums text-teal-700">Track {i + 1}</span>
                  <div>
                    <h3 className="text-[22px] leading-snug">{t.name}</h3>
                    <ul className="mt-3 grid gap-x-8 gap-y-1.5 text-[16px] text-ink-600 sm:grid-cols-2">
                      {t.topics.map((topic) => (
                        <li key={topic.id} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[11px] h-px w-2.5 shrink-0 bg-ink-400" />
                          {topic.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="guidelines" className="scroll-mt-24">
            <SectionHead title="Submission guidelines" />
            <dl className="grid gap-px bg-line sm:grid-cols-2">
              {[
                ["Format", "IEEE conference format, using the templates below."],
                ["Length", "Full papers of 6–8 pages, including references."],
                ["Review", "Double-blind peer review by the technical programme committee and external reviewers."],
                ["Originality", "Work must be original and not under review elsewhere. Submissions are checked for similarity."],
                ["Submission system", "PaperDesk, NED University’s conference management system (now closed)."],
                ["Presentation", "At least one author must register and present the paper in person in Karachi."],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface-50 p-6">
                  <dt className="font-display text-[19px] font-semibold">{k}</dt>
                  <dd className="mt-2 text-[16px] leading-relaxed text-ink-600">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="templates" className="scroll-mt-24">
            <SectionHead title="Templates" intro="Use the IEEE conference template for the camera-ready version of accepted papers." />
            <ul className="divide-y divide-line border-y border-line">
              {[
                latex && { label: "LaTeX template", meta: "ZIP archive", href: latex },
                overleaf && { label: "IEEE templates on Overleaf", meta: "Opens Overleaf", href: overleaf },
                { label: "Microsoft Word template", meta: "IEEE Author Center", href: "https://www.ieee.org/conferences/publishing/templates.html" },
                poster && { label: "Call for papers poster", meta: "Image", href: poster },
              ]
                .filter(Boolean)
                .map((item) => {
                  const it = item as { label: string; meta: string; href: string };
                  return (
                    <li key={it.label}>
                      <a href={it.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-6 py-5">
                        <span className="text-[18px] font-semibold group-hover:text-teal-700 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{it.label}</span>
                        <span className="shrink-0 text-[14px] text-ink-600">{it.meta}</span>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </section>

          <section id="publication" className="scroll-mt-24">
            <SectionHead title="Publication" />
            <div className="prose-ic max-w-[680px] text-[17px] leading-[1.7]">
              <p>
                Accepted and presented papers will be submitted for inclusion in IEEE Conference Proceedings, subject to
                approval. Papers from iCONICS’22 are indexed in{" "}
                <a href="https://ieeexplore.ieee.org/xpl/conhome/10099477/proceeding" target="_blank" rel="noreferrer">
                  IEEE Xplore
                </a>
                .
              </p>
              <p>Papers that are not presented at the conference will be excluded from the proceedings.</p>
            </div>
            <p className="mt-6">
              <TextLink href="/previous-conferences">Proceedings of previous editions</TextLink>
            </p>
          </section>
        </div>
      </Container>

      <div id="dates" className="scroll-mt-16 border-t border-line">
        <DatesSection />
      </div>
    </>
  );
}
