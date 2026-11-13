import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24 md:py-32">
      <p className="text-[14px] font-semibold text-teal-700">404</p>
      <h1 className="mt-2 text-[40px] leading-tight md:text-[52px]">This page could not be found</h1>
      <p className="mt-4 max-w-[560px] text-[18px] text-ink-600">
        The page may have moved when the site was updated. These are the pages most people look for:
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/registration">Registration</ButtonLink>
        <ButtonLink href="/call-for-papers" variant="secondary">
          Call for papers
        </ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Home
        </ButtonLink>
      </div>
    </Container>
  );
}
