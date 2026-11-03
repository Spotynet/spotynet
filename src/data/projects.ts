export const projects = [
  {
    id: "intacsep",
    image: "/projects/intacsep.png",
  },
  {
    id: "homly",
    href: "https://homly.com.mx",
    image: "/projects/homly.png",
  },
  {
    id: "nabbi",
    image: "/projects/nabbi.png",
  },
] as const;

export type ProjectId = (typeof projects)[number]["id"];

export type ProjectCopy = {
  category: string;
  title: string;
  result: string;
};
