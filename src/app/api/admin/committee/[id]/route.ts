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

export const PUT = admin<{ id: string }>((req, ctx) => committee.update(req, ctx));
export const DELETE = admin<{ id: string }>((req, ctx) => committee.remove(req, ctx));
