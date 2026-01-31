export interface Experience {
  id: number;
  title: string;
  subtitle: string;
  bullets: string[];
  tech: string[];
}

export const experienceData: Experience[] = [
  {
    id: 1,
    title: "FISERV",
    subtitle: "Senior Full Stack Developer | Jan 2024 - Present",
    bullets: [
      "Maintained 2 front-end projects from beginning to end. Relying on angular to serve more than a hundred banks",
      "Contributed in change of legacy WinForms .Net 4.8 stack to a new C# .Net 8.0 and Angular stack",
      "On the back-end used GraphQl connections in a mega project, along with Postgres on the smaller one",
      "Mentored and co-managed 6 junior developers",
      "Worked in an Agile environment with 2 week sprints, daily standups, and bi-weekly retrospectives",
    ],
    tech: ['C#', '.Net 8.0', 'Angular', 'GraphQL', 'Postgres', 'Azure DevOps', 'Bitbucket', 'Jira', 'MSSQL']
  },
  {
    id: 2,
    title: "CONIX",
    subtitle: "Senior Full Stack Developer / Computational Designer | Jul 2021 – Jan 2024",
    bullets: [
      "Switched to Angular/React and Node.js to improve scalability. Increased deployment efficiency by 50%",
      "Managed DevOps through GoDaddy then Cloudflare, reducing costs by 33%",
      "Wrote database using MYSQL migrating from MSSQL",
      "Secured $1.2 million in funding. While reduced design time by over 90% through AI development",
      "Deployed stacks on AWS, serving over 1000 users",
      "Managed a team of 3 computational designers/developers"
    ],
    tech: ['Node.js', 'React', 'Angular', 'Three.js', 'AWS', 'MYSQL', 'MSSQL', 'GoDaddy', 'Cloudflare', 'Docker', 'Rhino', 'Grasshopper', 'Python', 'C++']
  },
  {
    id: 3,
    title: "MODERN ACADEMY",
    subtitle: "Bachelor's Degree in Architecture | Sep 2012 – Jun 2017",
    bullets: [
      "Graduated with a B+ average (above 80%). Demonstrated creative computational design skills",
      "Conducted innovative research and implemented new systems. Developed concepts using beginner C++"
    ],
    tech: ['AutoCAD', '3ds Max', 'Vray', 'Photoshop', 'Illustrator', 'InDesign', 'Premiere Pro', 'Grasshopper', 'C++']
  }
];

export const getExperienceByScrollIndex = (scrollIndex: number): Experience => {
  return experienceData.find(exp => exp.id === scrollIndex) || {
    id: 0,
    title: "",
    subtitle: "",
    bullets: [],
    tech: []
  };
};