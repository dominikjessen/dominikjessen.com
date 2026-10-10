export type Lane = "engineering" | "product" | "both";
export type RunIcon = "building" | "shield" | "gauge" | "layers" | "coins" | "stack" | "chart" | "route" | "layout";

export type CareerStep = {
  id: string; // "mannheim", "sovanta", … also used as the Work card anchor (#work-<id>)
  company: string; // "Uni Mannheim"
  label: string; // "BUSINESS INFORMATICS", shown uppercase in mono
  years: string; // "2015–19", "2016", "NOW"
  lane: Lane;
  logo: string; // filename in src/images/companies/
  current?: boolean; // the pine step with the "Dominik" cursor
};

export type Run = { metric: string; detail: string; icon: RunIcon };

export type Project = {
  name: string;
  input: string; // IN pill
  output: string; // OUT pill
  tagline: string; // short copy shown on the card
  description: string; // existing long copy, kept for later project pages
  stat?: string; // optional pill, e.g. "150 monthly visits"
  url?: string;
  github?: string;
  imgSrc?: string;
  imgAlt?: string;
  tint: "parchment" | "stone" | "sage"; // screenshot background; replaces bgColor
  /** Legacy ProjectCard background; removed with the new Side projects section. */
  bgColor?: string;
  techStack?: string[];
};

export type CurrentlyItem = {
  title: string;
  url?: string;
  emoji: string;
};

export type CurrentlyCategoryKey =
  | "building"
  | "thinking"
  | "reading"
  | "listening"
  | "watching"
  | "drinking";

export type CurrentlyCategory = {
  heading: string;
  items: CurrentlyItem[];
};

export type Achievement = {
  emoji: string;
  company: string;
  year: number | string;
  metric: string;
  description: string;
  bgColor: string;
  isCta?: boolean;
  tagLabel?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type WorkEntry = {
  id: string; // matches CareerStep.id
  company: string;
  role: string;
  period: string; // "2024 → 2026", "2026 → now"
  lane: Lane;
  logo: string;
  highlight: string;
  url: string;
  runs: Run[]; // empty = "first runs in progress"
};
