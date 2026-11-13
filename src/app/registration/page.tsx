import type { Metadata } from "next";
import { Container, PageHeader, SectionHead, StatusNote, TextLink } from "@/components/ui";
import { EARLY_BIRD, PAYMENT, REG_FORMS, REGISTRATION_EMAIL, REGISTRATION_TYPES, RULES, type RegistrationType } from "@/lib/fees";

export const metadata: Metadata = {
  title: "Registration & fees",
  description: "Fees and registration for iCONICS’26: paper and co-author, attendee and group registration. Early-bird rates for paper registration.",
};

function FormButton({ label, url, primary }: { label: string; url: string; primary: boolean }) {
  if (!url)
    return (
      <span className="flex h-12 w-full items-center justify-between rounded-[2px] border border-dashed border-ink-400 px-4 text-[15px] text-ink-600" aria-disabled="true">
        <span className="font-semibold">{label}</span>
        <span className="text-[13px]">Form link coming soon</span>
      </span>
    );
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`group flex h-12 w-full items-center justify-between rounded-[2px] px-4 text-[16px] font-semibold transition-colors duration-150 active:translate-y-px ${
        primary ? "bg-teal-700 text-white hover:bg-teal-800" : "border border-navy-950/25 bg-white text-navy-950 hover:border-navy-950"
      }`}
    >
      {label}
      <span className="text-[13px] font-medium opacity-80">
        Google Form
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  );
}

function TypeColumn({ t, featured }: { t: RegistrationType; featured: boolean }) {
  return (
    <article className={`flex flex-col bg-white ${featured ? "shadow-[0_0_0_1px_rgba(11,27,51,0.9)]" : "shadow-[0_0_0_1px_rgba(11,27,51,0.12)]"}`}>
      <header className={`px-6 pb-5 pt-6 ${featured ? "bg-navy-950 text-white" : ""}`}>
        <h3 className="text-[24px] leading-tight">{t.title}</h3>
        <p className={`mt-2 text-[15px] leading-snug ${featured ? "text-white/75" : "text-ink-600"}`}>{t.summary}</p>
      </header>
      <dl className="divide-y divide-line px-6">
        {t.fees.map((f) => (
          <div key={f.label + (f.detail ?? "")} className="flex items-baseline justify-between gap-4 py-4">
            <dt>
              <span className="block text-[16px] font-medium">{f.label}</span>
              {f.detail && <span className="block text-[14px] text-ink-600">{f.detail}</span>}
            </dt>
            <dd className="shrink-0 font-display text-[22px] font-semibold tabular-nums">{f.amount}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto px-6 pb-6 pt-2">
        <ul className="mb-6 space-y-1.5 border-t border-line pt-4 text-[15px] text-ink-600">
          {t.includes.map((i) => (
            <li key={i} className="flex gap-2.5">
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" className="mt-[5px] shrink-0 text-teal-700">
                <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {i}
            </li>
          ))}
        </ul>
        {t.note && <p className="mb-4 text-[14px] text-ink-600">{t.note}</p>}
        <div className="space-y-2.5">
          {t.actions.map((a, i) => (
            <FormButton key={a.form} label={a.label} url={REG_FORMS[a.form]} primary={i === 0} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function RegistrationPage() {
  return (
    <>
      <PageHeader
        title="Registration & fees"
        intro="Registration is open. Choose your category, pay by bank transfer, then submit the registration form with your receipt."
        crumbs={[{ label: "Registration", href: "/registration" }]}
        aside={
          <ol className="space-y-4 text-[15px]">
            {["Choose your registration category", "Pay the fee by bank transfer", "Submit the Google Form with your receipt", "Receive confirmation by email"].map((s, i) => (
              <li key={s} className="flex gap-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/30 text-[13px] font-semibold tabular-nums text-teal-300">{i + 1}</span>
                <span className="pt-0.5 text-white/85">{s}</span>
              </li>
            ))}
          </ol>
        }
      />

      {/* Early bird band */}
      <section aria-labelledby="early" className="border-b border-line bg-teal-50">
        <Container className="grid gap-6 py-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-4">
            <h2 id="early" className="text-[24px] leading-tight">
              Early-bird registration
            </h2>
            <p className="mt-1 text-[15px] text-ink-600">
              {EARLY_BIRD.deadline ? `Until ${EARLY_BIRD.deadline}. ` : "Deadline to be announced. "}Paper registration only; no other early-bird offer.
            </p>
          </div>
          <dl className="grid gap-px bg-teal-700/20 sm:grid-cols-2 md:col-span-8">
            {EARLY_BIRD.fees.map((f) => (
              <div key={f.amount} className="flex items-baseline justify-between gap-4 bg-teal-50 px-5 py-3 sm:bg-white">
                <dt>
                  <span className="block font-medium">{f.label}</span>
                  <span className="block text-[14px] text-ink-600">{f.detail}</span>
                </dt>
                <dd className="font-display text-[26px] font-semibold tabular-nums text-teal-800">{f.amount}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section aria-labelledby="categories" className="py-16 md:py-20">
        <Container>
          <SectionHead id="categories" title="Choose your registration" intro="Each category opens its own Google Form. Have your transaction receipt ready before you start." />
          <div className="mb-10">
            <StatusNote>
              <strong className="font-semibold">Paper submissions are closed.</strong> Paper registration is only for authors whose papers have been accepted.
            </StatusNote>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {REGISTRATION_TYPES.map((t, i) => (
              <TypeColumn key={t.key} t={t} featured={i === 0} />
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="payment" className="border-t border-line bg-white py-16 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead id="payment" title="Payment details" />
            <dl className="divide-y divide-line border-y border-line text-[16px]">
              {[
                ["Bank", PAYMENT.bank],
                ["Account title", PAYMENT.accountTitle],
                ["Account number", PAYMENT.accountNumber],
                ["IBAN", PAYMENT.iban],
                ["Branch", PAYMENT.branch],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_1fr] gap-4 py-3.5">
                  <dt className="text-ink-600">{k}</dt>
                  <dd className={`font-semibold ${/number|IBAN/.test(k) ? "font-mono tracking-wide" : ""}`} translate="no">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[13px] text-ink-600">Fees are non-refundable.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHead title="Before you register" />
            <ul className="space-y-3 text-[16px] leading-relaxed">
              {RULES.map((r) => (
                <li key={r} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[12px] h-px w-3 shrink-0 bg-navy-950/50" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[16px]">
              Questions about registration or payment:{" "}
              <TextLink href={`mailto:${REGISTRATION_EMAIL}`} external>
                {REGISTRATION_EMAIL}
              </TextLink>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
