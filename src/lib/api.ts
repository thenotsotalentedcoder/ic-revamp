import { cacheLife, cacheTag } from "next/cache";
import { db } from "./server/db";

/**
 * Public content, read straight from the database (Prisma).
 * Everything here is cached into the static shell and refreshed every few minutes,
 * or on demand via revalidateTag(<tag>) when an admin saves (see lib/server/http.ts refresh()).
 * A failed query returns an empty list rather than breaking the page; each
 * section renders its own empty state.
 */

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

/** Run a query; on any failure log it and fall back, so a DB hiccup never takes the page down. */
async function safe<T>(label: string, q: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await q();
  } catch (e) {
    console.error(`[data] ${label} failed`, e);
    return fallback;
  }
}

const asc = { order: "asc" } as const;

export async function getSpeakers(): Promise<Speaker[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("speakers");
  return safe(
    "speakers",
    () =>
      db.speaker.findMany({
        orderBy: asc,
        select: { id: true, name: true, title: true, institution: true, country: true, photo: true, type: true, bio: true, topics: true, workshops: true, website: true, linkedin: true, scholar: true, order: true },
      }) as Promise<Speaker[]>,
    [],
  );
}

export async function getImportantDates(): Promise<ImportantDate[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("dates");
  return safe("dates", () => db.importantDate.findMany({ orderBy: asc, select: { id: true, date: true, title: true, description: true, order: true } }), []);
}

export async function getTracks(): Promise<Track[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("tracks");
  return safe(
    "tracks",
    () =>
      db.track.findMany({
        orderBy: asc,
        select: { id: true, name: true, order: true, topics: { orderBy: asc, select: { id: true, name: true, order: true } } },
      }),
    [],
  );
}

export async function getWorkshops(): Promise<Workshop[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("workshops");
  return safe(
    "workshops",
    () =>
      db.workshop.findMany({
        orderBy: asc,
        select: {
          id: true,
          slug: true,
          title: true,
          tagline: true,
          description: true,
          posterImage: true,
          targetAudience: true,
          learningOutcomes: true,
          registrationLink: true,
          order: true,
          sessions: {
            orderBy: asc,
            select: { id: true, title: true, instructorName: true, instructorTitle: true, instructorInstitution: true, instructorCountry: true, topics: true, order: true },
          },
        },
      }),
    [],
  );
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

/** Reviewer emails are deliberately never selected, so they can't reach the client payload. */
export type Reviewer = { id: string; name: string; from: string | null; isNed: boolean; order: number };

export type Publication = { id: string; year: string; journalUrl: string | null; isbn: string | null; issn: string | null };

export async function getCommittee(): Promise<CommitteeMember[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("committee");
  return safe(
    "committee",
    () => db.committeeMember.findMany({ orderBy: asc, select: { id: true, committeeName: true, name: true, role: true, institution: true, isChair: true, order: true } }),
    [],
  );
}

export async function getReviewers(): Promise<Reviewer[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("reviewers");
  return safe("reviewers", () => db.reviewer.findMany({ orderBy: [asc, { name: "asc" }], select: { id: true, name: true, from: true, isNed: true, order: true } }), []);
}

export async function getPublications(): Promise<Publication[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("publications");
  return safe("publications", () => db.previousConferencePublication.findMany({ orderBy: { year: "desc" }, select: { id: true, year: true, journalUrl: true, isbn: true, issn: true } }), []);
}

export async function getSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("minutes");
  cacheTag("settings");
  return safe(
    "settings",
    async () => {
      const rows = await db.siteSetting.findMany();
      const out: Record<string, string> = { speakers_active: "true", schedule_active: "true" };
      for (const r of rows) out[r.key] = r.value;
      return out as SiteSettings;
    },
    {},
  );
}
