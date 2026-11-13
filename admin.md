# ICONICS'26 — Admin Panel Reference

What the admin panel does today, so it can be rebuilt in a single Next.js app (frontend + backend in one folder).

**Current stack**
- Frontend: `iconics/` — React 19 + Vite + react-router-dom, Tailwind, framer-motion. Admin code lives in `src/pages/admin/`, `src/components/admin/`, `src/contexts/AdminContext.jsx`, `src/utils/api.js`.
- Backend: `iconics-be/` — Express 5 + Prisma 6 + Postgres (Supabase), Supabase Storage for files, JWT auth. Admin code lives in `api/routers/admin.router.js`, `api/controllers/admin/*`, `api/middlewares/*`, `utils/supabase.js`.

---

## 1. What the admin can do (feature summary)

| Section | Route (UI) | What it manages |
|---|---|---|
| Login | `/admin/login` | Email + password sign-in |
| Dashboard | `/admin` | Counts, site-visibility toggles, quick links |
| Speakers | `/admin/speakers` | Keynote and workshop speakers (with photo) |
| Workshops | `/admin/workshops` | Workshops, plus nested sessions/instructors |
| Important Dates | `/admin/dates` | Timeline entries shown on the site |
| Tracks | `/admin/tracks` | Paper tracks, plus nested topics |
| Committee | `/admin/committee` | Committee members, grouped by committee |
| Previous Conferences | `/admin/previous-conferences` | Journal URL / ISBN / ISSN per past edition |
| Reviewers | `/admin/reviewers` | Reviewer list (with photo) |
| Registrations | `/admin/registrations` | View workshop, participant and paper registrations; open uploaded documents; export CSV |
| Call for Papers | `/admin/callforpapers` | CFP poster, LaTeX template ZIP, Overleaf link |

The admin **cannot** currently: approve or reject registrations (the `status` field is displayed but there is no endpoint or UI to change it), edit or delete registrations, create other admin users from the UI (CLI script only), or reorder items by drag and drop (order is a manual number).

---

## 2. Authentication & sessions

**Model:** database-backed admin accounts, JWT bearer tokens.

- Table `admins`: `email` (unique), `name`, `passwordHash` (bcrypt, cost 12), `isActive`, `tokenVersion`, `lastLoginAt`.
- `POST /api/admin/login` `{ email, password }`:
  - Rejects non-string, empty, or >200 char passwords with a generic 401.
  - Looks the admin up by lower-cased email. Compares against a dummy hash when the email is unknown, so timing doesn't reveal which emails exist.
  - Fails with the same generic `Invalid credentials` for unknown email, wrong password, or disabled account.
  - On success: updates `lastLoginAt`, logs `Admin login: <email> from <ip>`, returns `{ token, admin: { email, name } }`.
