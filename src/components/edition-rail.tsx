import { EDITIONS } from "@/lib/site";

/** 2016 · 2018 · 2022 · 2024 · 2026 — the conference's own history, current edition marked. */
export function EditionRail({ onDark = false, compact = false }: { onDark?: boolean; compact?: boolean }) {
  const current = EDITIONS[EDITIONS.length - 1];
  return (
    <ol aria-label="iCONICS editions" className={`flex flex-wrap items-center gap-y-2 text-[13px] tabular-nums ${onDark ? "text-white/65" : "text-ink-600"}`}>
      {EDITIONS.map((year, i) => {
        const isCurrent = year === current;
        return (
          <li key={year} className="flex items-center">
            {i > 0 && (
              <span aria-hidden="true" className={`mx-2 h-px ${compact ? "w-3" : "w-5 sm:w-7"} ${onDark ? "bg-white/30" : "bg-navy-950/20"}`} />
            )}
            <span aria-current={isCurrent ? "true" : undefined} className={isCurrent ? `font-semibold ${onDark ? "text-teal-300" : "text-teal-700"}` : undefined}>
              {year}
              {isCurrent && <span className="sr-only"> (5th edition, current)</span>}
            </span>
          </li>
        );
      })}
      <li className={`ml-3 whitespace-nowrap font-medium ${onDark ? "text-white" : "text-navy-950"}`} aria-hidden="true">
        5th edition
      </li>
    </ol>
  );
}
