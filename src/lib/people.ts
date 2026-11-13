import type { Speaker } from "./api";
import { INSTITUTION_LOGOS } from "./institutions";

/** One person, possibly with several roles (the API has one row per role). */
export type Person = {
  id: string;
  name: string;
  title: string;
  institution: string;
  country: { name: string; code: string | null };
  photo: string | null;
  bio: string;
  topics: string[];
  workshops: string[];
  links: { label: string; href: string }[];
  isKeynote: boolean;
  isWorkshop: boolean;
  order: number;
  logo: { src: string; w: number; h: number } | null;
};

const COUNTRIES: [RegExp, string, string][] = [
  [/\b(usa|u\.s\.a|united states|america)\b/i, "US", "United States"],
  [/\b(uk|u\.k\.|united kingdom|england|scotland|wales)\b/i, "GB", "United Kingdom"],
  [/new zealand/i, "NZ", "New Zealand"],
  [/(czech|prague)/i, "CZ", "Czech Republic"],
  [/(pakistan|karachi|lahore|islamabad)/i, "PK", "Pakistan"],
  [/ital/i, "IT", "Italy"],
  [/brazil/i, "BR", "Brazil"],
  [/malaysia/i, "MY", "Malaysia"],
  [/ireland/i, "IE", "Ireland"],
  [/germany/i, "DE", "Germany"],
  [/australia/i, "AU", "Australia"],
  [/(uae|emirates)/i, "AE", "United Arab Emirates"],
  [/switzerland/i, "CH", "Switzerland"],
  [/canada/i, "CA", "Canada"],
  [/china/i, "CN", "China"],
  [/saudi/i, "SA", "Saudi Arabia"],
  [/qatar/i, "QA", "Qatar"],
  [/turk/i, "TR", "Türkiye"],
  [/japan/i, "JP", "Japan"],
  [/korea/i, "KR", "South Korea"],
  [/singapore/i, "SG", "Singapore"],
  [/netherlands/i, "NL", "Netherlands"],
  [/france/i, "FR", "France"],
  [/spain/i, "ES", "Spain"],
  [/sweden/i, "SE", "Sweden"],
];

/** Flags available under /public/flags (keep in sync with COUNTRIES). */
export function country(raw: string): Person["country"] {
  for (const [re, code, name] of COUNTRIES) if (re.test(raw)) return { code, name };
  return { code: null, name: raw.trim() };
}

function institutionLogo(institution: string) {
  const hit = INSTITUTION_LOGOS.find((l) => l.match.test(institution));
  return hit ? { src: hit.src, w: hit.w, h: hit.h } : null;
}

/** Tidy free-text institutions like "Department of Physics  Faculty of …  Czech Technical University". */
function tidyInstitution(s: string) {
  return s.replace(/\s{2,}/g, ", ").replace(/\s+,/g, ",").trim();
}

const key = (name: string) =>
  name.toLowerCase().replace(/\b(prof|dr|engr|mr|ms|mrs)\.?\s*/g, "").replace(/[^a-z]/g, "");

export function mergeSpeakers(rows: Speaker[]): Person[] {
  const people = new Map<string, Person>();
  for (const s of rows) {
    const k = key(s.name);
    const existing = people.get(k);
    if (existing) {
      existing.isKeynote ||= s.type === "keynote";
      existing.isWorkshop ||= s.type === "workshop";
      existing.workshops = [...new Set([...existing.workshops, ...s.workshops])];
      existing.order = Math.min(existing.order, s.order);
      if (s.bio.length > existing.bio.length) existing.bio = s.bio;
      continue;
    }
    const links = (
      [
        ["Website", s.website],
        ["Google Scholar", s.scholar],
        ["LinkedIn", s.linkedin],
      ] as const
    )
      .filter(([, href]) => href && /^https?:\/\//.test(href))
      .map(([label, href]) => ({ label, href: href as string }));
    const institution = tidyInstitution(s.institution);
    people.set(k, {
      id: s.id,
      name: s.name.trim(),
      title: s.title.trim(),
      institution,
      country: country(s.country),
      photo: s.photo,
      bio: s.bio.trim(),
      topics: s.topics,
      workshops: s.workshops,
      links,
      isKeynote: s.type === "keynote",
      isWorkshop: s.type === "workshop",
      order: s.order,
      logo: institutionLogo(institution),
    });
  }
  // Keynotes first (in admin order), then everyone else (in admin order). Stable for ties.
  return [...people.values()].sort(
    (a, b) => Number(b.isKeynote) - Number(a.isKeynote) || a.order - b.order,
  );
}

/** Short, readable affiliation: the last comma-separated part is usually the institution. */
export function shortInstitution(institution: string) {
  const parts = institution.split(",").map((p) => p.trim()).filter(Boolean);
  const named = parts.find((p) => /(university|institute|college|school of|lab|inrim)/i.test(p) && !/^department|^faculty/i.test(p));
  return named ?? parts[parts.length - 1] ?? institution;
}

export function roleLabel(p: Person) {
  if (p.isKeynote && p.isWorkshop) return "Keynote · Workshop";
  return p.isKeynote ? "Keynote" : "Workshop";
}
