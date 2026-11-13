import { admin, ok } from "@/lib/server/http";

export const GET = admin(async (_req, { admin: me }) => ok({ email: me.email, name: me.name }));
