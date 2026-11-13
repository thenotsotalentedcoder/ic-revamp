import "server-only";
import { z } from "zod";

// Friendlier message for missing fields (default is "expected string, received undefined").
z.config({ customError: (iss) => (iss.input === undefined ? "Required" : undefined) });

/* Shared building blocks. Multipart bodies deliver everything as strings, so these coerce. */

export const str = (max = 200) => z.string().trim().min(1, "Required").max(max);
export const optStr = (max = 500) =>
  z.preprocess((v) => (typeof v === "string" ? v.trim() : v), z.string().max(max).nullish()).transform((v) => (v ? v : null));
export const longText = (max = 8000) => z.string().trim().min(1, "Required").max(max);

export const int = z.preprocess((v) => (v === "" || v == null ? 0 : Number(v)), z.number().int().min(-100000).max(100000));

export const bool = z.preprocess((v) => v === true || v === "true" || v === "on" || v === "1", z.boolean());

/** Accepts an array, or a JSON-encoded array (multipart), and cleans each entry. */
export const list = (max = 60, itemMax = 300) =>
  z.preprocess(
    (v) => {
      if (typeof v === "string") {
        try {
          return JSON.parse(v);
        } catch {
          return v;
        }
      }
      return v ?? [];
    },
    z.array(z.string().trim().max(itemMax)).max(max),
  ).transform((a) => a.filter(Boolean));

const urlish = z
  .string()
  .trim()
  .max(500)
  .refine((v) => /^https?:\/\//i.test(v), "Must start with http:// or https://");
export const optUrl = z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? null : v), urlish.nullish()).transform((v) => v ?? null);

export const optEmail = z
  .preprocess((v) => (typeof v === "string" && v.trim() === "" ? null : v), z.string().trim().email("Enter a valid email").max(254).nullish())
  .transform((v) => v ?? null);

export const email = z.string().trim().toLowerCase().email("Enter a valid email").max(254);

export const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single dashes");

/* ── Admin resources ─────────────────────────────────────────────────── */

export const speakerSchema = z.object({
  name: str(150),
  title: str(200),
  institution: str(300),
  country: str(100),
  type: z.enum(["keynote", "workshop"]),
  bio: longText(),
  topics: list(),
  workshops: list(),
  website: optUrl,
  linkedin: optUrl,
  scholar: optUrl,
  order: int,
});

export const workshopSchema = z.object({
  slug,
  title: str(200),
  tagline: str(300),
  description: longText(),
  registrationLink: optUrl,
  targetAudience: optStr(4000),
  learningOutcomes: list(30, 500),
  order: int,
});

export const sessionSchema = z.object({
  title: str(200),
  instructorName: str(150),
  instructorTitle: str(200),
  instructorInstitution: str(300),
  instructorCountry: str(100),
  topics: list(),
  order: int,
});

export const dateSchema = z.object({
  date: str(100),
  title: str(200),
  description: z.preprocess((v) => v ?? "", z.string().trim().max(1000)),
  order: int,
});

export const trackSchema = z.object({ name: str(200), icon: z.preprocess((v) => v || "book", z.string().trim().max(50)), order: int });
export const topicSchema = z.object({ name: str(300), order: int });

export const COMMITTEES = [
  "Organizing",
  "IEEE Coordination",
  "Publications",
  "Technical Program",
  "Finance",
  "Website & Socials",
  "Grants & Sponsorship",
  "Travel, Accommodation & Protocol",
  "Publicity",
  "Shield & Certificates",
  "Registration",
  "Reception",
  "Catering",
  "IT Support",
] as const;

export const committeeSchema = z.object({
  committeeName: str(150),
  name: str(150),
  role: str(150),
  institution: optStr(300),
  email: optEmail,
  isChair: bool,
  order: int,
});

export const reviewerSchema = z.object({ name: str(150), email: optEmail, from: optStr(300), isNed: bool, order: int });

export const publicationSchema = z.object({ journalUrl: optUrl, isbn: optStr(50), issn: optStr(50) });

/** Settings the site understands. Anything else is rejected. */
export const SETTING_KEYS = ["speakers_active", "schedule_active", "cfp_poster_url", "cfp_latex_template_url", "cfp_overleaf_template_url"] as const;
export const settingSchema = z.object({
  key: z.enum(SETTING_KEYS),
  value: z.string().trim().max(1000),
});

export const loginSchema = z.object({ email: z.string().trim().toLowerCase().max(254), password: z.string().min(1).max(200) });
