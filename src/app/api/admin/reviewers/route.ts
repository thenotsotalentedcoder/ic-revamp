import { admin } from "@/lib/server/http";
import { collection } from "@/lib/server/collection";
import { db } from "@/lib/server/db";
import { reviewerSchema } from "@/lib/server/schemas";

const reviewers = collection<{ id: string }>({
  model: () => db.reviewer as never,
  tags: ["reviewers"],
  schema: reviewerSchema,
  orderBy: [{ order: "asc" }, { name: "asc" }],
  files: [{ field: "photo", column: "photo", folder: "reviewers" }],
});

export const GET = admin<Record<string, never>>((req, ctx) => reviewers.list(req, ctx as never));
export const POST = admin<Record<string, never>>((req, ctx) => reviewers.create(req, ctx as never));
