import source from "./portfolioSource.json";

type PortfolioSource = typeof source;

const CATEGORY_META: Record<string, { name: string; color: string; bg: string; icons: string[] }> = {
  testing: { name: "Testing", color: "text-cyan-400", bg: "bg-cyan-400/10 border-cyan-400/20", icons: [] },
  automation: { name: "Automation", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20", icons: ["SiCypress", "SiSelenium", "SiAppium"] },
  api_testing: { name: "API Testing", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20", icons: ["SiPostman"] },
  performance: { name: "Performance", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", icons: ["SiApachejmeter"] },
  bug_tracking: { name: "Bug Tracking", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", icons: ["SiJira"] },
  languages: { name: "Languages", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", icons: ["SiJavascript", "SiOpenjdk", "SiPython"] },
  version_control: { name: "Version Control", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", icons: ["SiGit", "SiGithub"] },
  methodologies: { name: "Methodologies", color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/20", icons: [] },
};

const HEALTHCARE_STYLES = [
  { badgeColor: "bg-blue-500/10 text-blue-400 border-blue-400/20", accentColor: "border-blue-500/20 hover:border-blue-500/40", glow: "from-blue-500/5" },
  { badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-400/20", accentColor: "border-cyan-500/20 hover:border-cyan-500/40", glow: "from-cyan-500/5" },
  { badgeColor: "bg-green-500/10 text-green-400 border-green-400/20", accentColor: "border-green-500/20 hover:border-green-500/40", glow: "from-green-500/5" },
  { badgeColor: "bg-violet-500/10 text-violet-400 border-violet-400/20", accentColor: "border-violet-500/20 hover:border-violet-500/40", glow: "from-violet-500/5" },
];

const CERT_STYLES = [
  { color: "border-cyan-400/20 hover:border-cyan-400/40", accent: "from-cyan-500/5", badgeBg: "bg-cyan-400/10 text-cyan-400" },
  { color: "border-violet-400/20 hover:border-violet-400/40", accent: "from-violet-500/5", badgeBg: "bg-violet-400/10 text-violet-400" },
];

const PROJECT_STYLES = [
  { icons: ["SiPostman"], accentColor: "from-orange-500/20 to-transparent", borderColor: "hover:border-orange-500/30" },
  { icons: ["SiApachejmeter"], accentColor: "from-yellow-500/20 to-transparent", borderColor: "hover:border-yellow-500/30" },
  { icons: ["SiSelenium"], accentColor: "from-green-500/20 to-transparent", borderColor: "hover:border-green-500/30" },
  { icons: ["SiCypress"], accentColor: "from-violet-500/20 to-transparent", borderColor: "hover:border-violet-500/30" },
];

const TOOL_ICONS: Record<string, { icon: string; color: string }> = {
  Cypress: { icon: "SiCypress", color: "#31BAF1" },
  Selenium: { icon: "SiSelenium", color: "#43B02A" },
  "Selenium WebDriver": { icon: "SiSelenium", color: "#43B02A" },
  Postman: { icon: "SiPostman", color: "#FF6C37" },
  "Apache JMeter": { icon: "SiApachejmeter", color: "#D22128" },
  JMeter: { icon: "SiApachejmeter", color: "#D22128" },
  Jira: { icon: "SiJira", color: "#0052CC" },
  GitHub: { icon: "SiGithub", color: "#f0f6fc" },
  JavaScript: { icon: "SiJavascript", color: "#f1e05a" },
  Java: { icon: "SiOpenjdk", color: "#F89820" },
  Python: { icon: "SiPython", color: "#3572a5" },
  Playwright: { icon: "SiCypress", color: "#31BAF1" },
};

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function extractGithubUsername(github: string): string {
  return github
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/^github\.com\//, "")
    .split("/")[0]
    .trim();
}

function normalizeUrl(value: string, prefix = "https://"): string {
  if (!value) return "";
  if (value.startsWith("http") || value.startsWith("mailto:")) return value;
  return `${prefix}${value}`;
}

function parsePercent(value: string): number {
  return parseInt(value.replace("%", ""), 10) || 0;
}

export function transformPortfolioSource(data: PortfolioSource = source) {
  const { profile, technical_arsenal, experience, featured_projects, healthcare_systems_tested, education_and_certifications } = data;
  const githubUsername = extractGithubUsername(profile.contact.github);
  const radarEstimates = technical_arsenal.skill_radar_estimates as Record<string, string>;

  const skills = Object.entries(CATEGORY_META)
    .filter(([key]) => {
      const val = (technical_arsenal as Record<string, unknown>)[key];
      return Array.isArray(val);
    })
    .map(([key, meta], order) => ({
      name: meta.name,
      color: meta.color,
      bg: meta.bg,
      skills: ((technical_arsenal as Record<string, unknown>)[key] as string[]) ?? [],
      icons: meta.icons,
      order,
    }));

  const marqueeTools: { name: string; icon: string; color: string }[] = [];
  const seen = new Set<string>();
  for (const cat of skills) {
    for (const skill of cat.skills) {
      const mapped = TOOL_ICONS[skill];
      if (mapped && !seen.has(skill)) {
        seen.add(skill);
        marqueeTools.push({ name: skill, icon: mapped.icon, color: mapped.color });
      }
    }
  }

  return {
    experiences: experience.map((exp, order) => ({
      title: exp.role,
      company: exp.company,
      period: exp.duration,
      current: exp.duration.toLowerCase().includes("present"),
      highlights: exp.responsibilities,
      tags: exp.tags,
      order,
    })),

    skills,

    projects: featured_projects.map((proj, order) => ({
      title: proj.name,
      description: proj.description,
      stack: proj.technologies,
      tags: (proj as { tags?: string[] }).tags ?? [],
      github: (proj as { github?: string }).github ?? "",
      live: "",
      icons: PROJECT_STYLES[order]?.icons ?? [],
      accentColor: PROJECT_STYLES[order]?.accentColor ?? "from-primary/20 to-transparent",
      borderColor: PROJECT_STYLES[order]?.borderColor ?? "hover:border-primary/30",
      order,
    })),

    socials: [
      { platform: "GitHub", url: normalizeUrl(profile.contact.github), icon: "github", label: profile.contact.github, order: 0 },
      { platform: "LinkedIn", url: normalizeUrl(profile.contact.linkedin), icon: "linkedin", label: profile.contact.linkedin, order: 1 },
      { platform: "Email", url: `mailto:${profile.contact.email}`, icon: "mail", label: profile.contact.email, order: 2 },
      { platform: "Location", url: "", icon: "map-pin", label: profile.location, order: 3 },
    ],

    settings: {
      section_titles: {
        about: "About Me",
        experience: "Experience",
        skills: "Technical Arsenal",
        projects: "Featured Projects",
        healthcare: "Healthcare Systems Tested",
        education: "Education & Certifications",
        github: "GitHub Activity",
        command_center: "QA Operations Center",
        contact: "Get in Touch"
      },
      hero: {
        badge: "QA Engineering Command Center",
        name: profile.name,
        title: profile.title,
        tagline: "Ensuring Software Quality Through Automation, API Testing, and Healthcare Technology.",
        initials: initialsFromName(profile.name),
        location: profile.location,
        resumeUrl: "",
        profileImageUrl: "",
      },
      about: { content: profile.summary },
      github_username: githubUsername,
      contact_intro: "Open to QA Engineering opportunities, freelance testing projects, and collaboration. Let's build quality software together.",
      footer: { tagline: "Built with Passion for Quality Engineering.", copyrightName: profile.name },
      radar_data: [
        { subject: "Automation", A: parsePercent(radarEstimates.test_automation ?? "82%") },
        { subject: "API Testing", A: parsePercent(radarEstimates.api_testing ?? "90%") },
        { subject: "Performance", A: parsePercent(radarEstimates.performance_testing ?? "75%") },
        { subject: "Manual QA", A: 95 },
        { subject: "Bug Triage", A: 88 },
        { subject: "CI/CD", A: 65 },
      ],
      progress_bars: [
        { label: "Test Automation", pct: parsePercent(radarEstimates.test_automation ?? "82%"), color: "bg-violet-400" },
        { label: "API Testing", pct: parsePercent(radarEstimates.api_testing ?? "90%"), color: "bg-cyan-400" },
        { label: "Performance Testing", pct: parsePercent(radarEstimates.performance_testing ?? "75%"), color: "bg-yellow-400" },
      ],
      education: {
        university: education_and_certifications.education.institution,
        degree: education_and_certifications.education.degree,
        cgpa: education_and_certifications.education.gpa,
        research: education_and_certifications.education.research,
      },
      certifications: education_and_certifications.certifications.map((cert, i) => ({
        title: cert.name,
        subtitle: cert.provider,
        areas: cert.topics,
        ...CERT_STYLES[i % CERT_STYLES.length],
      })),
      healthcare_products: healthcare_systems_tested.map((item, i) => ({
        name: item.name,
        badge: item.context,
        description: item.description,
        features: item.features,
        clients: (item as { clients?: string[] }).clients,
        ...HEALTHCARE_STYLES[i % HEALTHCARE_STYLES.length],
      })),
      marquee_tools: marqueeTools,
      command_center: {
        logs: [
          { status: "pass" as const, title: "Login API Validation", type: "API" },
          { status: "pass" as const, title: "Patient Registration Flow", type: "E2E" },
          { status: "pass" as const, title: "Regression Test Suite", type: "Regression" },
          { status: "fail" as const, title: "Inventory Sync Endpoint", type: "API" },
          { status: "pass" as const, title: "Performance Test Execution", type: "Performance" },
          { status: "pass" as const, title: "OpenMRS Patient Workflow", type: "Integration" },
          { status: "pass" as const, title: "Telemedicine Appointment Flow", type: "E2E" },
        ],
        kpis: [
          { value: `${profile.metrics.bugs_reported}+`, label: "Bugs Reported", icon: "bug" as const },
          { value: `${profile.metrics.tests_executed}+`, label: "Tests Executed", icon: "zap" as const },
          { value: profile.metrics.defect_reduction, label: "Defect Reduction", icon: "shield" as const },
          { value: `${profile.metrics.projects_delivered}+`, label: "Projects Delivered", icon: "git" as const },
        ],
        coverage: {
          automated: parsePercent(profile.metrics.automation_coverage),
          manual: 100 - parsePercent(profile.metrics.automation_coverage),
        },
        quality: {
          score: parsePercent(profile.metrics.quality_score),
          automationCoverage: parsePercent(profile.metrics.automation_coverage),
          deploymentReadiness: profile.metrics.deployment_readiness,
          defectLeakage: profile.metrics.defect_leakage,
        },
      },
    },
  };
}

export const SEED_DATA = transformPortfolioSource();
