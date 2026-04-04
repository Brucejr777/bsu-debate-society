export interface HouseInfo {
  slug: string;
  name: string;
  value: string;
  color: string;
  description: string;
}

export const HOUSES: HouseInfo[] = [
  {
    slug: "bathala",
    name: "House of Bathala",
    value: "Leadership",
    color: "#8b0000",
    description:
      "The House of Bathala embodies the value of Leadership. Through mentorship programs, leadership workshops, and member-driven initiatives, Bathala cultivates decision-making, team management, and the ability to empower others — preparing debaters who lead with integrity both within and beyond the Society.",
  },
  {
    slug: "kabunian",
    name: "House of Kabunian",
    value: "Journalism",
    color: "#280137",
    description:
      "The House of Kabunian embodies the value of Journalism. Dedicated to advancing communication, documentation, and media excellence, Kabunian produces high-quality debate chronicles, informative content, and engaging public records — sharpening members into articulate storytellers and truth-tellers.",
  },
  {
    slug: "laon",
    name: "House of Laon",
    value: "Academic",
    color: "#000b90",
    description:
      "The House of Laon embodies the value of Academic excellence. Through research forums, case briefs, academic skill-building sessions, and critical analysis workshops, Laon promotes intellectual growth and scholarly inquiry — building debaters grounded in rigor, evidence, and deep understanding.",
  },
  {
    slug: "manama",
    name: "House of Manama",
    value: "Arts",
    color: "#006400",
    description:
      "The House of Manama embodies the value of the Arts. By developing creativity, artistic expression, and cultural appreciation, Manama integrates performance and design into discourse — producing debaters who combine aesthetic vision with persuasive power.",
  },
];

export const HOUSE_BY_SLUG: Record<string, HouseInfo> = {};
for (const h of HOUSES) {
  HOUSE_BY_SLUG[h.slug] = h;
}

export const HOUSE_VALUES: Record<string, string> = {};
export const HOUSE_COLORS: Record<string, string> = {};
export const HOUSE_LABELS: Record<string, string> = {};
for (const h of HOUSES) {
  HOUSE_VALUES[h.name.replace("House of ", "")] = h.value;
  HOUSE_COLORS[h.name.replace("House of ", "")] = h.color;
  HOUSE_LABELS[h.name.replace("House of ", "")] = h.name;
}

export const VALID_HOUSE_SLUGS = HOUSES.map((h) => h.slug);
