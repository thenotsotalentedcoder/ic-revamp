import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { EditionRail } from "./edition-rail";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-4 md:px-8 ${className}`}>{children}</div>;
}

/* ── Buttons ─────────────────────────────────────────────────────────────
   Square-shouldered (2px), solid, text only. One primary per view.
   Hover darkens; press nudges down 1px; focus uses the global ring. */

type ButtonVariant = "primary" | "secondary" | "on-dark" | "on-dark-secondary";

const BTN_BASE =
  "inline-flex h-12 items-center justify-center rounded-[2px] px-6 text-[16px] font-semibold tracking-[0.005em] transition-[background-color,color,border-color,transform] duration-150 ease-out active:translate-y-px";

const BTN: Record<ButtonVariant, string> = {
  primary: "bg-teal-700 text-white hover:bg-teal-800",
  secondary: "border border-navy-950/25 bg-white text-navy-950 hover:border-navy-950",
  "on-dark": "bg-white text-navy-950 hover:bg-teal-50",
  "on-dark-secondary": "border border-white/35 text-white hover:border-white",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link {...props} className={`${BTN_BASE} ${BTN[variant]} ${className}`} />;
}

/** Non-clickable button. `reason` shows on hover (title) and to screen readers; pass `showReason` to print it under the button too. */
export function DisabledButton({ children, reason, showReason = false }: { children: ReactNode; reason: string; showReason?: boolean }) {
  return (
    <span className="inline-flex flex-col gap-2">
      <span
        role="button"
        aria-disabled="true"
        tabIndex={0}
        title={reason}
        aria-label={`${typeof children === "string" ? children : "Unavailable"}. ${reason}`}
        className={`${BTN_BASE} cursor-not-allowed select-none border border-dashed border-ink-400 bg-surface-100 text-ink-600 active:translate-y-0`}
      >
        {children}
      </span>
      {showReason && <span className="text-[14px] text-ink-600">{reason}</span>}
    </span>
  );
}

export function buttonClass(variant: ButtonVariant = "primary") {
  return `${BTN_BASE} ${BTN[variant]}`;
}

/* ── Links ───────────────────────────────────────────────────────────── */

export function TextLink({
  href,
  children,
  external = false,
  onDark = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  onDark?: boolean;
}) {
  const cls = `font-semibold underline decoration-1 underline-offset-[5px] transition-colors duration-150 ${
    onDark
      ? "text-teal-300 decoration-teal-300/40 hover:decoration-teal-300"
      : "text-teal-700 decoration-teal-700/35 hover:text-teal-800 hover:decoration-teal-800"
  }`;
  if (external)
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* ── Section heading ─────────────────────────────────────────────────────
   A full-width hairline with a short teal segment at its start (the one
   recurring signature mark), then title + optional link on one baseline. */

export function SectionHead({
  title,
  intro,
  action,
  id,
  onDark = false,
}: {
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
  id?: string;
  onDark?: boolean;
}) {
  return (
    <header className="mb-10 md:mb-12">
      <div className={`relative h-px ${onDark ? "bg-white/20" : "bg-navy-950/15"}`}>
        <span aria-hidden="true" className={`absolute left-0 top-[-1px] h-[3px] w-12 ${onDark ? "bg-teal-300" : "bg-teal-700"}`} />
      </div>
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-10">
        <h2 id={id} className="text-[28px] leading-[1.15] tracking-[-0.005em] md:text-[34px]">
          {title}
        </h2>
        {action && <div className="shrink-0 text-[15px]">{action}</div>}
      </div>
      {intro && (
        <p className={`mt-3 max-w-[680px] text-[17px] ${onDark ? "text-white/75" : "text-ink-600"}`}>{intro}</p>
      )}
    </header>
  );
}

/* ── Page header (inner pages) ───────────────────────────────────────── */

export function PageHeader({
  title,
  intro,
  crumbs = [],
  aside,
  asideAlign = "end",
  extra,
}: {
  title: string;
  intro?: ReactNode;
  crumbs?: { label: string; href: string }[];
  aside?: ReactNode;
  /** Tall asides (e.g. a poster) read better centred against the title. */
  asideAlign?: "end" | "center";
  /** Rendered under the intro, in the left column. */
  extra?: ReactNode;
}) {
  return (
    <section className="on-dark bg-navy-950 text-white">
      <Container className="pb-12 pt-10 md:pb-16 md:pt-14">
        <nav aria-label="Breadcrumb" className="text-[14px] text-white/60">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link href="/" className="hover:text-white hover:underline hover:underline-offset-4">
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.href} className="flex items-center gap-x-2">
                <span aria-hidden="true">/</span>
                <Link href={c.href} className="hover:text-white hover:underline hover:underline-offset-4">
                  {c.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className={`mt-8 grid gap-10 lg:grid-cols-12 ${asideAlign === "center" ? "lg:items-center" : "lg:items-end"}`}>
          <div className={asideAlign === "center" ? "lg:col-span-7" : "lg:col-span-8"}>
            <h1 className="text-[40px] leading-[1.05] tracking-[-0.01em] md:text-[56px]">{title}</h1>
            {intro && <div className="mt-5 max-w-[640px] text-[18px] leading-relaxed text-white/80">{intro}</div>}
            {extra && <div className="mt-8">{extra}</div>}
          </div>
          {aside && <div className={asideAlign === "center" ? "lg:col-span-5" : "lg:col-span-4"}>{aside}</div>}
        </div>
      </Container>
      <div className="border-t border-navy-800">
        <Container className="py-4">
          <EditionRail onDark />
        </Container>
      </div>
    </section>
  );
}

/* ── Figure with caption ─────────────────────────────────────────────── */

export function Caption({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <figcaption className={`mt-3 font-display text-[14px] italic leading-snug ${onDark ? "text-white/65" : "text-ink-600"}`}>
      {children}
    </figcaption>
  );
}

/* ── Status note (the one tinted block) ─────────────────────────────── */

export function StatusNote({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="flex gap-3 bg-teal-50 px-5 py-4 text-[16px] leading-relaxed">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="mt-[3px] shrink-0 text-teal-700">
        <circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 8v5M9 5.2v.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <div>{children}</div>
    </div>
  );
}

/* ── Flag (3:2 SVG from /public/flags) ──────────────────────────────── */

export function Flag({ code, className = "" }: { code: string | null; className?: string }) {
  if (!code) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny static SVG, no optimisation needed
    <img
      src={`/flags/${code}.svg`}
      alt=""
      width={21}
      height={14}
      className={`inline-block h-[14px] w-[21px] shrink-0 shadow-[0_0_0_1px_rgba(11,27,51,0.12)] ${className}`}
    />
  );
}
