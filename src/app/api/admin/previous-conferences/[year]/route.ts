import { db } from "@/lib/server/db";
import { HttpError } from "@/lib/server/auth";
import { admin, ok, parse, readBody, refresh } from "@/lib/server/http";
import { publicationSchema } from "@/lib/server/schemas";

export const PUT = admin<{ year: string }>(async (req, { params }) => {
  if (!/^20\d{2}$/.test(params.year)) throw new HttpError(400, "Invalid year");
  const data = parse(publicationSchema, (await readBody(req)).fields);
  const row = await db.previousConferencePublication.upsert({ where: { year: params.year }, update: data, create: { year: params.year, ...data } });
  refresh("publications");
  return ok(row);
});
