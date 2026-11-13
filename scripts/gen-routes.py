"""One-off generator for the repetitive admin CRUD route files. Run from the repo root."""
import os

ROOT = "src/app/api/admin"


def write(path, body):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8", newline="\n") as f:
        f.write(body)


def crud(name, const, model, schema, tags, order, include=None, files=None, scope=None, parent=None, idp="id"):
    """name: url segment (relative path), const: variable name for the collection."""
    inc = f"  include: {include},\n" if include else ""
    fl = f"  files: {files},\n" if files else ""
    sc = f"  scope: {scope},\n" if scope else ""
    gen = "{ " + parent + ": string }" if parent else "Record<string, never>"
    idline = f'  idParam: "{idp}",\n' if parent else ""
    head = f'''import {{ admin }} from "@/lib/server/http";
import {{ collection }} from "@/lib/server/collection";
import {{ db }} from "@/lib/server/db";
import {{ {schema} }} from "@/lib/server/schemas";

const {const} = collection<{{ {parent + ": string; " if parent else ""}{idp}: string }}>({{
  model: () => db.{model} as never,
  tags: {tags},
  schema: {schema},
  orderBy: {order},
{idline}{inc}{fl}{sc}}});
'''
    write(f"{name}/route.ts", head + f'''
export const GET = admin<{gen}>((req, ctx) => {const}.list(req, ctx as never));
export const POST = admin<{gen}>((req, ctx) => {const}.create(req, ctx as never));
''')
    p = f"{{ {parent + ': string; ' if parent else ''}{idp}: string }}"
    write(f"{name}/[{idp}]/route.ts", head + f'''
export const PUT = admin<{p}>((req, ctx) => {const}.update(req, ctx));
export const DELETE = admin<{p}>((req, ctx) => {const}.remove(req, ctx));
''')


crud("speakers", "speakers", "speaker", "speakerSchema", '["speakers", "workshops"]', "[{ order: \"asc\" }, { name: \"asc\" }]",
     files='[{ field: "photo", column: "photo", folder: "speakers" }]')
crud("dates", "dates", "importantDate", "dateSchema", '["dates"]', '{ order: "asc" }')
crud("committee", "committee", "committeeMember", "committeeSchema", '["committee"]', "[{ order: \"asc\" }, { name: \"asc\" }]")
crud("reviewers", "reviewers", "reviewer", "reviewerSchema", '["reviewers"]', "[{ order: \"asc\" }, { name: \"asc\" }]",
     files='[{ field: "photo", column: "photo", folder: "reviewers" }]')
crud("workshops", "workshops", "workshop", "workshopSchema", '["workshops"]', '{ order: "asc" }',
     include='{ sessions: { orderBy: { order: "asc" } } }',
     files='[{ field: "posterImage", column: "posterImage", folder: "workshops" }]')
crud("tracks", "tracks", "track", "trackSchema", '["tracks"]', '{ order: "asc" }',
     include='{ topics: { orderBy: { order: "asc" } } }')
crud("workshops/[id]/sessions", "sessions", "workshopSession", "sessionSchema", '["workshops"]', '{ order: "asc" }',
     files='[{ field: "instructorPhoto", column: "instructorPhoto", folder: "speakers" }]',
     scope="(p) => ({ workshopId: p.id })", parent="id", idp="sessionId")
crud("tracks/[id]/topics", "topics", "trackTopic", "topicSchema", '["tracks"]', '{ order: "asc" }',
     scope="(p) => ({ trackId: p.id })", parent="id", idp="topicId")
print("ok")
