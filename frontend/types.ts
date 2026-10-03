export interface SkillMatch {
  name: string;
  category: 'hard' | 'soft' | 'tool' | 'certification';
  status: 'matched' | 'missing' | 'partial';
  importance: 'critical' | 'preferred' | 'bonus';
  evidenceInResume?: string;
}

export interface BulletRewrite {
  original: string;
  improved: string;
  rationale: string;
  targetedKeywords: string[];
}

export interface InteractiveBulletItem extends BulletRewrite {
  id: string;
  userEdited?: string;
  isCustom?: boolean;
}

export interface InterviewQuestion {
  question: string;
  category: 'technical' | 'behavioral' | 'gap-investigation';
  reasoning: string;
  recommendedAnswerStrategy: string;
}

export interface ScreeningAnswer {
  question: string;
  suggestedAnswer: string;
  fieldCategory: 'motivation' | 'experience' | 'compensation' | 'availability' | 'general';
}

export interface ApplicationKit {
  portalType: 'Greenhouse' | 'Lever' | 'Workday' | 'Ashby' | 'LinkedIn' | 'Direct Career Portal';
  companyName: string;
  jobTitle: string;
  subjectLine: string;
  screeningAnswers: ScreeningAnswer[];
  directApplyUrl: string;
  salaryRecommendation: string;
}

export interface ApplicationRecord {
  id: string;
  timestamp: number;
  jobTitle: string;
  companyName: string;
  status: 'Submitted' | 'Copilot-Ready' | 'In-Review';
  confirmationCode?: string;
  portalType: string;
  appliedDate: string;
}

export interface CandidateProfile {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  githubUrl: string;
  authorizedInCountry: boolean;
  requiresSponsorship: boolean;
  noticePeriod: string;
  desiredSalary: string;
}

export interface MatchAnalysisResult {
  overallScore: number;
  atsCompatibilityScore: number;
  breakdown: {
    skillsMatch: number;
    experienceAlignment: number;
    educationCertifications: number;
    seniorityLevelFit: number;
  };
  jobSummary: {
    title: string;
    level: string;
    companyVibe: string;
    primaryStack: string[];
  };
  candidateSummary: {
    inferredTitle: string;
    totalYearsExp: string;
    topStrengths: string[];
  };
  executiveVerdict: string;
  keyStrengths: string[];
  criticalGaps: string[];
  missingKeywords: string[];
  skillsBreakdown: SkillMatch[];
  tailoredHeadline: string;
  tailoredSummary: string;
  bulletRewrites: BulletRewrite[];
  interviewQuestions: InterviewQuestion[];
}

export interface PresetSample {
  id: string;
  title: string;
  role: string;
  resume: string;
  jobDescription: string;
  suggestedUrl?: string;
}
