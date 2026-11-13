import { db } from "@/lib/server/db";
import { admin, ok, parse, readBody, refresh } from "@/lib/server/http";
import { settingSchema } from "@/lib/server/schemas";

const DEFAULTS: Record<string, string> = { speakers_active: "true", schedule_active: "true" };

export const GET = admin(async () => {
  const rows = await db.siteSetting.findMany();
  const out = { ...DEFAULTS };
  for (const r of rows) out[r.key] = r.value;
  return ok(out);
});

/** Only known keys are accepted (the old backend let any admin set any key). */
export const PUT = admin(async (req) => {
  const { key, value } = parse(settingSchema, (await readBody(req)).fields);
  if (/^(speakers|schedule)_active$/.test(key) && value !== "true" && value !== "false") {
    return Response.json({ success: false, message: "Value must be true or false" }, { status: 400 });
  }
  if (key === "cfp_overleaf_template_url" && value && !/^https?:\/\//i.test(value)) {
    return Response.json({ success: false, message: "Link must start with http:// or https://" }, { status: 400 });
  }
  await db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  refresh("settings");
  return ok();
});
