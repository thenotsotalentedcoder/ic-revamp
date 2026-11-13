/**
 * Registration fees and Google Form links (per the organising committee, 13 Nov 2026).
 * Registration happens on Google Forms; the site only explains fees and links out.
 * Paste each form URL below. An empty string shows "Form link coming soon" instead of a button.
 */
export const REG_FORMS = {
  paper: "",
  coauthor: "",
  attendee: "",
  group: "",
} as const;

export type Fee = { label: string; detail?: string; amount: string };

/** Early bird applies to paper registration only. No other early-bird offer. */
export const EARLY_BIRD: { deadline: string | null; fees: Fee[] } = {
  deadline: null, // e.g. "Fri 4 Dec 2026" once confirmed
  fees: [
    { label: "Paper registration", detail: "National presenter", amount: "PKR 7,000" },
    { label: "Paper registration", detail: "International presenter", amount: "USD 40" },
  ],
};

export type RegistrationType = {
  key: "paper" | "attendee" | "group";
  title: string;
  summary: string;
  fees: Fee[];
  actions: { label: string; form: keyof typeof REG_FORMS }[];
  includes: string[];
  note?: string;
};

export const REGISTRATION_TYPES: RegistrationType[] = [
  {
    key: "paper",
    title: "Paper & co-author",
    summary: "For authors of accepted papers. The presenting author registers the paper; each co-author who attends registers separately.",
    fees: [
      { label: "Paper registration", detail: "National presenter", amount: "PKR 10,000" },
      { label: "Paper registration", detail: "International presenter", amount: "USD 50" },
      { label: "Co-author registration", amount: "PKR 3,000" },
    ],
    actions: [
      { label: "Register paper", form: "paper" },
      { label: "Register co-author", form: "coauthor" },
    ],
    includes: ["Conference kit", "Lunch and refreshments", "Presentation certificate", "Access to all sessions and workshops"],
  },
  {
    key: "attendee",
    title: "Attendee",
    summary: "For academics, professionals and students attending without a paper.",
    fees: [
      { label: "Participant registration", amount: "PKR 3,000" },
      { label: "IEEE professional attendee", detail: "Valid IEEE membership", amount: "PKR 2,000" },
      { label: "IEEE or NED student attendee", detail: "Valid student card", amount: "PKR 1,000" },
    ],
    actions: [{ label: "Register as attendee", form: "attendee" }],
    includes: ["Conference kit", "Lunch and refreshments", "Participation certificate", "Access to selected workshops"],
  },
  {
    key: "group",
    title: "Group",
    summary: "Register five people together and pay for four. The fifth registration is free.",
    fees: [{ label: "Group of 5 attendees", amount: "PKR 12,000" }],
    actions: [{ label: "Register a group", form: "group" }],
    includes: ["Conference kit", "Lunch and refreshments", "Participation certificate", "Access to selected workshops"],
    note: "One form per group. Enter all five members’ details.",
  },
];

export const PAYMENT = {
  bank: "Meezan Bank Limited",
  accountTitle: "NED University of Engineering & Technology (CSIT Sustainability)",
  accountNumber: "0108636991",
  iban: "PK30MEZN0001420108636991",
  branch: "Shah Faisal Colony, Karachi",
};

export const RULES = [
  "Pay by bank transfer first, then submit the form with your transaction receipt.",
  "One registration per person (or one per group of five).",
  "Papers cannot be withdrawn after registration.",
  "At least one author must present in person. Papers that are not presented are excluded from the proceedings.",
];

export const REGISTRATION_EMAIL = "iconicscontact@neduet.edu.pk";
