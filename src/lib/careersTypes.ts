export type JobStatus = 'draft' | 'published' | 'closed' | 'archived';
export type EmploymentType = 'Full-time' | 'Internship' | 'Contract';
export type WorkLocationType = 'Remote' | 'Hybrid' | 'On-site';
export type ApplicationStatus = 'new' | 'shortlisted' | 'rejected' | 'hired';
export type QuestionType = 'short_text' | 'yes_no' | 'multi_select';

export interface CareerQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  enabled?: boolean;
  source: 'base' | 'job';
}

export interface CareerJob {
  id: string;
  title: string;
  department: string;
  location: string;
  locationType: WorkLocationType;
  employmentType: EmploymentType;
  experienceRange?: string;
  overview: string;
  responsibilities: string[];
  mustHave: string[];
  niceToHave: string[];
  successMetrics: string[];
  jdFileUrl?: string;
  jdFileName?: string;
  status: JobStatus;
  questionnaire: CareerQuestion[];
  applicationsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareerApplicationAnswer {
  questionId: string;
  question: string;
  type: QuestionType;
  value: string | boolean | string[];
}

export interface CareerApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  resumeFileName: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  location?: string;
  noticePeriod?: string;
  status: ApplicationStatus;
  adminNotes?: string;
  answers: CareerApplicationAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCareerJobData {
  title: string;
  department: string;
  location: string;
  locationType: WorkLocationType;
  employmentType: EmploymentType;
  experienceRange?: string;
  overview: string;
  responsibilities: string[];
  mustHave: string[];
  niceToHave: string[];
  successMetrics: string[];
  jdFileUrl?: string;
  jdFileName?: string;
  status: JobStatus;
  questionnaire: CareerQuestion[];
}

export interface UpdateCareerJobData extends Partial<CreateCareerJobData> {
  id: string;
}

export interface CreateCareerApplicationData {
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  resumeFileName: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  location?: string;
  noticePeriod?: string;
  answers: CareerApplicationAnswer[];
}

