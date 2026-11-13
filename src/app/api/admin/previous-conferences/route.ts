import { db } from "@/lib/server/db";
import { admin, ok } from "@/lib/server/http";

export const GET = admin(async () => ok(await db.previousConferencePublication.findMany({ orderBy: { year: "desc" } })));
