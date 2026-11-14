import type { Metadata } from "next";
import { getReviewers, type Reviewer } from "@/lib/api";
import { Container, PageHeader, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "Reviewers",
  description: "Technical reviewers for iCONICS’26 from NED University and partner institutions.",
};

function List({ rows }: { rows: Reviewer[] }) {
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((r) => (
        <li key={r.id} className="border-t border-line py-4">
          <p className="font-display text-[18px] font-semibold leading-snug">{r.name}</p>
          <p className="mt-0.5 text-[15px] text-ink-600">{r.isNed ? "NED University of Engineering & Technology" : (r.from ?? "")}</p>
        </li>
      ))}
    </ul>
  );
}

export default async function ReviewersPage() {
  const reviewers = await getReviewers();
  // Names starting with "Dr" come first; Array.sort is stable, so the existing order is kept within each group.
  const isDr = (r: Reviewer) => /^dr\b/i.test(r.name.trim());
  const drFirst = (rows: Reviewer[]) => [...rows].sort((a, b) => Number(isDr(b)) - Number(isDr(a)));
  const external = drFirst(reviewers.filter((r) => !r.isNed));
  const ned = drFirst(reviewers.filter((r) => r.isNed));

  return (
    <>
      <PageHeader
        title="Reviewers"
        intro={`Every submission to iCONICS’26 was reviewed double-blind. We thank our ${reviewers.length} reviewers for their time and expertise.`}
        crumbs={[
          { label: "About", href: "/about" },
          { label: "Reviewers", href: "/reviewers" },
        ]}
      />
      <Container className="py-16 md:py-20">
        {external.length > 0 && (
          <section className="mb-16">
            <SectionHead title="External reviewers" intro={`${external.length} reviewers from partner universities and industry.`} />
            <List rows={external} />
          </section>
        )}
        {ned.length > 0 && (
          <section>
            <SectionHead title="Departmental reviewers" intro={`${ned.length} reviewers from NED University of Engineering & Technology.`} />
            <List rows={ned} />
          </section>
        )}
        {reviewers.length === 0 && <p className="text-ink-600">The reviewer list will be published here.</p>}
      </Container>
    </>
  );
}
