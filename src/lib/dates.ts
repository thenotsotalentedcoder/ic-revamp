const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/**
 * DB dates are free-text display strings ("September 10, 2026", "December 23-24, 2026",
 * "23 December 2026"). Returns the END of the last day in PKT (UTC+5), or null.
 */
export function parseDisplayDate(s: string) {
  const month = MONTHS.findIndex((m) => s.toLowerCase().includes(m));
  const year = s.match(/\b(20\d{2})\b/)?.[1];
  const days = [...s.replace(/\b20\d{2}\b/, "").matchAll(/\b(\d{1,2})\b/g)].map((m) => Number(m[1]));
  if (month < 0 || !year || days.length === 0) return null;
  return Date.UTC(Number(year), month, Math.max(...days), 23 - 5, 59, 59);
}

/** Re-format "September 10, 2026" as "10 September 2026" (international order). */
export function formatDisplayDate(s: string) {
  const m = s.match(/^([A-Za-z]+)\s+(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?,?\s+(20\d{2})$/);
  if (!m) return s.replace("-", "–");
  const [, month, d1, d2, y] = m;
  return `${d1}${d2 ? `–${d2}` : ""} ${month} ${y}`;
}

export type DateRow = { id: string; title: string; display: string; passed: boolean; isNext: boolean; isConference: boolean };

export function annotateDates(rows: { id: string; date: string; title: string }[], now: number): DateRow[] {
  const out = rows.map((d) => {
    const t = parseDisplayDate(d.date);
    return {
      id: d.id,
      title: d.title,
      display: formatDisplayDate(d.date),
      passed: t !== null && t < now,
      isNext: false,
      isConference: /conference/i.test(d.title),
    };
  });
  const next = out.find((d) => !d.passed);
  if (next) next.isNext = true;
  return out;
}
