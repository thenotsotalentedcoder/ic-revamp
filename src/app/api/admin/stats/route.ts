import { db } from "@/lib/server/db";
import { admin, ok } from "@/lib/server/http";

/** Dashboard counts. allSettled so one failing query shows "—" instead of breaking the page. */
export const GET = admin(async () => {
  const jobs = {
    speakers: db.speaker.count(),
    workshops: db.workshop.count(),
    dates: db.importantDate.count(),
    tracks: db.track.count(),
    committee: db.committeeMember.count(),
    reviewers: db.reviewer.count(),
  };
  const keys = Object.keys(jobs) as (keyof typeof jobs)[];
  const results = await Promise.allSettled(keys.map((k) => jobs[k]));
  return ok(Object.fromEntries(keys.map((k, i) => [k, results[i].status === "fulfilled" ? results[i].value : null])));
});
