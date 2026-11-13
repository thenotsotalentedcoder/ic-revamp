# iCONICS'26 Design System

This is the single source of truth for every page. If a page needs something this file doesn't cover, add it here first, then build it. The rule exists to stop design drift between pages.

> **v2 (13 Nov 2026), decisions after review:** the layout is homepage direction B (split hero) with direction A's type
> (Source Serif 4 + Source Sans 3). The name is always written **iCONICS** (lowercase i). There are no group photos anywhere.
> Corners are 2px, not 6px. The one recurring mark is the section rule: a hairline with a 48px teal segment.
> Photo captions are set in serif italic. The hero is a crossfade slideshow of keynote and full-hall photos; it is the only
> motion longer than 300ms, has a pause control, and is static under reduced motion.

## 1. What we are designing

iCONICS'26 is the **5th International Conference on Innovations in Computer Science**.

- **When and where:** 23–24 December 2026, at NED University of Engineering & Technology, Karachi.
- **Organised by:** the Department of Computer Science & IT.
- **Technical sponsor:** IEEE Karachi Section.
- **Previous editions:** 2016, 2018, 2022, 2024.

**Who reads this site, in order of importance:**
1. Authors with accepted papers who need to register and pay.
2. International keynote speakers and guests (USA, UK, EU, Canada) judging whether this is a serious venue.
3. Students and attendees registering for talks and workshops.
4. Reviewers and committee members checking that their names and affiliations are correct.

**What success looks like:** a visiting professor from Leeds or Berkeley lands on the site and, within 5 seconds, knows:
- what it is,
- when and where it is,
- that it is credible,
- what they can do next.

The site should look like it belongs alongside CHI, ACL or SIGGRAPH, not like a startup landing page.

## 2. Identity: built from this conference, not from a style

Every visual move has to come from material that is specific to ICONICS:

