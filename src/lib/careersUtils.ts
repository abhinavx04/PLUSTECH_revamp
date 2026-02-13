import emailjs from '@emailjs/browser';
import { getFileSizeMB } from './imageUtils';
import type {
  CareerApplication,
  CareerApplicationAnswer,
  CareerQuestion,
} from './careersTypes';

const DEFAULT_MAX_RESUME_MB = 5;
const DEFAULT_MAX_JD_MB = 10;

export const MAX_RESUME_SIZE_MB = Number(import.meta.env.VITE_MAX_RESUME_SIZE_MB || DEFAULT_MAX_RESUME_MB);
export const MAX_JD_SIZE_MB = Number(import.meta.env.VITE_MAX_JD_SIZE_MB || DEFAULT_MAX_JD_MB);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '').trim();

export const sanitizeText = (value: string) => stripHtml(value).replace(/\s+/g, ' ');

export const sanitizeOptionalText = (value?: string) => (value ? sanitizeText(value) : undefined);

export const sanitizeTextList = (values: string[]) =>
  values.map((v) => sanitizeText(v)).filter((v) => v.length > 0);

export const sanitizeQuestions = (questions: CareerQuestion[]) =>
  questions.map((q) => {
    const sanitized: CareerQuestion = {
      ...q,
      text: sanitizeText(q.text),
    };

    if (q.options && q.options.length > 0) {
      sanitized.options = sanitizeTextList(q.options);
    } else {
      // Ensure we don't store `options: undefined` in nested objects
      delete (sanitized as any).options;
    }

    return sanitized;
  });

export const validateResumeFile = (file: File): { valid: boolean; error?: string } => {
  // Keep validation extremely permissive on type to avoid browser-specific MIME issues.
  // We only enforce a size cap; the label clearly asks for PDF.
  const sizeMB = getFileSizeMB(file);
  if (sizeMB > MAX_RESUME_SIZE_MB) {
    return { valid: false, error: `Resume must be under ${MAX_RESUME_SIZE_MB}MB.` };
  }
  return { valid: true };
};

export const validateJDFile = (file: File): { valid: boolean; error?: string } => {
  const accepted = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (!accepted.includes(file.type)) {
    return { valid: false, error: 'JD file must be PDF, DOC, or DOCX.' };
  }
  const sizeMB = getFileSizeMB(file);
  if (sizeMB > MAX_JD_SIZE_MB) {
    return { valid: false, error: `JD file must be under ${MAX_JD_SIZE_MB}MB.` };
  }
  return { valid: true };
};

const formatAnswer = (answer: CareerApplicationAnswer) => {
  if (Array.isArray(answer.value)) {
    return answer.value.join(', ');
  }
  if (typeof answer.value === 'boolean') {
    return answer.value ? 'Yes' : 'No';
  }
  return answer.value || 'N/A';
};

const formatAnswersForEmail = (answers: CareerApplicationAnswer[]) =>
  answers.map((a) => `- ${a.question}: ${formatAnswer(a)}`).join('\n');

export const sendApplicationEmails = async (application: CareerApplication): Promise<void> => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const hrTemplateId = import.meta.env.VITE_EMAILJS_CAREERS_HR_TEMPLATE_ID;
  const candidateTemplateId = import.meta.env.VITE_EMAILJS_CAREERS_CANDIDATE_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Only HR forwarding is strictly required. Candidate auto-response is optional.
  if (!serviceId || !hrTemplateId || !publicKey) {
    throw new Error('Careers email service is not configured.');
  }

  const commonParams = {
    job_title: application.jobTitle,
    candidate_name: application.fullName,
    candidate_email: application.email,
    candidate_phone: application.phone,
    candidate_location: application.location || 'N/A',
    notice_period: application.noticePeriod || 'N/A',
    linkedin_url: application.linkedinUrl || 'N/A',
    github_url: application.githubUrl || 'N/A',
    portfolio_url: application.portfolioUrl || 'N/A',
    resume_url: application.resumeUrl,
    questionnaire_answers: formatAnswersForEmail(application.answers),
  };

  await emailjs.send(
    serviceId,
    hrTemplateId,
    {
      ...commonParams,
      to_email: 'hr@plustech.co.in',
      subject: `New Application: ${application.jobTitle} - ${application.fullName}`,
    },
    { publicKey }
  );

  // Optional: send confirmation email to candidate if a template is configured
  if (candidateTemplateId) {
    await emailjs.send(
      serviceId,
      candidateTemplateId,
      {
        ...commonParams,
        to_email: application.email,
        subject: "We've received your application - PLUSTECH",
        timeline: 'We typically respond within 5-7 business days.',
      },
      { publicKey }
    );
  }
};

