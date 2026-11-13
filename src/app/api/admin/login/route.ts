import bcrypt from "bcryptjs";
import { db } from "@/lib/server/db";
import { setSessionCookie, signSession, HttpError } from "@/lib/server/auth";
import { clearKey, clientIp, isBlocked, recordFailure } from "@/lib/server/rate-limit";
import { open, ok, parse, readBody } from "@/lib/server/http";
import { loginSchema } from "@/lib/server/schemas";

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);
const WINDOW = 15 * 60 * 1000;
const MAX_FAILURES = 5;

export const POST = open(async (req) => {
  const key = `login:${clientIp(req)}`;
  if (isBlocked(key, MAX_FAILURES)) throw new HttpError(429, "Too many failed attempts. Try again in 15 minutes.");

  let creds;
  try {
    creds = parse(loginSchema, (await readBody(req)).fields);
  } catch {
    recordFailure(key, WINDOW);
    throw new HttpError(401, "Invalid credentials");
  }

  const admin = await db.admin.findUnique({ where: { email: creds.email } });
  const match = await bcrypt.compare(creds.password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !match || !admin.isActive) {
    recordFailure(key, WINDOW);
    throw new HttpError(401, "Invalid credentials");
  }

  clearKey(key);
  await db.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
  console.log(`Admin login: ${admin.email} from ${clientIp(req)}`);
  await setSessionCookie(await signSession(admin));
  return ok({ email: admin.email, name: admin.name });
});
