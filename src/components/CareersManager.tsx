import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { useCareersFirestore } from '../hooks/useCareersFirestore';
import { validateJDFile } from '../lib/careersUtils';
import type {
  ApplicationStatus,
  CareerApplication,
  CareerQuestion,
  CreateCareerJobData,
  JobStatus,
  QuestionType,
} from '../lib/careersTypes';

type AdminTab = 'jobs' | 'applications';
type JobFormStep = 1 | 2 | 3 | 4;

const statusOptions: JobStatus[] = ['draft', 'published', 'closed', 'archived'];
const applicationStatusOptions: ApplicationStatus[] = ['new', 'shortlisted', 'rejected', 'hired'];

const toCsvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

const newQuestion = (source: 'base' | 'job'): CareerQuestion => ({
  id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  text: '',
  type: 'short_text',
  required: true,
  options: [],
  source,
  enabled: true,
});

const CareersManager: React.FC = () => {
  const {
    jobs,
    applications,
    baseQuestions,
    loading,
    error,
    createJob,
    updateJob,
    updateJobStatus,
    duplicateJob,
    uploadJDFile,
    removeJDFile,
    updateApplicationStatus,
    updateApplicationNotes,
    saveBaseQuestionnaire,
    deleteJob,
    deleteApplication,
  } = useCareersFirestore({ admin: true });

  const [activeTab, setActiveTab] = useState<AdminTab>('jobs');
  const [showArchived, setShowArchived] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobFormStep, setJobFormStep] = useState<JobFormStep>(1);
  const [jobFilterStatus, setJobFilterStatus] = useState<'all' | JobStatus>('all');
  const [applicationsStatusFilter, setApplicationsStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [applicationsJobFilter, setApplicationsJobFilter] = useState<'all' | string>('all');
  const [selectedApplication, setSelectedApplication] = useState<CareerApplication | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [newJobSpecificQuestion, setNewJobSpecificQuestion] = useState<CareerQuestion>(newQuestion('job'));
  const [localBaseQuestions, setLocalBaseQuestions] = useState<CareerQuestion[]>(baseQuestions);
  const [jdUploadFile, setJdUploadFile] = useState<File | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [jobForm, setJobForm] = useState<CreateCareerJobData>({
    title: '',
    department: '',
    location: '',
    locationType: 'On-site',
    employmentType: 'Full-time',
    experienceRange: '',
    overview: '',
    responsibilities: [''],
    mustHave: [''],
    niceToHave: [''],
    successMetrics: [''],
    status: 'draft',
    jdFileName: '',
    jdFileUrl: '',
    questionnaire: baseQuestions.map((q) => ({ ...q, enabled: true })),
  });

  useEffect(() => {
    setLocalBaseQuestions(baseQuestions);
  }, [baseQuestions]);

  const visibleJobs = useMemo(() => {
    return jobs
      .filter((job) => (showArchived ? true : job.status !== 'archived'))
      .filter((job) => (jobFilterStatus === 'all' ? true : job.status === jobFilterStatus));
  }, [jobs, showArchived, jobFilterStatus]);

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => (applicationsStatusFilter === 'all' ? true : app.status === applicationsStatusFilter))
      .filter((app) => (applicationsJobFilter === 'all' ? true : app.jobId === applicationsJobFilter));
  }, [applications, applicationsStatusFilter, applicationsJobFilter]);

  const resetForm = () => {
    setJobForm({
      title: '',
      department: '',
      location: '',
      locationType: 'On-site',
      employmentType: 'Full-time',
      experienceRange: '',
      overview: '',
      responsibilities: [''],
      mustHave: [''],
      niceToHave: [''],
      successMetrics: [''],
      status: 'draft',
      jdFileName: '',
      jdFileUrl: '',
      questionnaire: baseQuestions.map((q) => ({ ...q, enabled: true })),
    });
    setEditingJobId(null);
    setJobFormStep(1);
    setJdUploadFile(null);
    setShowForm(false);
  };

  const beginCreate = () => {
    setActionError(null);
    resetForm();
    setShowForm(true);
  };

  const beginEdit = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      locationType: job.locationType,
      employmentType: job.employmentType,
      experienceRange: job.experienceRange || '',
      overview: job.overview,
      responsibilities: job.responsibilities.length ? job.responsibilities : [''],
      mustHave: job.mustHave.length ? job.mustHave : [''],
      niceToHave: job.niceToHave.length ? job.niceToHave : [''],
      successMetrics: job.successMetrics.length ? job.successMetrics : [''],
      status: job.status,
      jdFileName: job.jdFileName || '',
      jdFileUrl: job.jdFileUrl || '',
      questionnaire: job.questionnaire || [],
    });
    setEditingJobId(job.id);
    setShowForm(true);
    setJobFormStep(1);
    setActionError(null);
    // Scroll to form after state updates
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const updateListItem = (field: 'responsibilities' | 'mustHave' | 'niceToHave' | 'successMetrics', index: number, value: string) => {
    setJobForm((prev) => {
      const next = [...prev[field]];
      next[index] = value;
      return { ...prev, [field]: next };
    });
  };

  const addListItem = (field: 'responsibilities' | 'mustHave' | 'niceToHave' | 'successMetrics') => {
    setJobForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (field: 'responsibilities' | 'mustHave' | 'niceToHave' | 'successMetrics', index: number) => {
    setJobForm((prev) => {
      const next = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: next.length ? next : [''] };
    });
  };

  const moveQuestion = (index: number, direction: -1 | 1) => {
    setJobForm((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.questionnaire.length) return prev;
      const next = [...prev.questionnaire];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return { ...prev, questionnaire: next };
    });
  };

  const saveJob = async () => {
    setSaving(true);
    setActionError(null);
    try {
      if (editingJobId) {
        await updateJob({ id: editingJobId, ...jobForm });
        if (jdUploadFile) {
          await uploadJDFile(editingJobId, jdUploadFile);
        }
      } else {
        const newId = await createJob(jobForm);
        if (jdUploadFile) {
          await uploadJDFile(newId, jdUploadFile);
        }
      }
      resetForm();
    } catch (err: any) {
      setActionError(err?.message || 'Unable to save job.');
    } finally {
      setSaving(false);
    }
  };

  const exportApplicationsCsv = () => {
    const rows = [
      ['Candidate Name', 'Job Title', 'Email', 'Phone', 'Status', 'Applied Date'],
      ...filteredApplications.map((a) => [
        a.fullName,
        a.jobTitle,
        a.email,
        a.phone,
        a.status,
        a.createdAt.toISOString(),
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => toCsvCell(cell)).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careers-applications-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-white">Careers Module</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'jobs' ? 'bg-[#00aeef] text-black' : 'bg-white/10 text-white'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'applications' ? 'bg-[#00aeef] text-black' : 'bg-white/10 text-white'
            }`}
          >
            Applications
          </button>
        </div>
      </div>

      {error && <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 text-red-100 text-sm">{error}</div>}
      {actionError && <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 text-red-100 text-sm">{actionError}</div>}

      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <select
                value={jobFilterStatus}
                onChange={(e) => setJobFilterStatus(e.target.value as 'all' | JobStatus)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={showArchived}
                  onChange={(e) => setShowArchived(e.target.checked)}
                />
                Show archived
              </label>
            </div>
            <button
              onClick={beginCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00aeef] text-black font-semibold"
            >
              <Plus className="w-4 h-4" /> New Job
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-white/10 text-gray-200">
                <tr>
                  <th className="text-left p-3">Job Title</th>
                  <th className="text-left p-3">Department</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Applications</th>
                  <th className="text-left p-3">Created</th>
                  <th className="text-left p-3">Updated</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleJobs.map((job) => (
                  <tr key={job.id} className="border-t border-white/10 text-white">
                    <td className="p-3 font-medium">{job.title}</td>
                    <td className="p-3">{job.department}</td>
                    <td className="p-3 capitalize">{job.status}</td>
                    <td className="p-3">{job.applicationsCount}</td>
                    <td className="p-3">{job.createdAt.toLocaleDateString()}</td>
                    <td className="p-3">{job.updatedAt.toLocaleDateString()}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => beginEdit(job.id)} className="px-2 py-1 bg-blue-600 rounded text-white text-xs">
                          Edit
                        </button>
                        <button
                          onClick={() => duplicateJob(job.id)}
                          className="px-2 py-1 bg-indigo-600 rounded text-white text-xs"
                        >
                          Duplicate
                        </button>
                        <button
                          onClick={() => updateJobStatus(job.id, job.status === 'published' ? 'draft' : 'published')}
                          className="px-2 py-1 bg-emerald-600 rounded text-white text-xs"
                        >
                          {job.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => updateJobStatus(job.id, 'closed')}
                          className="px-2 py-1 bg-amber-600 rounded text-black text-xs font-semibold"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => updateJobStatus(job.id, 'archived')}
                          className="px-2 py-1 bg-gray-700 rounded text-white text-xs"
                        >
                          Archive
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              !window.confirm(
                                'Delete this job and ALL of its applications and resumes? This cannot be undone.'
                              )
                            ) {
                              return;
                            }
                            setActionError(null);
                            setSaving(true);
                            try {
                              await deleteJob(job.id);
                            } catch (err: any) {
                              setActionError(err?.message || 'Failed to delete job.');
                            } finally {
                              setSaving(false);
                            }
                          }}
                          className="px-2 py-1 bg-red-700 rounded text-white text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showForm && (
            <div ref={formRef} className="bg-white/10 rounded-xl border border-white/20 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{editingJobId ? 'Edit Job' : 'Create Job'}</h3>
                <div className="text-sm text-gray-300">Step {jobFormStep} of 4</div>
              </div>

              {jobFormStep === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    value={jobForm.title}
                    onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Job title"
                  />
                  <input
                    value={jobForm.department}
                    onChange={(e) => setJobForm((p) => ({ ...p, department: e.target.value }))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Department"
                  />
                  <select
                    value={jobForm.locationType}
                    onChange={(e) => setJobForm((p) => ({ ...p, locationType: e.target.value as CreateCareerJobData['locationType'] }))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                  <input
                    value={jobForm.location}
                    onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Location"
                  />
                  <select
                    value={jobForm.employmentType}
                    onChange={(e) => setJobForm((p) => ({ ...p, employmentType: e.target.value as CreateCareerJobData['employmentType'] }))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                  <input
                    value={jobForm.experienceRange}
                    onChange={(e) => setJobForm((p) => ({ ...p, experienceRange: e.target.value }))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Experience range (e.g. 2-4 years)"
                  />
                </div>
              )}

              {jobFormStep === 2 && (
                <div className="space-y-4">
                  <textarea
                    value={jobForm.overview}
                    onChange={(e) => setJobForm((p) => ({ ...p, overview: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    placeholder="Role overview"
                  />
                  {(['responsibilities', 'mustHave', 'niceToHave', 'successMetrics'] as const).map((field) => (
                    <div key={field} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-white capitalize">{field}</div>
                        <button type="button" onClick={() => addListItem(field)} className="text-xs px-2 py-1 bg-[#00aeef] text-black rounded">
                          Add
                        </button>
                      </div>
                      {jobForm[field].map((item, index) => (
                        <div key={`${field}-${index}`} className="flex gap-2">
                          <input
                            value={item}
                            onChange={(e) => updateListItem(field, index, e.target.value)}
                            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          />
                          <button type="button" onClick={() => removeListItem(field, index)} className="px-2 py-1 bg-red-600 text-white rounded">
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {jobFormStep === 3 && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-300">Upload optional JD file (PDF, DOC, DOCX).</div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const validation = validateJDFile(file);
                      if (!validation.valid) {
                        setActionError(validation.error || 'Invalid JD file.');
                        return;
                      }
                      setJdUploadFile(file);
                      setActionError(null);
                    }}
                    className="text-sm text-white"
                  />
                  {jobForm.jdFileName ? <div className="text-sm text-white">Current: {jobForm.jdFileName}</div> : null}
                  {jdUploadFile ? <div className="text-sm text-white">New upload: {jdUploadFile.name}</div> : null}
                  {editingJobId && jobForm.jdFileUrl && (
                    <button
                      type="button"
                      onClick={() => removeJDFile(editingJobId, jobForm.jdFileUrl)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm"
                    >
                      Remove current JD
                    </button>
                  )}
                </div>
              )}

              {jobFormStep === 4 && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-200">
                    Base questionnaire template
                    <button
                      type="button"
                      onClick={() => setLocalBaseQuestions([...localBaseQuestions, newQuestion('base')])}
                      className="ml-3 px-2 py-1 bg-[#00aeef] text-black rounded text-xs"
                    >
                      Add base question
                    </button>
                  </div>
                  {localBaseQuestions.map((question, index) => (
                    <div key={question.id} className="rounded-lg border border-white/20 p-3 space-y-2">
                      <input
                        value={question.text}
                        onChange={(e) =>
                          setLocalBaseQuestions((prev) =>
                            prev.map((q, i) => (i === index ? { ...q, text: e.target.value } : q))
                          )
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                        placeholder="Question text"
                      />
                      <div className="flex gap-2">
                        <select
                          value={question.type}
                          onChange={(e) =>
                            setLocalBaseQuestions((prev) =>
                              prev.map((q, i) =>
                                i === index ? { ...q, type: e.target.value as QuestionType } : q
                              )
                            )
                          }
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                        >
                          <option value="short_text">Short text</option>
                          <option value="yes_no">Yes/No</option>
                          <option value="multi_select">Multi-select</option>
                        </select>
                        <label className="flex items-center gap-1 text-sm text-white">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) =>
                              setLocalBaseQuestions((prev) =>
                                prev.map((q, i) => (i === index ? { ...q, required: e.target.checked } : q))
                              )
                            }
                          />
                          Required
                        </label>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => saveBaseQuestionnaire(localBaseQuestions)}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm"
                  >
                    Save base template
                  </button>

                  <div className="border-t border-white/20 pt-4">
                    <div className="text-sm text-gray-200 mb-2">Per-job questionnaire</div>
                    <div className="space-y-2">
                      {jobForm.questionnaire.map((question, index) => (
                        <div key={question.id} className="rounded-lg border border-white/20 p-3 space-y-2">
                          <div className="flex gap-2">
                            <input
                              value={question.text}
                              onChange={(e) =>
                                setJobForm((prev) => ({
                                  ...prev,
                                  questionnaire: prev.questionnaire.map((q, i) =>
                                    i === index ? { ...q, text: e.target.value } : q
                                  ),
                                }))
                              }
                              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                            />
                            <button type="button" onClick={() => moveQuestion(index, -1)} className="px-2 py-1 bg-white/20 rounded text-white text-xs">
                              Up
                            </button>
                            <button type="button" onClick={() => moveQuestion(index, 1)} className="px-2 py-1 bg-white/20 rounded text-white text-xs">
                              Down
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setJobForm((prev) => ({
                                  ...prev,
                                  questionnaire: prev.questionnaire.filter((_, i) => i !== index),
                                }))
                              }
                              className="px-2 py-1 bg-red-600 rounded text-white text-xs"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <select
                              value={question.type}
                              onChange={(e) =>
                                setJobForm((prev) => ({
                                  ...prev,
                                  questionnaire: prev.questionnaire.map((q, i) =>
                                    i === index ? { ...q, type: e.target.value as QuestionType } : q
                                  ),
                                }))
                              }
                              className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                            >
                              <option value="short_text">Short text</option>
                              <option value="yes_no">Yes/No</option>
                              <option value="multi_select">Multi-select</option>
                            </select>
                            <label className="flex items-center gap-1 text-sm text-white">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) =>
                                  setJobForm((prev) => ({
                                    ...prev,
                                    questionnaire: prev.questionnaire.map((q, i) =>
                                      i === index ? { ...q, required: e.target.checked } : q
                                    ),
                                  }))
                                }
                              />
                              Required
                            </label>
                            <label className="flex items-center gap-1 text-sm text-white">
                              <input
                                type="checkbox"
                                checked={question.enabled !== false}
                                onChange={(e) =>
                                  setJobForm((prev) => ({
                                    ...prev,
                                    questionnaire: prev.questionnaire.map((q, i) =>
                                      i === index ? { ...q, enabled: e.target.checked } : q
                                    ),
                                  }))
                                }
                              />
                              Enabled
                            </label>
                          </div>
                          {question.type === 'multi_select' && (
                            <input
                              value={(question.options || []).join(', ')}
                              onChange={(e) =>
                                setJobForm((prev) => ({
                                  ...prev,
                                  questionnaire: prev.questionnaire.map((q, i) =>
                                    i === index
                                      ? {
                                          ...q,
                                          options: e.target.value
                                            .split(',')
                                            .map((v) => v.trim())
                                            .filter(Boolean),
                                        }
                                      : q
                                  ),
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                              placeholder="Option A, Option B"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-lg border border-dashed border-white/30 p-3 space-y-2">
                      <div className="text-sm text-gray-200">Add job-specific question</div>
                      <input
                        value={newJobSpecificQuestion.text}
                        onChange={(e) =>
                          setNewJobSpecificQuestion((prev) => ({ ...prev, text: e.target.value }))
                        }
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
                        placeholder="Question text"
                      />
                      <div className="flex gap-2">
                        <select
                          value={newJobSpecificQuestion.type}
                          onChange={(e) =>
                            setNewJobSpecificQuestion((prev) => ({
                              ...prev,
                              type: e.target.value as QuestionType,
                            }))
                          }
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white"
                        >
                          <option value="short_text">Short text</option>
                          <option value="yes_no">Yes/No</option>
                          <option value="multi_select">Multi-select</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            if (!newJobSpecificQuestion.text.trim()) return;
                            setJobForm((prev) => ({
                              ...prev,
                              questionnaire: [...prev.questionnaire, newJobSpecificQuestion],
                            }));
                            setNewJobSpecificQuestion(newQuestion('job'));
                          }}
                          className="px-3 py-1 bg-[#00aeef] text-black rounded text-sm font-semibold"
                        >
                          Add question
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {jobFormStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setJobFormStep((s) => (s - 1) as JobFormStep)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg"
                  >
                    Back
                  </button>
                )}
                {jobFormStep < 4 && (
                  <button
                    type="button"
                    onClick={() => setJobFormStep((s) => (s + 1) as JobFormStep)}
                    className="px-4 py-2 bg-[#00aeef] text-black rounded-lg font-semibold"
                  >
                    Next
                  </button>
                )}
                {jobFormStep === 4 && (
                  <button
                    type="button"
                    onClick={saveJob}
                    disabled={saving}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : editingJobId ? 'Update Job' : 'Create Job'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <select
                value={applicationsJobFilter}
                onChange={(e) => setApplicationsJobFilter(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="all">All jobs</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
              <select
                value={applicationsStatusFilter}
                onChange={(e) => setApplicationsStatusFilter(e.target.value as 'all' | ApplicationStatus)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="all">All statuses</option>
                {applicationStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={exportApplicationsCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00aeef] text-black font-semibold"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
            <div className="rounded-xl border border-white/20 bg-white/10 overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-white/10 text-gray-200">
                  <tr>
                    <th className="text-left p-3">Candidate</th>
                    <th className="text-left p-3">Job</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className={`border-t border-white/10 text-white cursor-pointer ${
                        selectedApplication?.id === app.id ? 'bg-[#00aeef]/20' : ''
                      }`}
                      onClick={() => setSelectedApplication(app)}
                    >
                      <td className="p-3">{app.fullName}</td>
                      <td className="p-3">{app.jobTitle}</td>
                      <td className="p-3">{app.email}</td>
                      <td className="p-3 capitalize">{app.status}</td>
                      <td className="p-3">{app.createdAt.toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/10 p-4">
              {!selectedApplication ? (
                <div className="text-gray-300 text-sm">Select an application to view details.</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedApplication.fullName}</h3>
                    <div className="text-sm text-gray-300">{selectedApplication.jobTitle}</div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-200">
                    <div>Email: {selectedApplication.email}</div>
                    <div>Phone: {selectedApplication.phone}</div>
                    {selectedApplication.location && <div>Location: {selectedApplication.location}</div>}
                    {selectedApplication.noticePeriod && <div>Notice period: {selectedApplication.noticePeriod}</div>}
                    <a href={selectedApplication.resumeUrl} target="_blank" rel="noreferrer" className="text-[#00aeef] underline">
                      Download resume ({selectedApplication.resumeFileName})
                    </a>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-white">Questionnaire answers</h4>
                    <div className="space-y-2 max-h-56 overflow-auto pr-1">
                      {selectedApplication.answers.map((answer) => (
                        <div key={answer.questionId} className="rounded-lg border border-white/20 p-2 text-sm text-gray-200">
                          <div className="font-medium text-white">{answer.question}</div>
                          <div>
                            {Array.isArray(answer.value)
                              ? answer.value.join(', ')
                              : typeof answer.value === 'boolean'
                              ? answer.value
                                ? 'Yes'
                                : 'No'
                              : answer.value || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Status</label>
                    <select
                      value={selectedApplication.status}
                      onChange={async (e) => {
                        const next = e.target.value as ApplicationStatus;
                        await updateApplicationStatus(selectedApplication.id, next);
                        setSelectedApplication((prev) => (prev ? { ...prev, status: next } : prev));
                      }}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      {applicationStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Internal notes</label>
                    <textarea
                      value={selectedApplication.adminNotes || ''}
                      onChange={(e) =>
                        setSelectedApplication((prev) => (prev ? { ...prev, adminNotes: e.target.value } : prev))
                      }
                      rows={4}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                    <button
                      onClick={async () => {
                        if (!selectedApplication) return;
                        await updateApplicationNotes(selectedApplication.id, selectedApplication.adminNotes || '');
                      }}
                      className="px-3 py-2 bg-[#00aeef] text-black rounded-lg text-sm font-semibold"
                    >
                      Save notes
                    </button>
                    <button
                      onClick={async () => {
                        if (!selectedApplication) return;
                        const confirmed = window.confirm(
                          'Delete this application and its resume from storage? This cannot be undone.'
                        );
                        if (!confirmed) return;
                        setActionError(null);
                        setSaving(true);
                        try {
                          await deleteApplication(selectedApplication.id);
                          setSelectedApplication(null);
                        } catch (err: any) {
                          setActionError(err?.message || 'Failed to delete application.');
                        } finally {
                          setSaving(false);
                        }
                      }}
                      className="mt-2 px-3 py-2 bg-red-700 text-white rounded-lg text-sm font-semibold"
                    >
                      Delete application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && <div className="text-sm text-gray-300">Loading careers data...</div>}
    </div>
  );
};

export default CareersManager;

