export type Lane = "engineering" | "product" | "both";
export type RunIcon = "building" | "shield" | "gauge" | "layers" | "coins" | "stack" | "chart" | "route" | "layout";

export type CareerStep = {
  id: string; // "mannheim", "sovanta", … also used as the Work card anchor (#work-<id>)
  company: string; // "Uni Mannheim"
  label: string; // "BUSINESS INFORMATICS", shown uppercase in mono
  years: string; // "2015–19", "2016", "NOW"
  lane: Lane;
  logo?: string; // filename in src/images/companies/; without one the tile shows the company's initial
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
  imgSrc?: string; // path under src/images/projects/
  imgAlt?: string;
  tint: "parchment" | "stone" | "sage"; // screenshot background
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

type WorkEntryBase = {
  id: string; // matches CareerStep.id when the job is on the career graph
  company: string;
  role: string;
  period: string; // "2024 → 2026", "2026 → now", "2019"
  lane: Lane;
  logo?: string; // filename in src/images/companies/; without one the logo tile shows the company's initial
  url: string;
};

export type WorkEntry =
  | (WorkEntryBase & {
      compact?: false;
      highlight: string;
      runs: Run[]; // empty = "first runs in progress"
    })
  | (WorkEntryBase & { compact: true }); // a thin row: no highlight, no runs
