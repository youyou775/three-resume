export interface Experience {
  id: number;
  title: string;
  subtitle: string;
  bullets: string[];
  tech: string[];
}

export const experienceData: Experience[] = [
  {
    id: 0,
    title: "FISERV",
    subtitle: "Senior Full Stack Developer | Jan 2024 - Present",
    bullets: [
      "Maintained 2 front-end projects from beginning to end. Relying on angular to serve more than a hundred banks. Reducing defects by 50%.",
      "Contributed in change of legacy WinForms .Net 4.8 stack to a new C# .Net 8.0 and Angular stack. Increasing safety by more than 100% and performance by 30%.",
      "On the back-end used GraphQl connections in a mega project, along with Postgres on the smaller one",
      "On the back-end used GraphQl connections in a mega project, along with Postgres on the smaller one. Reducing under-fetching. Cost reduction of at least 40%.",
      "Mentored and co-managed a team of junior developers.",
      "Worked in an Agile environment with 2-week sprints, daily standups, and bi-weekly retrospectives. Saving 15% of time spent on project and having more reliable time lines."
    ],
    tech: ['C#', '.Net 8.0', 'Angular', 'GraphQL', 'Postgres', 'Azure DevOps', 'Bitbucket', 'Jira', 'MSSQL', 'CI/CD']
  },
  {
    id: 1,
    title: "CONIX",
    subtitle: "Senior Full Stack Developer / Computational Designer | Jul 2021 – Jan 2024",
    bullets: [
      "Lead a project of switching to Angular/React and Node.js to improve scalability. Increased deployment efficiency by 52%.",
      "Secured $1.2 million in funding. While reduced design time by over 90% through AI development. Allowing us to go from testing to serving over 1000 users.",
      "Managed a team of 3 computational designers/developers.",
      "Rewrote Conix from a Rhinoceros environment to a C# multi-objective optimization environment. Reducing our overhead on software expenses to almost zero.",
    ],
    tech: ['Node.js', 'React', 'Three.js', 'AWS', 'MYSQL', 'GoDaddy', 'Cloudflare', 'Docker', 'Rhino', 'Grasshopper', 'Python', 'C++']
  },
  {
    id: 2,
    title: "Yusuf Fahmy Architects (YFA)",
    subtitle: "Full Stack Developer / Computational Designer | Jul 2021 – Jun 2024",
    bullets: [
      "Spearheaded tech in a fast-paced startup environment. Building custom tools in C# and .NET, combining architecture and coding for innovative solutions. Increasing performance by 50% to 80%.",
      "Built physics engines from scratch using C# / Grasshopper. Increasing performance by more than 24 times for client facing AI.",
      "Wrote an in-house algorithm that reduces our floor planning path finder from 200ms to 1ms using tree structure.",
      "Wrote a plugin for grasshopper 3d for agent-based design called zebra. Has around 5k downloads reducing our agent-based designs to a matter of seconds simulated live to users.",
      "Secured first enterprise client seed round to found startup Conix.AI five folding our revenue."
    ],
    tech: ['Angular', 'c#', '.Net 8.0', 'MSSQL', 'GoDaddy', 'Cloudflare', 'Docker', 'Rhino', 'Grasshopper', 'Python', 'C++']
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

export const getExperienceByIndex = (index: number): Experience => {
  return experienceData.find(exp => exp.id === index) || {
    id: 0,
    title: "",
    subtitle: "",
    bullets: [],
    tech: []
  };
};