- **Real ICONICS photography.** Candid shots of keynotes, audiences and Q&A. No stock photos and no posed group photos (removed at the client's request).
- **The edition lineage: 2016 · 2018 · 2022 · 2024 · 2026.** This is our one signature detail, the *edition rail*. It is a quiet horizontal sequence of the five years with 2026 marked. It appears in the hero and on the Previous Conferences page. The numbers are real history, not decorative numbering.
- **Institutional marks.** NED, IEEE Karachi Section, HEC, Sindh HEC, ORIC and Ignite, always shown in their current official versions.
- **Navy and teal** taken from the ICONICS'26 poster. The poster's magenta/purple ribbon is dropped on purpose (see §9).

**Identity test.** Swap our logo for a hotel's. If the page still works, it is too generic, so change it.

## 3. Colour

The theme is light, with navy as the primary colour and teal as the accent. Neutrals are tinted toward navy, never pure grey. Every role below has a single job, and tokens must never be used outside their role.

| Token | Hex | Role |
|---|---|---|
| `navy-950` | `#0B1B33` | Primary ink: headings, body text on light backgrounds, dark section background, footer |
| `navy-900` | `#10264A` | Hover and pressed states on dark surfaces |
| `navy-800` | `#17335F` | Borders and dividers on dark surfaces |
| `teal-700` | `#2B6F6B` | **Action colour.** Primary buttons, links, focus ring. White on teal-700 has 5.9:1 contrast |
| `teal-800` | `#225A57` | Hover and active state of actions |
| `teal-300` | `#7CC5BF` | Actions and highlights **on navy only** (8.8:1 on navy-950) |
| `teal-50` | `#EEF6F5` | Tinted background for the one "current status" notice |
| `ink-600` | `#4F5D73` | Secondary text: meta, captions, labels (6.7:1 on white) |
| `ink-400` | `#8A98AB` | Disabled text and placeholder hints only, never for content |
| `line` | `#D8DFE8` | Hairlines, table rules, input borders |
| `surface-100` | `#EBEFF4` | Alternate section background |
| `surface-50` | `#F5F7FA` | Page background |
| `white` | `#FFFFFF` | Raised surfaces (modal, form panel) |
| `danger` | `#B42318` | Form errors only |
| `success` | `#1F7A4D` | Successful submission only |

**Rules**
- **Body text is `navy-950` or `ink-600`, nothing lighter.** Every text pair must pass WCAG 2.2 AA (4.5:1, or 3:1 for 24px+ text). The current site's teal at 78% alpha fails at 2.6:1, and that must not happen again.
- **The old brand teal `#3E8B87` is retired for text** because it is 4.0:1 on white, below AA.
- **No gradients, with one exception:** the navy scrim over the hero photo that keeps the hero text legible.
- **Colour is never the only signal.** A closed state says "Submissions closed" in words. It is never just grey.

## 4. Typography

**Banned faces:**
- Inter, Roboto, Arial-for-everything and system-ui-for-everything (first-generation AI defaults).
- Geist, Instrument Serif, Fraunces, Space Grotesk, DM Sans, Manrope and Plus Jakarta (second-generation "tasteful" defaults).

**The two candidate directions** are prototyped on the homepage. Pick one, and it applies site-wide:

- **Direction A, "Journal":** Source Serif 4 for headings (optical sizes) and Source Sans 3 for UI and body. This is a scholarly publishing voice. Use the serif only at restrained sizes on white or navy. It must never be oversized, italic-accented or on cream.
- **Direction B, "Engineering":** IBM Plex Sans for everything, with Plex Sans Condensed for the display title only. This is a technical, computing-native voice.

**Scale.** Desktop sizes, with mobile in brackets:

| Role | Size and line height | Weight |
|---|---|---|
| Display (hero title only) | 64/68 [40/44] | 600 |
| H1 page title | 44/52 [32/40] | 600 |
| H2 section | 30/38 [24/32] | 600 |
| H3 | 20/28 | 600 |
| Body | 17/28 | 400 |
| Small, meta | 14/20 | 400 or 500 |

**Rules**
- **Line length is at most 68ch for prose.**
- **Numbers use `tabular-nums` in dates, fees and schedules.**
- **No all-caps tracked "eyebrow" labels and no monospace labels.** Section headings are plain sentence-case H2s.
- **No accented word inside a headline.**
- **Use correct typography in content:** curly quotes (’ “ ”), en dashes for ranges (23–24 December), and a non-breaking space in "PKR 10,000".

## 5. Layout and space

- **Container:** 1200px max width, 12 columns, 24px gutter. The page gutter is 16px on mobile and 32px on desktop.
- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 48, 64, 96. Sections are separated by 96 on desktop and 64 on mobile.
- **Radius:** 6px for buttons, inputs and modals. 0 for photos and section blocks. Radii nest (inner ≤ outer).
- **Cards only where the whole thing is clickable** (a speaker, a workshop). Lists, dates, tracks and facts use rules, columns and type, not boxes. To test a card, remove its border, background and radius. If nothing breaks, it was not a card.
- **Shadows:** two layers at most, used only on the modal and the sticky header. Never a glow.
- **No nested cards, no icon-in-rounded-square tiles, no emoji icons.** Track icons are plain inline SVG at text size, or nothing.
- **Alignment:** everything snaps to the grid. The hero is left-aligned, not centred.

## 6. Motion

Performance is a design requirement. The current site runs five full-screen canvases and dozens of infinite loops. None of that comes back.

- **No Lenis, no Framer Motion, no canvas, no WebGL, no scroll-reveal fade-ups, no count-up numbers, no countdown tiles.**
- **CSS transitions only, on `transform`, `opacity`, `color` and `background-color`.** Never use `transition: all`.
- **Durations:**
  - Hover and focus: 150ms `ease-out`.
  - Menus and the modal: 200ms `cubic-bezier(.2,.8,.2,1)`.
  - Nothing over 300ms.
- **Speaker slider:** uses native `scroll-snap`, with arrow buttons that call `scrollBy`. Swiping works natively and there is no library.
- **Institutions strip:** CSS `@keyframes translateX`. It pauses on hover and focus. Under `prefers-reduced-motion` it becomes a static wrapped grid.
- **`prefers-reduced-motion: reduce`** disables every non-essential transition.
- **Scrolling is native.** `scroll-behavior: smooth` applies only to in-page anchor jumps, and is off under reduced motion.

## 7. Content voice

- **Write like a call for papers:** factual, specific and brief.
  - Banned words: "elevate", "seamless", "cutting-edge", "unlock", "empower", "journey", "global impact".
  - No two-beat slogans ("Original research. Global impact.").
- **Dates:**
  - Format: `23–24 December 2026`.
  - Deadlines include the weekday and time zone, e.g. `Mon 15 Dec 2026, 23:59 PKT (UTC+5)`.
  - Each important date offers an `.ics` download.
- **Status is always explicit:** "Paper submissions closed", "Registration open".
- **Claims must be verifiable.**
  - Write "IEEE Conference Proceedings (subject to approval)" exactly as approved.
  - The institutions strip is titled "Researchers from these institutions have spoken at, reviewed for, or organised ICONICS". It does not claim the institutions "participated".
- **Fees and bank details are complete, in tables, with a visible but quiet "Fees are non-refundable."**

## 8. Components (built once, reused everywhere)

**Navigation and page shell**
- `SiteHeader`: wordmark, at most 5 groups, and a Register button. It sticks after scroll with a 1px `line` border, not glass. On mobile it becomes a disclosure menu.
- `PageHeader`: breadcrumb, H1 and a one-sentence intro. No decorative banner.
- `SiteFooter`: organiser logos, contact, the address with a map link, socials and the edition rail.

**Display components**
- `EditionRail`: 2016 · 2018 · 2022 · 2024 · **2026**.
- `StatusNotice`: the one teal-50 strip, e.g. "Paper submissions are closed. Registration is open until …".
- `DateList`: important dates as a definition list, with past dates struck and labelled "Passed".
- `SpeakerCard` and `SpeakerDialog`:
  - The card shows photo, name, title, institution logo, and the flag plus country.
  - The dialog is a native `<dialog>`: focus is trapped, Esc closes it, and scrolling locks without Lenis hacks.
- `SpeakerSlider`: scroll-snap track with prev/next arrows. Arrows disable at the ends.
- `LogoStrip`: the static organiser and sponsor group.
- `InstitutionMarquee`: per §6.
- `Schedule`: a two-day tabbed table (Day 1 / Day 2) with time, session and venue.

**Forms**
- `Button`: primary (teal-700), secondary (navy outline) and `disabled-with-reason`. A disabled button always has visible text explaining why.
- Form kit: label above the field, errors inline, `autocomplete` attributes, and focus moves to the first error.

## 9. Anti-slop checklist (run on every page before it is "done")

**Automated checks**
- [ ] Impeccable detector and the `avoid-ai-design` scanner report no P0 findings.

**Colour and type**
- [ ] No purple, indigo or violet. No gradient text. No glassmorphism or `backdrop-blur`.
- [ ] No banned typeface, no tracked all-caps eyebrows, no mono labels.

**Layout and components**
- [ ] No 01/02/03 decoration. No pill badge above the title. No icon tiles. No cards inside cards.
- [ ] Not a centred hero followed by three identical cards. Not the stock section order (hero, logos, features, stats, CTA).

**Behaviour and accessibility**
- [ ] Every text pair passes AA. Focus is visible on every interactive element. Keyboard-only use works.
- [ ] Reduced motion is respected. No infinite animation runs except the institutions strip, which pauses on hover.

**Final tests**
- [ ] Lighthouse mobile score: Performance ≥ 95, Accessibility = 100. LCP < 2.0s, CLS < 0.05, INP < 200ms.
- [ ] The identity test (§2) and the silhouette test pass. For the silhouette test, shrink the page to grey blocks: it should still read as *a conference*, not as a SaaS product.

## 10. Information architecture

| Group | Pages |
|---|---|
| About | About ICONICS · Previous Conferences · Committee · Reviewers |
| Call for Papers | Call for Papers (tracks, submission status, templates, publication) |
| Programme | Schedule · Speakers · Workshops (+ workshop detail) |
| Attend | Registration & Fees · Contact |
| Sponsors | Sponsors & Partners |
| *(button)* | Register |

**Routes**
- New routes: `/about`, `/previous-conferences`, `/committee`, `/reviewers`, `/call-for-papers`, `/schedule`, `/speakers`, `/workshops`, `/workshops/[slug]`, `/registration`, `/sponsors`, `/contact`.
- Old URLs get 301 redirects:
  - `/callforpapers` → `/call-for-papers`
  - `/gallery` → `/previous-conferences`

**Homepage order** (this is deliberately not the SaaS template):
1. Photo hero: title, edition rail, dates and venue, a status line, Register, and View programme.
2. Facts row: Dates · Venue · Proceedings · Organised by.
3. Keynote and workshop speakers slider (all speakers, ordered by admin `order`).
4. Important dates, with the submission state.
5. Research tracks as a six-column typographic list, not cards.
6. Workshops (brief, linking to the detail pages).
7. Institutions strip.
8. Organisers & sponsors.

## 11. Data

- **Public content** comes from `https://iconics.neduet.edu.pk/api/public/*`. It is fetched in server components with `revalidate: 300` and tag-based revalidation after admin saves.
- **The database is the live Supabase.** Changes are additive only: new tables and nullable columns.
  - Back up with `pg_dump` first.
  - Use `prisma migrate deploy`, never `migrate dev` or `reset`.
  - Test rows use `@iconics.test` emails.
