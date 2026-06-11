import {
  Github, Linkedin, Mail, MapPin, Twitter, Globe, Instagram, Youtube,
  Facebook, MessageCircle, Link as LinkIcon,
} from "lucide-react";
import {
  SiCypress, SiSelenium, SiPostman, SiApachejmeter, SiJira, SiGit, SiGithub,
  SiJavascript, SiOpenjdk, SiPython, SiAppium,
} from "react-icons/si";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  "map-pin": MapPin,
  twitter: Twitter,
  globe: Globe,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  link: LinkIcon,
  "message-circle": MessageCircle,
};

const REACT_ICONS: Record<string, IconType> = {
  SiCypress,
  SiSelenium,
  SiPostman,
  SiApachejmeter,
  SiJira,
  SiGit,
  SiGithub,
  SiJavascript,
  SiOpenjdk,
  SiPython,
  SiAppium,
};

export function detectSocialIcon(url: string, platform?: string): string {
  const combined = `${url} ${platform ?? ""}`.toLowerCase();
  if (combined.includes("github")) return "github";
  if (combined.includes("linkedin")) return "linkedin";
  if (combined.includes("twitter") || combined.includes("x.com")) return "twitter";
  if (combined.includes("instagram")) return "instagram";
  if (combined.includes("youtube") || combined.includes("youtu.be")) return "youtube";
  if (combined.includes("facebook") || combined.includes("fb.com")) return "facebook";
  if (combined.includes("mailto:") || (combined.includes("@") && combined.includes(".com"))) return "mail";
  if (combined.includes("location") || platform?.toLowerCase() === "location") return "map-pin";
  return "globe";
}

export function renderSocialIcon(iconName: string, className = "w-5 h-5") {
  const Icon = LUCIDE_ICONS[iconName] ?? Globe;
  return <Icon className={className} />;
}

export function renderTechIcon(iconName: string, className = "w-6 h-6") {
  const Icon = REACT_ICONS[iconName];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export const SOCIAL_ICON_OPTIONS = [
  { value: "github", label: "GitHub", Icon: Github },
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { value: "mail", label: "Email", Icon: Mail },
  { value: "map-pin", label: "Location", Icon: MapPin },
  { value: "twitter", label: "Twitter/X", Icon: Twitter },
  { value: "instagram", label: "Instagram", Icon: Instagram },
  { value: "youtube", label: "YouTube", Icon: Youtube },
  { value: "facebook", label: "Facebook", Icon: Facebook },
  { value: "globe", label: "Website", Icon: Globe },
];

export const TECH_ICON_OPTIONS = Object.keys(REACT_ICONS);

export function getTechIconComponent(iconName: string): IconType | null {
  return REACT_ICONS[iconName] ?? null;
}

export function getSocialIconComponent(iconName: string): LucideIcon {
  return LUCIDE_ICONS[iconName] ?? Globe;
}
