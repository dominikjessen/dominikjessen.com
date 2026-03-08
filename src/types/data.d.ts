export type Project = {
  name: string;
  description: string;
  url?: string;
  github?: string;
  imgSrc?: string;
  imgAlt?: string;
  bgColor: string;
  techStack?: string[];
};

export type CurrentlyItem = {
  title: string;
  url?: string;
  icon: string;
  iconType?: "text" | "fill";
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
  company: string;
  role: string;
  period: string;
  highlight: string;
  url: string;
};
