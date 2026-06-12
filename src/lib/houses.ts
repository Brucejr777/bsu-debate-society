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
    color: "#FF8C00",
    description:
      "The House of Bathala embodies the foundational pillar of Leadership. Represented by the vibrant colors of Orange and Amber, this House is the driving force behind principled governance, transparency, and community building within the Society. Bathala specializes in developing leadership competencies, fostering mentorship programs, and cultivating the decision-making skills necessary to guide the organization. As the pillar of truth, transparency, and principled leadership, Bathala ensures that the Society remains anchored in integrity, accountability, and the continuous empowerment of its members to lead both within and beyond the organization.",
  },
  {
    slug: "kabunian",
    name: "House of Kabunian",
    value: "Journalism",
    color: "#C0C0C0",
    description:
      "The House of Kabunian embodies the pillar of Journalism. Cloaked in the colors of Silver and Gray, this House serves as the custodian of truth, communication, and the Society's historical record. Kabunian specializes in media excellence, documentation, and the ethical stewardship of knowledge. Through the production of high-quality debate chronicles, accurate public records, and insightful communication, Kabunian ensures that the Society's legacy is preserved and its voice is heard with clarity, precision, and objectivity. They champion the responsible use of information and the continuous transmission of knowledge across generations.",
  },
  {
    slug: "laon",
    name: "House of Laon",
    value: "Academics",
    color: "#228B22",
    description:
      "The House of Laon embodies the pillar of Academics. Adorned in the colors of Emerald Green, this House is the intellectual engine of the Society, dedicated to scholarly inquiry, research, and critical analysis. Laon champions intellectual growth by organizing research forums, producing case briefs, and facilitating academic skill-building sessions. Guided by a commitment to long-term stewardship and the flourishing of the mind, Laon ensures that the Society's discourse is always rooted in rigorous logic, deep knowledge, and academic excellence. They are the architects of the Society's intellectual rigor and strategic foresight.",
  },
  {
    slug: "manama",
    name: "House of Manama",
    value: "Arts",
    color: "#8B008B",
    description:
      "The House of Manama embodies the pillar of Arts. Illuminated by the colors of Royal Purple, this House represents the creative soul of the Society, dedicated to artistic expression, cultural appreciation, and human dignity. Manama pushes the boundaries of traditional debate by integrating performance, creative formats, and artistic innovation into discourse. By fostering a supportive environment that prioritizes holistic well-being, psychological resilience, and creative freedom, Manama ensures that the Society remains a vibrant, adaptable, and culturally rich community where intellectual pursuit is balanced with human empathy.",
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