- **Token:** HS256 JWT, 8h expiry, payload `{ sub: adminId, ver: tokenVersion, role: 'admin' }`, signed with `JWT_SECRET` (required, ≥32 chars; the server refuses to start without it, no fallback).
- **`verifyAdmin` middleware** (every `/api/admin/*` route except login): checks `Authorization: Bearer <token>`, verifies signature, then **re-reads the admin from the DB** and requires `isActive` and `tokenVersion === payload.ver`. So disabling an account or bumping `tokenVersion` revokes sessions immediately. Sets `req.admin = { id, email }`.
- `POST /api/admin/logout-all`: increments `tokenVersion`, which signs the admin out on all devices. (The UI has no button for this yet; the API client has `adminLogoutAll`.)
- **Login rate limit:** 5 failed attempts per IP per 15 min (successful logins don't count).
- **Frontend session handling:** token kept in `localStorage['admin_token']`. `AdminContext` exposes `login`, `logout`, `isAuthenticated`. `AdminGuard` redirects to `/admin/login` when no token. Any 401 from an `/api/admin/*` call fires an `admin-auth-expired` event that clears the token and logs the user out. Logout is client-side only (clears the token).

**Managing admin accounts (CLI, `scripts/create-admin.js`):**
```
node scripts/create-admin.js <email> "<name>"     # create, or reset password (also revokes sessions)
node scripts/create-admin.js --disable <email>    # disable + revoke sessions
```
Password comes from `ADMIN_PASSWORD` env var or a hidden prompt; minimum 12 characters.

---

## 3. Per-section details

All list endpoints return `{ success: true, data }`; mutations return `{ success: true, data? }`; errors return `{ success: false, message }`. All "order" fields are integers (`parseInt(order) || 0`) and lists sort by `order` ascending.

### 3.1 Dashboard
- Fetches counts in parallel (`Promise.allSettled`, so one failure shows `—` instead of breaking the page): speakers, workshops, dates, tracks, and the three registration tables. Shows total registrations plus a per-type percentage breakdown.
- **Site Visibility toggles** — two switches stored in `site_settings`: `speakers_active` and `schedule_active` (`'true'`/`'false'`). Turning one off makes the public site show "Coming Soon" and hide it from navigation. Defaults are both `'true'` when no row exists.
- Quick-action links to Speakers, Workshops, Dates, Registrations, CFP.
- The header text "December 23-24, 2026 · NED University, Karachi" is hard-coded.

### 3.2 Speakers
- Fields: `name`, `title`, `institution`, `country`, `type` (`keynote` | `workshop`), `bio`, `topics[]`, `website`, `linkedin`, `scholar`, `photo`, `order`, `workshops[]`.
- `workshops[]` is a list of workshop **titles** (strings, not IDs) and is only kept when `type === 'workshop'`; otherwise it's forced to `[]`. The UI fills the picker from the workshops list.
- Photo upload: PNG/JPG/WEBP, ≤5 MB, uploaded to the **public** Supabase bucket under `speakers/`; the public URL is stored in `photo`. Editing without a new file keeps the existing photo.
- UI: type filter (all / keynote / workshop), modal form, tag input for topics, edit/delete.
- Endpoints: `GET/POST /speakers`, `PUT/DELETE /speakers/:id` (multipart, file field `photo`).

### 3.3 Workshops (+ sessions)
- Workshop fields: `slug` (unique), `title`, `tagline`, `description`, `registrationLink`, `targetAudience`, `learningOutcomes[]`, `posterImage`, `order`.
- Poster upload: image rules as above, public bucket under `workshops/`, file field `posterImage`.
- **Sessions** (child of a workshop, cascade-deleted with it): `title`, `instructorName`, `instructorTitle`, `instructorInstitution`, `instructorCountry`, `instructorPhoto`, `topics[]`, `order`. Instructor photo goes to the public bucket under `speakers/`, file field `instructorPhoto`.
- Array fields are sent as JSON strings in multipart bodies and parsed server-side. In the UI, learning outcomes and topics are entered one per line.
- UI: expandable workshop rows showing sessions, modals for workshop and session.
- Endpoints: `GET/POST /workshops`, `PUT/DELETE /workshops/:id`, `GET/POST /workshops/:workshopId/sessions`, `PUT/DELETE /workshops/:workshopId/sessions/:sessionId`.

### 3.4 Important Dates
- Fields: `date` (free text, e.g. "June 30, 2026"), `title`, `description`, `order`.
- Endpoints: `GET/POST /dates`, `PUT/DELETE /dates/:id`. JSON body.

### 3.5 Tracks (+ topics)
- Track: `name`, `icon`, `order`. Topic (cascade-deleted with the track): `name`, `order`.
- UI: expandable tracks, separate modals for track and topic. Deleting a track asks for confirmation ("…and all its topics").
- Endpoints: `GET/POST /tracks`, `PUT/DELETE /tracks/:id`, `POST /tracks/:trackId/topics`, `PUT/DELETE /tracks/:trackId/topics/:topicId`. JSON body.

### 3.6 Committee
- Fields: `committeeName`, `name`, `role`, `institution` (default prefilled "NED University of Engineering & Technology"), `email`, `isChair`, `order`.
- `committeeName` is chosen from a **hard-coded list of 14 committees** in `AdminCommittee.jsx`: Organizing; IEEE Coordination; Publications; Technical Program; Finance; Website & Socials; Grants & Sponsorship; Travel, Accommodation & Protocol; Publicity; Shield & Certificates; Registration; Reception; Catering; IT Support.
- Client-side validation: name, role and committee required.
- Endpoints: `GET/POST /committee`, `PUT/DELETE /committee/:id`. JSON body.

### 3.7 Previous Conferences
- One record per year, keyed by `year` (unique): `journalUrl`, `isbn`, `issn` (empty strings are saved as `null`).
- The editions are **hard-coded in the UI**: 2024 (4th), 2022 (3rd), 2018 (2nd), 2016 (1st). The backend accepts any year string.
- Each card saves independently via upsert.
- Endpoints: `GET /previous-conference-publications`, `PUT /previous-conference-publications/:year`.

### 3.8 Reviewers
- Fields: `name`, `email`, `from` (university/organisation), `isNed` (boolean), `photo`, `order`.
- Photo: PNG/JPG, public bucket under `reviewers/`. Updating without a new file keeps the old photo.
- This page uses an inline form and list rather than the shared modal/table components, so it's the one most worth rewriting cleanly.
- Endpoints: `GET/POST /reviewers`, `PUT/DELETE /reviewers/:id` (multipart, file field `photo`).

### 3.9 Registrations (read-only + documents + CSV)
Three tabs, each backed by its own table:

| Tab | Table | Notes |
|---|---|---|
| Workshop | `workshop_registrations` | personal info, CNIC, resume, essay answers |
| Participants | `participant_registrations` | professional/student, payment details, IEEE number |
| Papers | `paper_registrations` (+ `co_author_registrations`) | paper ID/title, payment details, co-authors |

- Tables show a subset of columns, a status badge (pending / approved / rejected), and a **Documents** column.
- **Private documents:** receipts, student cards and resumes are stored in a **private** Supabase bucket (`registerations`) as object *paths*. Clicking a link calls `GET /registrations/:kind/:id/file/:field`, which looks the path up from the DB row (so callers can't request arbitrary objects), writes an audit log line (`Document access: <admin email> → kind/id/field`), and returns a **5-minute signed URL**. The UI opens a blank tab synchronously (to beat popup blockers) and then redirects it to the signed URL.
  - Allowed `kind`/`field` pairs: `workshop → resumeUrl`; `participant | paper | coauthor → transactionReceipt, studentCard`. (`coauthor` is supported by the API but the UI doesn't expose co-author documents.)
  - Legacy rows that stored full public URLs are still handled (`toPrivatePath` strips the old URL prefix).
- **CSV export** (`/registrations/<type>/export`): the browser fetches with the bearer token, turns the response into a blob and triggers a download. Columns are fixed per type. Cells starting with `=`, `+`, `-`, `@`, tab or CR are prefixed with `'` to prevent spreadsheet formula injection (purely numeric/phone-like values are left alone). Exports contain no document links and no co-author rows (paper exports only flag "Has Co-Authors"). The workshop export includes CNIC numbers, so treat the file as sensitive.
- Endpoints: `GET /registrations/{workshop|participant|paper}`, `GET .../export`, `GET /registrations/:kind/:id/file/:field`.

### 3.10 Call for Papers assets
Three items, all stored in `site_settings`:

| Item | Setting key | Input |
|---|---|---|
| Poster image | `cfp_poster_url` | upload PNG/JPG/WEBP |
| LaTeX template | `cfp_latex_template_url` | upload `.zip` |
| Overleaf link | `cfp_overleaf_template_url` | URL text field |

- `PUT /cfp-assets` (multipart; fields `poster`, `latexTemplate`; ≤50 MB each, max 2 files; extension allow-list per field; returns 400 if no file provided) saves files to **local disk** at `iconics-be/uploads/cfp/<timestamp>.<ext>`, stores `/uploads/cfp/<filename>` in the setting, and Express serves `/uploads` statically with `nosniff`, a sandbox CSP, and `Content-Disposition: attachment` for non-images.
- The Overleaf link goes through the generic settings endpoint (`PUT /settings { key, value }`).
- ⚠️ **Migration note:** this is the only admin feature that writes to the server's local filesystem. That won't work on Vercel/serverless in Next.js. Move poster and ZIP to Supabase Storage (public bucket) and store the public URL.

### 3.11 Site settings (generic)
- `GET /settings` returns all `site_settings` rows merged over defaults `{ speakers_active: 'true', schedule_active: 'true' }`.
- `PUT /settings { key, value }` upserts any key, with the value stored as a string. There is **no key allow-list**, so any logged-in admin can set any key. Consider restricting to the known keys when rewriting.

---

## 4. Data model (admin-managed tables)

| Table (Prisma model) | Key fields |
|---|---|
| `admins` (Admin) | email, name, passwordHash, isActive, tokenVersion, lastLoginAt |
| `speakers` (Speaker) | name, title, institution, country, photo, type, bio, topics[], workshops[], website, linkedin, scholar, order |
| `workshops` (Workshop) | slug (unique), title, tagline, description, posterImage, registrationLink, targetAudience, learningOutcomes[], order |
| `workshop_sessions` (WorkshopSession) | workshopId → workshops (cascade), title, instructor* fields, topics[], order |
| `important_dates` (ImportantDate) | date (string), title, description, order |
| `tracks` / `track_topics` | track: name, icon, order; topic: trackId (cascade), name, order |
| `committee_members` (CommitteeMember) | committeeName, name, role, institution?, email?, isChair, order |
| `previous_conference_publications` | year (unique), journalUrl?, isbn?, issn? |
| `reviewers` (Reviewer) | name, email?, from?, photo?, isNed, order |
| `site_settings` (SiteSetting) | key (unique), value |
| `workshop_registrations`, `participant_registrations`, `paper_registrations`, `co_author_registrations` | submitted by the public; the admin only reads them. Each has `status` (default `pending`). Document columns hold private-bucket object paths. |

Row-Level Security is enabled (no policies) on every table in the `public` schema, with `anon`/`authenticated` privileges revoked (migration `20261012000100_enable_rls`). **Any new table needs RLS enabled too.** The app connects with a privileged DB role, so it is unaffected.

---

## 5. Shared infrastructure the admin depends on

- **Public vs. private storage** (`utils/supabase.js`): two buckets. `public-assets` for site images (speaker/reviewer/workshop photos, which return a public URL). `registerations` is **private** for registrant documents (stores object paths and serves 5-minute signed URLs). Object names are random UUIDs with no PII. Uses the Supabase **service-role key**, so keep it server-only.
- **Upload validation** (`upload.middleware.js`): in-memory (multer memoryStorage), extension allow-list, **magic-byte check** of the file contents (PDF/PNG/JPG/DOC/DOCX/WEBP), and size limits. Admin images: 5 MB, 1 file.
- **Rate limits** (`rateLimit.middleware.js`): global 300 req/min per IP; login 5 failures/15 min; registration 15/hour (successful stored registrations only); IEEE check 20/min. Behind nginx, `trust proxy` is set to 1 hop.
- **Security headers / CORS:** helmet with a strict API-only CSP; CORS allow-list (`CLIENT_URL`, localhost:5173, the Vercel and `iconics.neduet.edu.pk` origins). In a single Next.js app the same origin serves both, so CORS mostly goes away, but keep the security headers.
- **Error handling:** 5xx responses never leak internal messages (`Internal server error`); only 4xx messages marked as client-safe are returned.
- **Public read endpoints** (`/api/public/*`, no auth) that the admin edits feed: speakers, workshops (+sessions), dates, tracks (+topics), committee, previous-conference-publications, reviewers, settings.

**Environment variables:** `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET` (≥32 chars), `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_PRIVATE_BUCKET` (default `registerations`), `SUPABASE_PUBLIC_BUCKET` (default `public-assets`), `CLIENT_URL`, `PORT`, `HOST`, `TRUST_PROXY_HOPS`, `NODE_ENV`.

---

## 6. Complete admin API list (all under `/api/admin`, bearer token required except login)

```
POST   /login                                   (public, rate-limited)
POST   /logout-all
GET    /speakers            POST /speakers            PUT/DELETE /speakers/:id
GET    /workshops           POST /workshops           PUT/DELETE /workshops/:id
GET    /workshops/:workshopId/sessions   POST …/sessions   PUT/DELETE …/sessions/:sessionId
GET    /dates               POST /dates               PUT/DELETE /dates/:id
GET    /tracks              POST /tracks              PUT/DELETE /tracks/:id
POST   /tracks/:trackId/topics     PUT/DELETE /tracks/:trackId/topics/:topicId
GET    /committee           POST /committee           PUT/DELETE /committee/:id
GET    /previous-conference-publications    PUT /previous-conference-publications/:year
GET    /reviewers           POST /reviewers           PUT/DELETE /reviewers/:id
GET    /settings            PUT /settings
PUT    /cfp-assets
GET    /registrations/workshop|participant|paper
GET    /registrations/workshop|participant|paper/export
GET    /registrations/:kind/:id/file/:field
```

---

## 7. Notes for the Next.js migration

Suggested mapping:

| Today | Next.js |
|---|---|
| `src/pages/admin/*` + react-router | `app/admin/**/page.jsx` with a shared `app/admin/layout.jsx` (sidebar) |
| `AdminGuard` + localStorage token | `middleware.js` that checks an **httpOnly, Secure, SameSite cookie** and redirects to `/admin/login`; also verify in each route handler / server action |
| Express routers + controllers | Route Handlers (`app/api/admin/**/route.js`) or Server Actions |
| `verifyAdmin` | a shared `requireAdmin(request)` helper (JWT verify + DB check of `isActive` / `tokenVersion`), called at the top of every admin handler |
| multer | `request.formData()` and `File` objects; keep the size, extension and magic-byte checks |
| `express-rate-limit` | Upstash/Redis or similar. In-memory limiters don't work across serverless instances |
| `/uploads` local disk | Supabase Storage (needed for the CFP assets, see 3.10) |
| `utils/prisma.js` | Prisma singleton on `globalThis` (avoids many clients in dev hot reload); use the pooled `DATABASE_URL` |
| `api.js` fetch wrapper | same-origin `fetch('/api/admin/...')` with no bearer header if using cookies (CSV export becomes a plain link) |

Things worth fixing while rewriting (all present today):
1. **No server-side validation on admin writes.** Controllers trust the body (only `parseInt` on order). Add schema validation (e.g. zod): required fields, URL formats, `type` ∈ {keynote, workshop}, slug format and so on. Several handlers also call `JSON.parse` on client input without try/catch and would return 500 on bad JSON.
2. **Settings endpoint accepts any key**: restrict to an allow-list.
3. **Registration `status` cannot be changed** from the admin: add approve/reject if that's wanted.
4. **Token in localStorage** is readable by any XSS: switch to an httpOnly cookie.
5. **Logout doesn't revoke the token** and there's no "log out everywhere" button, even though the API exists.
6. **Hard-coded lists** in the UI: 14 committees, the 4 past conference years, the dashboard date line. Consider moving them to settings/DB.
7. Deletes on speakers/workshops/etc. don't remove the old image from Supabase (orphaned files).
8. Co-author documents can't be opened from the UI even though the API supports it.
9. Don't commit the old `iconics-be/.env` into the new repo (it holds the DB, Supabase and JWT secrets); set them as environment variables in the new project, and rotate anything that was ever committed.
