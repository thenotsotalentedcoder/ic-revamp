import { cacheLife, cacheTag } from "next/cache";

/**
 * Public content from the ICONICS backend (/api/public/*).
 * Everything here is cached into the static shell and refreshed every 5 minutes,
 * or on demand via revalidateTag(<tag>) after an admin save.
 * A failed request returns an empty list rather than breaking the page; each
 * section renders its own empty state.
 */
export const API_BASE =
  process.env.ICONICS_API_URL?.replace(/\/$/, "") ?? "https://iconics.neduet.edu.pk";

export type Speaker = {
  id: string;
  name: string;
  title: string;
  institution: string;
  country: string;
  photo: string | null;
  type: "keynote" | "workshop";
  bio: string;
  topics: string[];
  workshops: string[];
  website: string | null;
  linkedin: string | null;
  scholar: string | null;
  order: number;
};

export type ImportantDate = {
  id: string;
  date: string; // display string, e.g. "September 10, 2026"
  title: string;
  description: string | null;
  order: number;
};

export type Track = {
  id: string;
  name: string;
  order: number;
  topics: { id: string; name: string; order: number }[];
};

export type Workshop = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string;
  posterImage: string | null;
  targetAudience: string | null;
  learningOutcomes: string[];
  registrationLink: string | null;
  order: number;
  sessions: {
    id: string;
    title: string;
    instructorName: string;
    instructorTitle: string;
    instructorInstitution: string;
    instructorCountry: string;
    topics: string[];
    order: number;
  }[];
};

export type SiteSettings = Partial<
  Record<
    | "speakers_active"
    | "schedule_active"
    | "cfp_poster_url"
    | "cfp_latex_template_url"
    | "cfp_overleaf_template_url",
    string
  >
>;

async function getPublic<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}/api/public/${path}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallback;
    const json = (await res.json()) as { success?: boolean; data?: T };
    return json.data ?? fallback;
  } catch {
    return fallback;
  }
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getSpeakers() {
  "use cache";
  cacheLife("minutes");
  cacheTag("speakers");
  return (await getPublic<Speaker[]>("speakers", [])).sort(byOrder);
}

export async function getImportantDates() {
  "use cache";
  cacheLife("minutes");
  cacheTag("dates");
  return (await getPublic<ImportantDate[]>("dates", [])).sort(byOrder);
}

export async function getTracks() {
  "use cache";
  cacheLife("minutes");
  cacheTag("tracks");
  const tracks = await getPublic<Track[]>("tracks", []);
  return tracks
    .sort(byOrder)
    .map((t) => ({ ...t, topics: [...t.topics].sort(byOrder) }));
}

export async function getWorkshops() {
  "use cache";
  cacheLife("minutes");
  cacheTag("workshops");
  return (await getPublic<Workshop[]>("workshops", [])).sort(byOrder);
}

export type CommitteeMember = {
  id: string;
  committeeName: string;
  name: string;
  role: string | null;
  institution: string | null;
  isChair: boolean;
  order: number;
};

/** Reviewer rows also carry an email field; it is deliberately never rendered. */
export type Reviewer = { id: string; name: string; from: string | null; isNed: boolean; order: number };

export type Publication = { id: string; year: string; journalUrl: string | null; isbn: string | null; issn: string | null };

export async function getCommittee() {
  "use cache";
  cacheLife("minutes");
  cacheTag("committee");
  return (await getPublic<CommitteeMember[]>("committee", [])).sort(byOrder);
}

export async function getReviewers() {
  "use cache";
  cacheLife("minutes");
  cacheTag("reviewers");
  const rows = await getPublic<(Reviewer & { email?: string })[]>("reviewers", []);
  // Strip emails at the boundary so they can never reach the client payload.
  return rows.map(({ id, name, from, isNed, order }) => ({ id, name, from, isNed, order })).sort(byOrder);
}

export async function getPublications() {
  "use cache";
  cacheLife("minutes");
  cacheTag("publications");
  return getPublic<Publication[]>("previous-conference-publications", []);
}

export async function getSettings() {
  "use cache";
  cacheLife("minutes");
  cacheTag("settings");
  return getPublic<SiteSettings>("settings", {});
}
