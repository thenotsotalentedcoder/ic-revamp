/** Past editions. Facts carried over from the previous site's archive; photos in /public/archive/<year>/. */
export type Edition = {
  year: number;
  label: string;
  ordinal: string;
  dates: string;
  theme: string;
  summary: string;
  stats: { label: string; value: string }[];
  keynotes: { name: string; affiliation: string }[];
  highlights: string[];
  photos: { src: string; alt: string }[];
  /** Homepage teaser image, deliberately different from the photos on the editions page. */
  cover: { src: string; alt: string };
  proceedings?: { label: string; href: string };
};

export const EDITIONS_ARCHIVE: Edition[] = [
  {
    year: 2024,
    cover: { src: "/archive/2024/4.jpg", alt: "A participant during a session at iCONICS’24" },
    label: "iCONICS’24",
    ordinal: "4th edition",
    dates: "13–14 November 2024",
    theme: "Quantum technologies, generative AI and edge computing",
    summary:
      "The fourth edition centred on quantum technologies and generative AI, with researchers from UC Berkeley, INRIM (Italy), Munster Technological University (Ireland), UFRPE (Brazil) and NILOP. Two workshops, on quantum technologies and on NLP and contrastive learning, ran alongside nine keynote sessions.",
    stats: [
      { label: "Keynote and workshop speakers", value: "9" },
      { label: "Countries represented", value: "5" },
      { label: "Workshops", value: "2" },
    ],
    keynotes: [
      { name: "Prof. Irfan Siddiqi", affiliation: "University of California, Berkeley, USA" },
      { name: "Prof. Marco Genovese", affiliation: "INRIM, Italy" },
      { name: "Prof. Rafael Ferreira Mello", affiliation: "UFRPE, Brazil" },
      { name: "Dr. Mubashir Rehmani", affiliation: "Munster Technological University, Ireland" },
      { name: "Dr. Manzoor Ikram", affiliation: "NILOP, Pakistan" },
      { name: "Prof. Jawwad A. Shamsi", affiliation: "FAST-NUCES, Pakistan" },
    ],
    highlights: [
      "Quantum technologies workshop in three tracks: computing, metrology & sensing, and algorithms",
      "NLP and contrastive learning tutorial workshop",
      "Keynote on the future of cryptocurrency in Pakistan",
    ],
    photos: [
      { src: "/archive/2024/2.jpg", alt: "Guests and audience at the opening of iCONICS’24" },
      { src: "/archive/2024/3.jpg", alt: "A hands-on workshop session at iCONICS’24" },
      { src: "/archive/2024/6.jpg", alt: "A speaker presenting during an iCONICS’24 session" },
    ],
  },
  {
    year: 2022,
    cover: { src: "/archive/2022/6.jpg", alt: "A keynote address in the main auditorium at iCONICS’22" },
    label: "iCONICS’22",
    ordinal: "3rd edition",
    dates: "14–15 December 2022",
    theme: "AI, quantum computing, cybersecurity and blockchain",
    summary:
      "The first edition published in IEEE Xplore. Industry leaders spoke alongside researchers: Rehan Jalil (CEO, Securiti) on cybersecurity and Dr. Grégoire Ribordy (CEO, ID Quantique) on quantum cryptography, with dedicated quantum computing and cybersecurity tracks.",
    stats: [
      { label: "Keynote speakers", value: "7" },
      { label: "Proceedings", value: "IEEE Xplore" },
    ],
    keynotes: [
      { name: "Prof. Datuk Ts. Dr. Shahrin Sahib", affiliation: "Universiti Teknikal Malaysia Melaka, Malaysia" },
      { name: "Dr. Grégoire Ribordy", affiliation: "ID Quantique, Switzerland" },
      { name: "Rehan Jalil", affiliation: "Securiti, USA" },
      { name: "Prof. Agathe Merceron", affiliation: "Berliner Hochschule für Technik, Germany" },
      { name: "Dr. Javaid Butt", affiliation: "Anglia Ruskin University, UK" },
      { name: "Dr. Kashif Kifayat", affiliation: "Air University, Pakistan" },
    ],
    highlights: [
      "First iCONICS edition indexed in IEEE Xplore",
      "Chief Guest: Mr. Asif Ikram, Secretary IT, Government of Sindh",
      "Guest of Honour: Ms. Jehan Ara, CEO, Katalyst Labs",
    ],
    photos: [
      { src: "/archive/2022/2022-lectern-2.jpg", alt: "A guest address at the NED University lectern, iCONICS’22" },
      { src: "/archive/2022/2022-keynote-closeup.jpg", alt: "A keynote speaker addressing the auditorium at iCONICS’22" },
      { src: "/archive/2022/2022-students.jpg", alt: "Students in the audience at iCONICS’22" },
    ],
    proceedings: { label: "Proceedings in IEEE Xplore", href: "https://ieeexplore.ieee.org/xpl/conhome/10099477/proceeding" },
  },
  {
    year: 2018,
    cover: { src: "/archive/2018/4.jpg", alt: "A paper presentation at iCONICS’18" },
    label: "iCONICS’18",
    ordinal: "2nd edition",
    dates: "5–6 December 2018",
    theme: "ICT innovation and cross-cultural research exchange",
    summary:
      "The second edition drew submissions from eight countries, including Germany, Italy, Jordan and Saudi Arabia, with six international keynote speakers. Proceedings were published in a dedicated volume.",
    stats: [
      { label: "Papers submitted", value: "42" },
      { label: "Papers presented", value: "16" },
      { label: "Countries", value: "8" },
      { label: "Keynote speakers", value: "6" },
    ],
    keynotes: [
      { name: "Dr. Eric Atwell", affiliation: "University of Leeds, UK" },
      { name: "Prof. Agathe Merceron", affiliation: "Beuth University of Applied Sciences, Germany" },
      { name: "Dr. Asad Masood Khattak", affiliation: "Zayed University, UAE" },
      { name: "Dr. Siva Kumar Subramaniam", affiliation: "Universiti Teknologi PETRONAS, Malaysia" },
    ],
    highlights: ["Patron: Dr. Sarosh Hashmat Lodi, Vice Chancellor, NED University"],
    photos: [
      { src: "/archive/2018/5.jpg", alt: "Question and answer session at iCONICS’18" },
    ],
    proceedings: { label: "Proceedings (PDF)", href: "https://www.nediconics.com/documents/Final-ICONICS'18-Proceedings.pdf" },
  },
  {
    year: 2016,
    cover: { src: "/archive/2016/4.jpg", alt: "Participants at iCONICS’16" },
    label: "iCONICS’16",
    ordinal: "1st edition",
    dates: "15–16 December 2016",
    theme: "Artificial intelligence, IoT and emerging computing",
    summary:
      "The inaugural edition brought together researchers from Pakistan, the USA, the UK, Malaysia and New Zealand. With 73 submissions and a 26% acceptance rate, it established iCONICS as a serious academic forum. Proceedings were published in a special issue of the NED University Journal of Research.",
    stats: [
      { label: "Papers submitted", value: "73" },
      { label: "Papers accepted", value: "19" },
      { label: "Acceptance rate", value: "26%" },
      { label: "Countries", value: "5" },
    ],
    keynotes: [
      { name: "Prof. Junaid Ahmed Zubairi", affiliation: "State University of New York, USA" },
      { name: "Dr. Muhammad Atif Tahir", affiliation: "Northumbria University, UK" },
      { name: "Dr. Syed Faraz Hassan", affiliation: "Massey University, New Zealand" },
      { name: "Prof. Nasreen Badruddin", affiliation: "Universiti Teknologi PETRONAS, Malaysia" },
    ],
    highlights: [
      "Chief Guest: Mr. Jam Mehtab Dahar, Minister of Education, Sindh",
      "Sponsored by HEC Pakistan, USEFP and Pak Suzuki",
    ],
    photos: [
      { src: "/archive/2016/1.jpg", alt: "Inaugural session panel at iCONICS’16" },
    ],
    proceedings: { label: "Proceedings (PDF)", href: "https://www.nediconics.com/documents/Final-ICONICS'16-Proceedings-Website.pdf" },
  },
];
