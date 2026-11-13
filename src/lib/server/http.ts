import "server-only";
import { ZodError, type ZodType } from "zod";
import { revalidateTag } from "next/cache";
import { HttpError, requireAdmin, type AdminUser } from "./auth";
import { UploadError } from "./storage";

export const ok = (data?: unknown, status = 200) => Response.json({ success: true, ...(data === undefined ? {} : { data }) }, { status });

function fail(status: number, message: string, errors?: unknown) {
  return Response.json({ success: false, message, ...(errors ? { errors } : {}) }, { status });
}

/** Turn anything thrown inside a handler into a safe JSON response. 5xx never leaks internals. */
export function toResponse(e: unknown): Response {
  if (e instanceof HttpError) return fail(e.status, e.message, e.errors);
  if (e instanceof UploadError) return fail(400, e.message);
  if (e instanceof ZodError) {
    return fail(
      400,
      "Validation failed",
      e.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    );
  }
  const code = (e as { code?: string })?.code;
  if (code === "P2002") return fail(409, "That value is already in use.");
  if (code === "P2025") return fail(404, "Not found");
  console.error(e);
  return fail(500, "Internal server error");
}

/** Reject cross-site writes. SameSite=strict already covers browsers; this is defence in depth. */
function assertSameOrigin(req: Request) {
  if (req.method === "GET" || req.method === "HEAD") return;
  const origin = req.headers.get("origin");
  if (!origin) return;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  let h: string | null = null;
  try {
    h = new URL(origin).host;
  } catch {
    /* invalid */
  }
  if (!host || h !== host) throw new HttpError(403, "Forbidden");
}

type Ctx<P> = { params: Promise<P> };

/** Wrap an admin route handler: same-origin check, session + DB check, uniform errors. */
export function admin<P = Record<string, never>>(fn: (req: Request, ctx: { params: P; admin: AdminUser }) => Promise<Response>) {
  return async (req: Request, ctx: Ctx<P>) => {
    try {
      assertSameOrigin(req);
      const me = await requireAdmin();
      return await fn(req, { params: await ctx.params, admin: me });
    } catch (e) {
      return toResponse(e);
    }
  };
}

/** Public (unauthenticated) route wrapper with the same error handling. */
export function open<P = Record<string, never>>(fn: (req: Request, ctx: { params: P }) => Promise<Response>) {
  return async (req: Request, ctx: Ctx<P>) => {
    try {
      assertSameOrigin(req);
      return await fn(req, { params: await ctx.params });
    } catch (e) {
      return toResponse(e);
    }
  };
}

/** Parse a JSON or multipart body into plain fields plus uploaded files. */
export async function readBody(req: Request): Promise<{ fields: Record<string, unknown>; files: Record<string, File> }> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("multipart/form-data")) {
    const fd = await req.formData();
    const fields: Record<string, unknown> = {};
    const files: Record<string, File> = {};
    for (const [k, v] of fd.entries()) {
      if (typeof v === "string") fields[k] = v;
      else if (v.size > 0) files[k] = v;
    }
    return { fields, files };
  }
  try {
    const body = await req.json();
    if (body && typeof body === "object" && !Array.isArray(body)) return { fields: body as Record<string, unknown>, files: {} };
  } catch {
    /* fallthrough */
  }
  throw new HttpError(400, "Invalid request body");
}

export function parse<T>(schema: ZodType<T>, input: unknown): T {
  return schema.parse(input);
}

/** Refresh the public site after an admin save (stale-while-revalidate). */
export function refresh(...tags: string[]) {
  for (const t of tags) revalidateTag(t, "max");
}
