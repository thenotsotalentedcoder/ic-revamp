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

export const PUT = admin<{ id: string }>((req, ctx) => reviewers.update(req, ctx));
export const DELETE = admin<{ id: string }>((req, ctx) => reviewers.remove(req, ctx));
