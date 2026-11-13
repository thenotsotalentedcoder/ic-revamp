import { admin } from "@/lib/server/http";
import { collection } from "@/lib/server/collection";
import { db } from "@/lib/server/db";
import { topicSchema } from "@/lib/server/schemas";

const topics = collection<{ id: string; topicId: string }>({
  model: () => db.trackTopic as never,
  tags: ["tracks"],
  schema: topicSchema,
  orderBy: { order: "asc" },
  idParam: "topicId",
  scope: (p) => ({ trackId: p.id }),
});

export const PUT = admin<{ id: string; topicId: string }>((req, ctx) => topics.update(req, ctx));
export const DELETE = admin<{ id: string; topicId: string }>((req, ctx) => topics.remove(req, ctx));
