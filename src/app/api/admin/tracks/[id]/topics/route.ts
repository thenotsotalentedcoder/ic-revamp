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

export const GET = admin<{ id: string }>((req, ctx) => topics.list(req, ctx as never));
export const POST = admin<{ id: string }>((req, ctx) => topics.create(req, ctx as never));
