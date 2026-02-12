import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import { PageLayout } from '../components/PageLayout';
import { SEO } from '../components/SEO';
import { useCareersFirestore } from '../hooks/useCareersFirestore';
import { MAX_RESUME_SIZE_MB, validateResumeFile } from '../lib/careersUtils';
import type { CareerQuestion } from '../lib/careersTypes';

type Step = 1 | 2 | 3;

const SUBMIT_THROTTLE_MS = 30_000;

const CareerApplyPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { publicJobs, uploadResume, createApplication, loading } = useCareersFirestore();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean | string[]>>({});
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    location: '',
    noticePeriod: '',
  });

  const job = useMemo(() => publicJobs.find((j) => j.id === jobId), [publicJobs, jobId]);
  const visibleQuestions = useMemo(
    () => (job?.questionnaire || []).filter((q) => q.enabled !== false).slice(0, 10),
    [job]
  );

  const updateForm = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateAnswer = (question: CareerQuestion, value: string | boolean | string[]) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const validateCurrentStep = (currentStep: Step): boolean => {
    // Step 1: basic info + resume
    if (currentStep === 1) {
      if (!form.fullName || !form.email || !form.phone || !resumeFile) {
        setFormError('Please complete name, email, phone, and upload your resume.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        setFormError('Please enter a valid email address.');
        return false;
      }
      const resumeValidation = validateResumeFile(resumeFile);
      if (!resumeValidation.valid) {
        setFormError(resumeValidation.error || 'Invalid resume file.');
        return false;
      }
    }

    setFormError(null);
    return true;
  };

  const validateQuestionnaire = (): boolean => {
    if (visibleQuestions.length === 0) {
      return true;
    }

    const missingRequired = visibleQuestions.some((q) => {
      if (!q.required) return false;
      const value = answers[q.id];
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'boolean') return false;
      return !value;
    });

    if (missingRequired) {
      setFormError('Please answer all required questionnaire fields.');
      return false;
    }

    setFormError(null);
    return true;
  };

  const nextStep = () => {
    const next = Math.min(3, step + 1) as Step;
    if (!validateCurrentStep(step)) return;
    setStep(next);
  };

  const previousStep = () => {
    const prev = Math.max(1, step - 1) as Step;
    setStep(prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !jobId || !resumeFile) return;
    // Validate step 1 again (in case user jumped back) and questionnaire
    if (!validateCurrentStep(1)) return;
    if (!validateQuestionnaire()) return;

    const now = Date.now();
    const lastSubmit = Number(localStorage.getItem(`careers_submit_${jobId}`) || '0');
    if (now - lastSubmit < SUBMIT_THROTTLE_MS) {
      setFormError('Please wait a few seconds before submitting again.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    try {
      const resumeValidation = validateResumeFile(resumeFile);
      if (!resumeValidation.valid) {
        throw new Error(resumeValidation.error || 'Invalid resume file.');
      }

      const { resumeUrl, resumeFileName } = await uploadResume(job.id, resumeFile);

      const parsedAnswers = visibleQuestions.map((q) => ({
        questionId: q.id,
        question: q.text,
        type: q.type,
        value: answers[q.id] ?? (q.type === 'multi_select' ? [] : ''),
      }));

      const result = await createApplication({
        jobId: job.id,
        jobTitle: job.title,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        resumeUrl,
        resumeFileName,
        linkedinUrl: form.linkedinUrl,
        githubUrl: form.githubUrl,
        portfolioUrl: form.portfolioUrl,
        location: form.location,
        noticePeriod: form.noticePeriod,
        answers: parsedAnswers,
      });

      localStorage.setItem(`careers_submit_${jobId}`, String(Date.now()));
      setSuccessMessage(
        result.emailFailed
          ? "Your application was submitted successfully. We'll reach out soon."
          : 'Application submitted. A confirmation email has been sent.'
      );
      setStep(1);
      setForm({
        fullName: '',
        email: '',
        phone: '',
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        location: '',
        noticePeriod: '',
      });
      setAnswers({});
      setResumeFile(null);
    } catch (err: any) {
      console.error('[Careers] application submit failed', err);
      setFormError(err?.message || 'Unable to submit application right now.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !job) {
    return (
      <PageLayout className="bg-gradient-to-b from-white via-blue-50/30 to-white text-[#0f172a] pt-16">
        <main className="max-w-4xl mx-auto px-6 py-20">Loading...</main>
      </PageLayout>
    );
  }

  if (!job) {
    return (
      <PageLayout className="bg-gradient-to-b from-white via-blue-50/30 to-white text-[#0f172a] pt-16">
        <main className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-3xl font-bold text-[#0f172a]">Job not found</h1>
          <p className="mt-3 text-slate-700">This role is not available for applications right now.</p>
          <Link
            to="/careers"
            className="inline-flex items-center mt-6 px-5 py-2.5 rounded-lg bg-[#00aeef] text-black font-semibold"
          >
            Back to Careers
          </Link>
        </main>
      </PageLayout>
    );
  }

  return (
    <>
      <SEO
        title={`Apply for ${job.title} - PLUSTECH Careers`}
        description={`Submit your application for ${job.title} at PLUSTECH.`}
        url={`/careers/apply/${job.id}`}
      />
      <PageLayout className="bg-gradient-to-b from-white via-blue-50/30 to-white text-[#0f172a] pt-16">
        <main className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">Applying for</div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] mt-1">{job.title}</h1>
              <div className="text-sm text-slate-700 mt-2">
                {job.employmentType} • {job.locationType} • {job.location}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-6">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`px-3 py-1 rounded-full border ${
                      step === s ? 'bg-[#00aeef] text-black border-[#00aeef]' : 'bg-white border-slate-300'
                    }`}
                  >
                    Step {s}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#0f172a]">Basic Info</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-2 text-sm font-semibold">
                        Full name*
                        <input
                          value={form.fullName}
                          onChange={(e) => updateForm('fullName', e.target.value)}
                          required
                          className="rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-semibold">
                        Email*
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => updateForm('email', e.target.value)}
                          required
                          className="rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-semibold">
                        Phone*
                        <input
                          value={form.phone}
                          onChange={(e) => updateForm('phone', e.target.value)}
                          required
                          className="rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-semibold">
                        Resume (PDF only, max {MAX_RESUME_SIZE_MB}MB)*
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          required
                          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                        />
                        {resumeFile ? <span className="text-xs text-slate-600">{resumeFile.name}</span> : null}
                      </label>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#0f172a]">Experience & Links</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-2 text-sm font-semibold">
                        LinkedIn
                        <input
                          value={form.linkedinUrl}
                          onChange={(e) => updateForm('linkedinUrl', e.target.value)}
                          className="rounded-xl border border-slate-200 px-3 py-2"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-semibold">
                        GitHub
                        <input
                          value={form.githubUrl}
                          onChange={(e) => updateForm('githubUrl', e.target.value)}
                          className="rounded-xl border border-slate-200 px-3 py-2"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-semibold">
                        Portfolio
                        <input
                          value={form.portfolioUrl}
                          onChange={(e) => updateForm('portfolioUrl', e.target.value)}
                          className="rounded-xl border border-slate-200 px-3 py-2"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-semibold">
                        Location
                        <input
                          value={form.location}
                          onChange={(e) => updateForm('location', e.target.value)}
                          className="rounded-xl border border-slate-200 px-3 py-2"
                        />
                      </label>
                    </div>
                    <label className="flex flex-col gap-2 text-sm font-semibold">
                      Notice period
                      <input
                        value={form.noticePeriod}
                        onChange={(e) => updateForm('noticePeriod', e.target.value)}
                        className="rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </label>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[#0f172a]">Questionnaire</h2>
                    {visibleQuestions.length === 0 ? (
                      <p className="text-sm text-slate-600">No additional questions for this role.</p>
                    ) : (
                      <div className="space-y-4">
                        {visibleQuestions.map((question) => (
                          <div key={question.id} className="rounded-xl border border-slate-200 p-4">
                            <label className="text-sm font-semibold text-[#0f172a] block mb-2">
                              {question.text} {question.required ? '*' : ''}
                            </label>
                            {question.type === 'short_text' && (
                              <input
                                value={(answers[question.id] as string) || ''}
                                onChange={(e) => updateAnswer(question, e.target.value)}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2"
                                required={question.required}
                              />
                            )}
                            {question.type === 'yes_no' && (
                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm">
                                  <input
                                    type="radio"
                                    name={question.id}
                                    checked={answers[question.id] === true}
                                    onChange={() => updateAnswer(question, true)}
                                  />
                                  Yes
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                  <input
                                    type="radio"
                                    name={question.id}
                                    checked={answers[question.id] === false}
                                    onChange={() => updateAnswer(question, false)}
                                  />
                                  No
                                </label>
                              </div>
                            )}
                            {question.type === 'multi_select' && (
                              <div className="space-y-2">
                                {(question.options || []).map((option) => {
                                  const selected = ((answers[question.id] as string[]) || []).includes(option);
                                  return (
                                    <label key={option} className="flex items-center gap-2 text-sm">
                                      <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={(e) => {
                                          const current = (answers[question.id] as string[]) || [];
                                          const next = e.target.checked
                                            ? [...current, option]
                                            : current.filter((v) => v !== option);
                                          updateAnswer(question, next);
                                        }}
                                      />
                                      {option}
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {formError && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                    {formError}
                  </div>
                )}
                {successMessage && (
                  <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                    {successMessage}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={previousStep}
                      className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-5 py-2.5 rounded-lg bg-[#00aeef] text-black font-semibold"
                    >
                      Continue
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-lg bg-[#00aeef] text-black font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate('/careers')}
                    className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </PageLayout>
    </>
  );
};

export default CareerApplyPage;

