export interface Experience {
  _id: string;
  title: string;
  company?: string;
  period?: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
  tags?: string[];
  order?: number;
}

export interface SkillCategory {
  _id: string;
  name: string;
  color?: string;
  bg?: string;
  icons?: string[];
  skills?: string[];
  order?: number;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  stack?: string[];
  tags?: string[];
  github?: string;
  live?: string;
  icons?: string[];
  accentColor?: string;
  borderColor?: string;
  order?: number;
}

export interface SocialLink {
  _id: string;
  platform: string;
  url: string;
  icon?: string;
  label?: string;
  order?: number;
}

export interface HeroSettings {
  badge?: string;
  name?: string;
  title?: string;
  tagline?: string;
  initials?: string;
  location?: string;
  resumeUrl?: string;
  profileImageUrl?: string;
}

export interface AboutSettings {
  content?: string;
}

export interface FooterSettings {
  tagline?: string;
  copyrightName?: string;
}

export interface RadarPoint {
  subject: string;
  A: number;
}

export interface ProgressBar {
  label: string;
  pct: number;
  color: string;
}

export interface EducationSettings {
  university?: string;
  degree?: string;
  cgpa?: string;
  research?: string;
}

export interface Certification {
  title: string;
  subtitle?: string;
  areas?: string[];
  color?: string;
  accent?: string;
  badgeBg?: string;
}

export interface HealthcareProduct {
  name: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
  features?: string[];
  clients?: string[];
  accentColor?: string;
  glow?: string;
}

export interface MarqueeTool {
  name: string;
  icon?: string;
  color?: string;
}

export interface CommandCenterLog {
  status: "pass" | "fail";
  title: string;
  type: string;
}

export interface CommandCenterKpi {
  value: string;
  label: string;
  icon?: "bug" | "zap" | "shield" | "git";
}

export interface CommandCenterSettings {
  logs?: CommandCenterLog[];
  kpis?: CommandCenterKpi[];
  coverage?: { automated: number; manual: number };
  quality?: {
    score: number;
    automationCoverage: number;
    deploymentReadiness: string;
    defectLeakage: string;
  };
}

export interface PortfolioSettings {
  section_titles?: Record<string, string>;
  hero?: HeroSettings;
  about?: AboutSettings;
  github_username?: string;
  contact_intro?: string;
  footer?: FooterSettings;
  radar_data?: RadarPoint[];
  progress_bars?: ProgressBar[];
  education?: EducationSettings;
  certifications?: Certification[];
  healthcare_products?: HealthcareProduct[];
  marquee_tools?: MarqueeTool[];
  command_center?: CommandCenterSettings;
}

export interface PortfolioData {
  experiences: Experience[];
  skills: SkillCategory[];
  projects: Project[];
  socials: SocialLink[];
  settings: PortfolioSettings;
}

export interface SettingItem {
  _id: string;
  key: string;
  value: unknown;
}

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  message?: string;
  error?: string;
}
