/**
 * Institution logos (current official marks, from each institution's site or Wikipedia infobox).
 * `match` links free-text affiliations from the API to a logo.
 */
type Logo = { key: string; name: string; src: string; w: number; h: number; match: RegExp };

const L = (key: string, name: string, file: string, w: number, h: number, match: RegExp): Logo => ({
  key,
  name,
  src: `/logos/inst/${file}`,
  w,
  h,
  match,
});

export const INSTITUTION_LOGOS: Logo[] = [
  L("uc-berkeley", "University of California, Berkeley", "uc-berkeley.svg", 675, 184, /berkeley/i),
  L("texas-am", "Texas A&M University", "texas-am.svg", 125, 27, /texas a\s*&\s*m/i),
  L("leeds", "University of Leeds", "leeds.svg", 352, 102, /leeds/i),
  L("northumbria", "Northumbria University", "northumbria.png", 561, 178, /northumbria/i),
  L("anglia-ruskin", "Anglia Ruskin University", "anglia-ruskin.svg", 120, 80, /anglia ruskin/i),
  L("birmingham-city", "Birmingham City University", "birmingham-city.png", 316, 316, /birmingham city/i),
  L("munster-tu", "Munster Technological University", "munster-tu.png", 326, 100, /munster/i),
  L("bht-berlin", "Berliner Hochschule für Technik", "bht-berlin.svg", 262, 73, /(berliner hochschule|beuth|bht)/i),
  L("massey", "Massey University", "massey.svg", 2020, 516, /massey/i),
  L("unsw", "UNSW Sydney", "unsw.png", 330, 140, /(unsw|new south wales)/i),
  L("utp", "Universiti Teknologi PETRONAS", "utp.png", 2097, 833, /(petronas|\butp\b)/i),
  L("utem", "Universiti Teknikal Malaysia Melaka", "utem.svg", 400, 229, /(utem|teknikal malaysia)/i),
  L("zayed", "Zayed University", "zayed.svg", 50, 50, /zayed/i),
  L("suny", "State University of New York", "suny.svg", 146, 72, /(suny|state university of new york)/i),
  L("ctu-prague", "Czech Technical University in Prague", "ctu-prague.svg", 142, 142, /czech technical/i),
  L("fast-nuces", "FAST National University", "fast-nuces.png", 597, 150, /(fast|nuces|national university of computer)/i),
  L("iba", "Institute of Business Administration, Karachi", "iba.png", 195, 224, /(institute of business administration|\biba\b)/i),
  L("giki", "GIK Institute", "giki.png", 570, 175, /(giki|ghulam ishaq)/i),
  L("karachi-uni", "University of Karachi", "karachi-uni.png", 290, 356, /university of karachi/i),
  L("habib", "Habib University", "habib.svg", 288, 100, /habib university/i),
  L("ned", "NED University of Engineering & Technology", "ned.png", 339, 333, /\bned\b/i),
  L("uet-lahore", "University of Engineering and Technology, Lahore", "UET.png", 224, 225, /(\buet\b\W*lahore|engineering (and|&) technology,?\s*lahore)/i),
  L("amazon", "Amazon", "amazon.svg", 399, 133, /amazon/i),
  L("outsystems", "OutSystems", "outsystems.png", 500, 105, /outsystems/i),
];

const byKey = (k: string) => INSTITUTION_LOGOS.find((l) => l.key === k)!;

/** Institutions of people who spoke at, reviewed for or organised past editions (2016–2024). */
export const PAST_INSTITUTIONS = [
  "uc-berkeley",
  "leeds",
  "suny",
  "northumbria",
  "massey",
  "utp",
  "munster-tu",
  "bht-berlin",
  "anglia-ruskin",
  "utem",
  "zayed",
  "unsw",
  "birmingham-city",
  "fast-nuces",
  "iba",
  "giki",
  "karachi-uni",
].map(byKey);
