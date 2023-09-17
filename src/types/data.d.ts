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
  by?: string;
  url?: string;
  icon: string;
};
