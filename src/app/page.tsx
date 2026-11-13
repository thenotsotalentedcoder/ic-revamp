import { Hero } from "@/components/heroes";
import {
  DatesSection,
  EditionsSection,
  InstitutionsStrip,
  IntroSection,
  OrganisersSection,
  SpeakersSection,
  TracksSection,
  WorkshopsSection,
} from "@/components/home-sections";
import { getSpeakers } from "@/lib/api";
import { mergeSpeakers } from "@/lib/people";

export default async function Home() {
  const people = mergeSpeakers(await getSpeakers());
  return (
    <>
      <Hero people={people} />
      <OrganisersSection />
      <IntroSection />
      <SpeakersSection people={people} />
      <DatesSection />
      <TracksSection />
      <WorkshopsSection />
      <EditionsSection />
      <InstitutionsStrip />
    </>
  );
}
