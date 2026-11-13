import { admin } from "@/lib/server/http";
import { collection } from "@/lib/server/collection";
import { db } from "@/lib/server/db";
import { committeeSchema } from "@/lib/server/schemas";

const committee = collection<{ id: string }>({
  model: () => db.committeeMember as never,
  tags: ["committee"],
  schema: committeeSchema,
  orderBy: [{ order: "asc" }, { name: "asc" }],
});

export const GET = admin<Record<string, never>>((req, ctx) => committee.list(req, ctx as never));
export const POST = admin<Record<string, never>>((req, ctx) => committee.create(req, ctx as never));
