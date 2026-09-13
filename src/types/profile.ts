export interface PersonalInfo {
  name: string;
  title: string;
  shortBio: string;
  about: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
  avatarUrl: string;
  cvUrl: string;
  availability: {
    status: "available" | "busy" | "contract";
    badgeText: string;
    description: string;
  };
  education: {
    degree: string;
    school: string;
    gpa: string;
    period: string;
    major: string;
    honors: string;
    achievements: string[];
  };
}

export interface TechnicalPillar {
  icon: string;
  title: string;
  description: string;
}

export interface MetricItem {
  id: string;
  value: string;
  suffix?: string;
  label: string;
  sublabel: string;
  highlight?: string;
  accent: "emerald" | "cyan" | "amber" | "indigo";
}

export interface SkillItem {
  name: string;
  highlight?: boolean;
  depth: string;
  tags: string[];
}

export interface SkillCategory {
  id: string;
  category: string;
  badge: string;
  description: string;
  skills: SkillItem[];
}

export interface JourneyStage {
  id: string;
  period: string;
  phaseLabel: string;
  title: string;
  badge: string;
  highlights: string[];
  skills: string[];
  image: string;
  imageAlt: string;
  imageCaption: string;
  highlightColor: "emerald" | "cyan" | "purple";
  isCurrent?: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  department?: string;
  role: string;
  period: string;
  location: string;
  isCurrent?: boolean;
  summary: string;
  duties?: string[];
  star?: {
    situation: string;
    task: string;
    action: string[];
    result: string[];
  };
  metrics: {
    label: string;
    value: string;
  }[];
  technologies: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  summary: string;
  description?: string;
  category?: string;
  categoryLabel?: string;
  challenge?: string;
  solution?: string;
  architecture?: string;
  technologies: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  imageUrl: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issuerLogoText: string;
  issueDate: string;
  credentialId?: string;
  verifyUrl?: string;
  imageUrl?: string;
  pdfUrl?: string;
  skills: string[];
  highlight?: boolean;
}

export interface ArticleItem {
  id: string;
  title: string;
  summary: string;
  readTime: string;
  date: string;
  category: string;
  imageUrl: string;
  url?: string;
  keyTakeaways: string[];
}
