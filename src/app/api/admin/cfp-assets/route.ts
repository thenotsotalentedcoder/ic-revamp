import { db } from "@/lib/server/db";
import { HttpError } from "@/lib/server/auth";
import { admin, ok, readBody, refresh } from "@/lib/server/http";
import { removePublicByUrl, uploadPublic } from "@/lib/server/storage";

/** CFP poster (image) and LaTeX template (zip) go to Supabase public storage; the old backend wrote to local disk. */
export const PUT = admin(async (req) => {
  const { files } = await readBody(req);
  const jobs = [
    { file: files.poster, key: "cfp_poster_url", kind: "image" as const, label: "Poster" },
    { file: files.latexTemplate, key: "cfp_latex_template_url", kind: "zip" as const, label: "LaTeX template" },
  ].filter((j) => j.file);
  if (jobs.length === 0) throw new HttpError(400, "No files provided.");

  for (const j of jobs) {
    const url = await uploadPublic(j.file, "cfp", j.kind, j.label);
    const prev = await db.siteSetting.findUnique({ where: { key: j.key } });
    await db.siteSetting.upsert({ where: { key: j.key }, update: { value: url }, create: { key: j.key, value: url } });
    await removePublicByUrl(prev?.value);
  }
  refresh("settings");
  return ok();
});
