import { clearSessionCookie } from "@/lib/server/auth";
import { ok, open } from "@/lib/server/http";

export const POST = open(async () => {
  await clearSessionCookie();
  return ok();
});
