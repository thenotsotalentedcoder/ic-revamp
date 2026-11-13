import type { Metadata } from "next";
import { getSpeakers } from "@/lib/api";
import { mergeSpeakers } from "@/lib/people";
import { SpeakerGrid } from "@/components/speakers";
import { Container, PageHeader, SectionHead, TextLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Speakers",
  description: "Keynote and workshop speakers at iCONICS’26, 23–24 December 2026, NED University, Karachi.",
};

export default async function SpeakersPage() {
  const people = mergeSpeakers(await getSpeakers());
  const keynotes = people.filter((p) => p.isKeynote);
  const others = people.filter((p) => !p.isKeynote);

  return (
    <>
      <PageHeader
        title="Speakers"
        intro="Keynote speakers from universities and industry research labs, and the researchers leading this year’s workshop."
        crumbs={[
          { label: "Programme", href: "/schedule" },
          { label: "Speakers", href: "/speakers" },
        ]}
      />
      <Container className="py-16 md:py-20">
        {people.length === 0 && <p className="text-ink-600">The speaker line-up will be announced here.</p>}
        {keynotes.length > 0 && (
          <section className="mb-20">
            <SectionHead title="Keynote speakers" intro="Select a speaker to read their biography." />
            <SpeakerGrid people={keynotes} variant="keynote" />
          </section>
        )}
        {others.length > 0 && (
          <section>
            <SectionHead title="Workshop speakers" action={<TextLink href="/workshops">Workshops</TextLink>} />
            <SpeakerGrid people={others} variant="standard" />
          </section>
        )}
      </Container>
    </>
  );
}
