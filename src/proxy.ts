import { NextResponse, type NextRequest } from "next/server";

/**
 * Optimistic gate for /admin pages: no session cookie → login. This is only a cheap redirect.
 * The real check (signature, isActive, tokenVersion) runs in getAdmin() on every page render and API call.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has("admin_session");
  const res = pathname === "/admin/login" || hasSession ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", req.url));
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
