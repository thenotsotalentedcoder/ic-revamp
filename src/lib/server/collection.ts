import "server-only";
import type { ZodType } from "zod";
import { HttpError } from "./auth";
import { ok, parse, readBody, refresh } from "./http";
import { removePublicByUrl, uploadPublic } from "./storage";

/** The slice of a Prisma model delegate this helper needs. */
type Row = Record<string, unknown> & { id: string };
type Delegate = {
  findMany(args: object): Promise<Row[]>;
  findFirst(args: object): Promise<Row | null>;
  create(args: object): Promise<Row>;
  update(args: object): Promise<Row>;
  delete(args: object): Promise<unknown>;
};

type FileField = { field: string; column: string; folder: string };

type Config<P> = {
  model: () => Delegate;
  /** Public cache tags to refresh after any write. */
  tags: string[];
  schema: ZodType<Record<string, unknown>>;
  orderBy: object;
  include?: object;
  files?: FileField[];
  /** Scope for nested resources (e.g. sessions of one workshop). */
  scope?: (params: P) => Record<string, unknown>;
  /** Route param that carries the item id (default "id"; nested routes use e.g. "sessionId"). */
  idParam?: string;
};

/** Generic CRUD for the admin: JSON or multipart in, validated, uploaded, cache refreshed. */
export function collection<P extends Record<string, string> = Record<string, string>>(cfg: Config<P>) {
  const scope = (p: P) => cfg.scope?.(p) ?? {};
  const idOf = (p: P) => (p as Record<string, string>)[cfg.idParam ?? "id"];

  async function withFiles(files: Record<string, File>) {
    const out: Record<string, string> = {};
    for (const f of cfg.files ?? []) {
      const file = files[f.field];
      if (file) out[f.column] = await uploadPublic(file, f.folder, "image", f.field);
    }
    return out;
  }

  const find = async (id: string, p: P) => {
    const row = await cfg.model().findFirst({ where: { id, ...scope(p) } });
    if (!row) throw new HttpError(404, "Not found");
    return row;
  };

  return {
    list: async (_req: Request, { params }: { params: P }) =>
      ok(await cfg.model().findMany({ where: scope(params), orderBy: cfg.orderBy, ...(cfg.include ? { include: cfg.include } : {}) })),

    create: async (req: Request, { params }: { params: P }) => {
      const { fields, files } = await readBody(req);
      const data = parse(cfg.schema, fields);
      const uploaded = await withFiles(files);
      const row = await cfg.model().create({ data: { ...data, ...scope(params), ...uploaded } });
      refresh(...cfg.tags);
      return ok(row, 201);
    },

    update: async (req: Request, { params }: { params: P }) => {
      const id = idOf(params);
      const before = await find(id, params);
      const { fields, files } = await readBody(req);
      const data = parse(cfg.schema, fields);
      const uploaded = await withFiles(files);
      const row = await cfg.model().update({ where: { id }, data: { ...data, ...uploaded } });
      for (const f of cfg.files ?? []) if (uploaded[f.column]) await removePublicByUrl(before[f.column] as string | null);
      refresh(...cfg.tags);
      return ok(row);
    },

    remove: async (_req: Request, { params }: { params: P }) => {
      const id = idOf(params);
      const before = await find(id, params);
      await cfg.model().delete({ where: { id } });
      for (const f of cfg.files ?? []) await removePublicByUrl(before[f.column] as string | null);
      refresh(...cfg.tags);
      return ok();
    },
  };
}
