import { clearSessionCookie } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { admin, ok } from "@/lib/server/http";

/** Sign this admin out everywhere: bumping tokenVersion invalidates every outstanding session. */
export const POST = admin(async (_req, { admin: me }) => {
  await db.admin.update({ where: { id: me.id }, data: { tokenVersion: { increment: 1 } } });
  await clearSessionCookie();
  return ok();
});
