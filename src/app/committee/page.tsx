import type { Metadata } from "next";
import { getCommittee, type CommitteeMember } from "@/lib/api";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Committees",
  description: "Organising, technical programme and supporting committees of iCONICS’26.",
};

const PRIMARY = ["Organizing Committee", "Technical Program Committee", "IEEE Coordination Committee", "Publications Committee"];
const pretty = (s: string) => s.replace("Organizing", "Organising").replace("Program ", "Programme ");

function Member({ m }: { m: CommitteeMember }) {
  return (
    <li className="grid gap-1 border-b border-line py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
      <span className={`text-[15px] ${m.role ? "font-semibold text-teal-700" : "text-ink-600"}`}>{m.role ?? "Member"}</span>
      <span>
        <span className="font-display text-[18px] font-semibold">{m.name}</span>
        {m.institution && <span className="block text-[15px] text-ink-600">{m.institution}</span>}
      </span>
    </li>
  );
}

export default async function CommitteePage() {
  const members = await getCommittee();
  const groups = new Map<string, CommitteeMember[]>();
  for (const m of members) groups.set(m.committeeName, [...(groups.get(m.committeeName) ?? []), m]);
  const primary = PRIMARY.filter((g) => groups.has(g));
  const supporting = [...groups.keys()].filter((g) => !PRIMARY.includes(g));

  return (
    <>
      <PageHeader
        title="Committees"
        intro={`${members.length} faculty members and volunteers organise iCONICS’26 across ${groups.size} committees.`}
        crumbs={[
          { label: "About", href: "/about" },
          { label: "Committees", href: "/committee" },
        ]}
      />
      <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-12">
        <nav aria-label="Committees" className="lg:col-span-3">
          <div className="lg:sticky lg:top-24">
            <p className="text-[14px] font-semibold text-ink-600">On this page</p>
            <ul className="mt-3 space-y-2 border-l border-line text-[15px]">
              {[...primary, ...supporting].map((g) => (
                <li key={g}>
                  <a href={`#${g.replace(/\W+/g, "-").toLowerCase()}`} className="-ml-px block border-l-2 border-transparent pl-4 text-navy-950/80 hover:border-teal-700 hover:text-teal-700">
                    {pretty(g)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="lg:col-span-9">
          {primary.map((g) => (
            <section key={g} id={g.replace(/\W+/g, "-").toLowerCase()} className="mb-14 scroll-mt-24">
              <h2 className="border-b border-navy-950 pb-3 text-[26px]">{pretty(g)}</h2>
              <ul>
                {groups.get(g)!.map((m) => (
                  <Member key={m.id} m={m} />
                ))}
              </ul>
            </section>
          ))}

          <h2 className="mb-8 mt-4 text-[26px]">Supporting committees</h2>
          <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
            {supporting.map((g) => (
              <section key={g} id={g.replace(/\W+/g, "-").toLowerCase()} className="scroll-mt-24">
                <h3 className="border-b border-navy-950/80 pb-2 text-[19px]">{pretty(g)}</h3>
                <ul className="mt-2">
                  {groups.get(g)!.map((m) => (
                    <li key={m.id} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-[15px]">
                      <span className="font-semibold">{m.name}</span>
                      {m.role && <span className="shrink-0 text-ink-600">{m.role}</span>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
