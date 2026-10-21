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

export type CompanyIndustryId =
  | "health"
  | "education"
  | "finance"
  | "climate"
  | "mobility"
  | "travel"
  | "commerce"
  | "media"
  | "work"
  | "software"
  | "tech"
  | "industry";

export type CompanyIndustry = {
  id: CompanyIndustryId;
  label: string; // section heading, "Health & wellbeing"
  short: string; // filter pill, "Health"
};

export type CompanySize = "startup" | "scale-up" | "enterprise";

// Tags are best-effort and editorial: a starting point, not a hiring guarantee.
export type Company = {
  id: string; // slug of the name
  name: string;
  industry: CompanyIndustryId;
  sector: string; // "Healthcare", groups cards within an industry
  focus: string; // "Clinical AI"
  url?: string; // website
  logo?: string; // filename in src/images/companies/directory/; without one the tile shows the initial
  hq: { city: string; country?: string }; // city "Remote" for remote-first companies; country is ISO 3166 alpha-2
  europe?: "hq" | "office"; // headquartered in Europe, or a European office
  remote?: true; // remote-friendly hiring
  customers: ("b2b" | "b2c")[];
  size: CompanySize; // startup: early and small; scale-up: private and growing; enterprise: public or large
  status?: "acquired"; // hidden unless "acquired" is on
  note?: string; // "Now part of Okta", "Formerly TripActions"
};

export type CompanyDirectory = {
  industries: CompanyIndustry[];
  companies: Company[];
};
