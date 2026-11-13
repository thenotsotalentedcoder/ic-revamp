/** Fixed facts about the conference. Admin-managed content lives in the API (see api.ts).
 *  Brand rule: the name is always written "iCONICS" (lowercase i). */
export const CONFERENCE = {
  brand: "iCONICS",
  short: "iCONICS’26",
  name: "International Conference on Innovations in Computer Science",
  edition: "5th",
  dates: "23–24 December 2026",
  datesShort: "23–24 Dec 2026",
  startISO: "2026-12-23",
  venue: "NED University of Engineering & Technology",
  city: "Karachi, Pakistan",
  address: "University Road, Karachi 75270, Pakistan",
  department: "Department of Computer Science & Information Technology",
  proceedings: "IEEE Conference Proceedings (subject to approval)",
  submissionsOpen: false,
  registrationOpen: true,
  email: "iconicscontact@neduet.edu.pk",
  secretaryEmail: "secretaryiconics@neduet.edu.pk",
  phone: "+92 21 99261261-68, ext. 2399, 2385",
  phoneHref: "tel:+922199261261",
  paperDesk: "https://paperdesk.neduet.edu.pk/",
  mapUrl: "https://maps.google.com/?q=NED+University+of+Engineering+and+Technology+Karachi",
  social: {
    linkedin: "https://www.linkedin.com/company/csit-neduet",
    facebook: "https://www.facebook.com/NEDICONICS",
  },
} as const;

export const EDITIONS = [2016, 2018, 2022, 2024, 2026] as const;

export type NavItem = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href: string; items?: NavItem[] };

export const NAV: NavGroup[] = [
  {
    label: "About",
    href: "/about",
    items: [
      { label: "About iCONICS", href: "/about", description: "The conference, its scope and its hosts" },
      { label: "Previous conferences", href: "/previous-conferences", description: "2016 to 2024, speakers and proceedings" },
      { label: "Committees", href: "/committee", description: "Organising and technical programme committees" },
      { label: "Reviewers", href: "/reviewers", description: "Technical reviewers for iCONICS’26" },
    ],
  },
  { label: "Call for Papers", href: "/call-for-papers" },
  {
    label: "Programme",
    href: "/schedule",
    items: [
      { label: "Schedule", href: "/schedule", description: "Two-day programme, 23–24 December" },
      { label: "Speakers", href: "/speakers", description: "Keynote and workshop speakers" },
      { label: "Workshops", href: "/workshops", description: "Hands-on sessions" },
    ],
  },
  { label: "Registration", href: "/registration" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
];

export const ORGANISERS = [
  { name: "NED University of Engineering & Technology", src: "/logos/ned.png", w: 200, h: 202 },
  { name: "IEEE", src: "/logos/ieee.png", w: 300, h: 168 },
  { name: "Higher Education Commission, Pakistan", src: "/logos/hec.png", w: 148, h: 148 },
  { name: "Sindh Higher Education Commission", src: "/logos/sindh-hec.png", w: 313, h: 84 },
  { name: "ORIC, NED University", src: "/logos/oric.png", w: 204, h: 192 },
  { name: "Ignite", src: "/logos/ignite1.png", w: 500, h: 500 },
] as const;
