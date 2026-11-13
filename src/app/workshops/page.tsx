import type { Metadata } from "next";
import { getWorkshops } from "@/lib/api";
import { WorkshopCard } from "@/components/workshop-card";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Workshops",
  description: "Hands-on workshops at iCONICS’26, NED University, Karachi. Places are limited.",
};

export default async function WorkshopsPage() {
  const workshops = await getWorkshops();
  return (
    <>
      <PageHeader
        title="Workshops"
        intro="Hands-on sessions that run alongside the paper presentations. Places are limited; each workshop has its own registration form."
        crumbs={[
          { label: "Programme", href: "/schedule" },
          { label: "Workshops", href: "/workshops" },
        ]}
      />
      <Container className="py-16 md:py-20">
        {workshops.length === 0 ? (
          <p className="text-ink-600">Workshops will be announced here.</p>
        ) : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {workshops.map((w, i) => (
              <WorkshopCard key={w.id} w={w} priority={i < 3} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
