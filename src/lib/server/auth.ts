import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";
import { requireEnv } from "./env";

export const SESSION_COOKIE = "admin_session";
const SESSION_SECONDS = 8 * 60 * 60;

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: { field: string; message: string }[],
  ) {
    super(message);
  }
}

function secret() {
  const s = requireEnv("JWT_SECRET");
  if (s.length < 32) throw new Error("JWT_SECRET must be at least 32 characters");
  return new TextEncoder().encode(s);
}

export async function signSession(admin: { id: string; tokenVersion: number }) {
  return new SignJWT({ ver: admin.tokenVersion, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(secret());
}

export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export type AdminUser = { id: string; email: string; name: string };

/** The signed-in admin, or null. Re-reads the DB so disabling an account or bumping tokenVersion revokes sessions at once. */
export async function getAdmin(): Promise<AdminUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    if (payload.role !== "admin" || !payload.sub) return null;
    const admin = await db.admin.findUnique({ where: { id: payload.sub } });
    if (!admin || !admin.isActive || admin.tokenVersion !== payload.ver) return null;
    return { id: admin.id, email: admin.email, name: admin.name };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) throw new HttpError(401, "Unauthorized");
  return admin;
}
