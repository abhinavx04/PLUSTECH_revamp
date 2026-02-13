import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import type {
  ApplicationStatus,
  CareerApplication,
  CareerQuestion,
  CareerJob,
  CreateCareerApplicationData,
  CreateCareerJobData,
  JobStatus,
  UpdateCareerJobData,
} from '../lib/careersTypes';
import {
  sanitizeOptionalText,
  sanitizeQuestions,
  sanitizeText,
  sanitizeTextList,
  sendApplicationEmails,
} from '../lib/careersUtils';

const JOBS_COLLECTION = 'careersJobs';
const APPLICATIONS_COLLECTION = 'careersApplications';
const QUESTIONNAIRES_COLLECTION = 'careersQuestionnaires';
const BASE_QUESTIONNAIRE_DOC_ID = 'default';

const DEFAULT_BASE_QUESTIONS: CareerQuestion[] = [
  {
    id: 'base-intro',
    text: 'Briefly introduce yourself and your recent work.',
    type: 'short_text',
    required: true,
    source: 'base',
    enabled: true,
  },
  {
    id: 'base-availability',
    text: 'Are you available for interviews in the next two weeks?',
    type: 'yes_no',
    required: true,
    source: 'base',
    enabled: true,
  },
  {
    id: 'base-tools',
    text: 'Which tools or technologies are you strongest with?',
    type: 'short_text',
    required: true,
    source: 'base',
    enabled: true,
  },
];

const toDate = (value: unknown): Date => {
  if (value && typeof value === 'object' && 'toDate' in (value as { toDate?: unknown })) {
    const maybeDate = (value as { toDate: () => Date }).toDate();
    return maybeDate instanceof Date ? maybeDate : new Date();
  }
  return new Date();
};

const mapJob = (id: string, data: Record<string, any>): CareerJob => ({
  id,
  title: data.title || '',
  department: data.department || '',
  location: data.location || '',
  locationType: data.locationType || 'On-site',
  employmentType: data.employmentType || 'Full-time',
  experienceRange: data.experienceRange || '',
  overview: data.overview || '',
  responsibilities: data.responsibilities || [],
  mustHave: data.mustHave || [],
  niceToHave: data.niceToHave || [],
  successMetrics: data.successMetrics || [],
  jdFileUrl: data.jdFileUrl,
  jdFileName: data.jdFileName,
  status: data.status || 'draft',
  questionnaire: data.questionnaire || [],
  applicationsCount: Number(data.applicationsCount || 0),
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
});

const mapApplication = (id: string, data: Record<string, any>): CareerApplication => ({
  id,
  jobId: data.jobId || '',
  jobTitle: data.jobTitle || '',
  fullName: data.fullName || '',
  email: data.email || '',
  phone: data.phone || '',
  resumeUrl: data.resumeUrl || '',
  resumeFileName: data.resumeFileName || '',
  linkedinUrl: data.linkedinUrl,
  githubUrl: data.githubUrl,
  portfolioUrl: data.portfolioUrl,
  location: data.location,
  noticePeriod: data.noticePeriod,
  status: data.status || 'new',
  adminNotes: data.adminNotes || '',
  answers: data.answers || [],
  createdAt: toDate(data.createdAt),
  updatedAt: toDate(data.updatedAt),
});

// Firestore does not allow fields with value `undefined`.
// This helper removes them before writes.
const sanitizeForFirestore = <T extends Record<string, any>>(data: T): Record<string, any> => {
  const cleaned: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

interface UseCareersFirestoreOptions {
  admin?: boolean;
}

export const useCareersFirestore = (options: UseCareersFirestoreOptions = {}) => {
  const isAdminMode = options.admin ?? false;
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [baseQuestions, setBaseQuestions] = useState<CareerQuestion[]>(DEFAULT_BASE_QUESTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const jobsPromise = isAdminMode
        ? getDocs(query(collection(db, JOBS_COLLECTION), orderBy('updatedAt', 'desc')))
        : getDocs(
            query(
              collection(db, JOBS_COLLECTION),
              where('status', '==', 'published'),
              orderBy('updatedAt', 'desc')
            )
          );
      const applicationsPromise = isAdminMode
        ? getDocs(query(collection(db, APPLICATIONS_COLLECTION), orderBy('createdAt', 'desc')))
        : Promise.resolve(null);
      const baseDocPromise = getDoc(doc(db, QUESTIONNAIRES_COLLECTION, BASE_QUESTIONNAIRE_DOC_ID));

      const [jobsSnapshot, applicationsSnapshot, baseDoc] = await Promise.all([
        jobsPromise,
        applicationsPromise,
        baseDocPromise,
      ]);

      const nextJobs = jobsSnapshot.docs.map((d) => mapJob(d.id, d.data()));
      const nextApplications = applicationsSnapshot?.docs
        ? applicationsSnapshot.docs.map((d) => mapApplication(d.id, d.data()))
        : [];
      const nextBaseQuestions =
        baseDoc.exists() && Array.isArray(baseDoc.data()?.questions)
          ? (baseDoc.data().questions as CareerQuestion[])
          : DEFAULT_BASE_QUESTIONS;

      setJobs(nextJobs);
      if (isAdminMode) {
        setApplications(nextApplications);
      }
      setBaseQuestions(nextBaseQuestions);
    } catch (err: any) {
      console.error('[Careers] loadAll failed', err);
      setError(err?.message || 'Failed to load careers data.');
    } finally {
      setLoading(false);
    }
  }, [isAdminMode]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const getPublicJobs = useMemo(
    () => jobs.filter((j) => j.status === 'published').sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()),
    [jobs]
  );

  const createJob = async (jobData: CreateCareerJobData) => {
    if (!db) throw new Error('Firestore not available');
    const now = Timestamp.now();
    const rawPayload = {
      ...jobData,
      title: sanitizeText(jobData.title),
      department: sanitizeText(jobData.department),
      location: sanitizeText(jobData.location),
      experienceRange: sanitizeOptionalText(jobData.experienceRange),
      overview: sanitizeText(jobData.overview),
      responsibilities: sanitizeTextList(jobData.responsibilities),
      mustHave: sanitizeTextList(jobData.mustHave),
      niceToHave: sanitizeTextList(jobData.niceToHave),
      successMetrics: sanitizeTextList(jobData.successMetrics),
      questionnaire: sanitizeQuestions(jobData.questionnaire),
      applicationsCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    const payload = sanitizeForFirestore(rawPayload);

    const docRef = await addDoc(collection(db, JOBS_COLLECTION), payload);
    setJobs((prev) => [mapJob(docRef.id, payload), ...prev]);
    return docRef.id;
  };

  const updateJob = async (jobData: UpdateCareerJobData) => {
    if (!db) throw new Error('Firestore not available');
    const { id, ...rest } = jobData;
    const payload = {
      ...rest,
      ...(rest.title ? { title: sanitizeText(rest.title) } : {}),
      ...(rest.department ? { department: sanitizeText(rest.department) } : {}),
      ...(rest.location ? { location: sanitizeText(rest.location) } : {}),
      ...(rest.overview ? { overview: sanitizeText(rest.overview) } : {}),
      ...(rest.experienceRange !== undefined ? { experienceRange: sanitizeOptionalText(rest.experienceRange) } : {}),
      ...(rest.responsibilities ? { responsibilities: sanitizeTextList(rest.responsibilities) } : {}),
      ...(rest.mustHave ? { mustHave: sanitizeTextList(rest.mustHave) } : {}),
      ...(rest.niceToHave ? { niceToHave: sanitizeTextList(rest.niceToHave) } : {}),
      ...(rest.successMetrics ? { successMetrics: sanitizeTextList(rest.successMetrics) } : {}),
      ...(rest.questionnaire ? { questionnaire: sanitizeQuestions(rest.questionnaire) } : {}),
      updatedAt: Timestamp.now(),
    };
    await updateDoc(doc(db, JOBS_COLLECTION, id), payload);
    await loadAll();
  };

  const updateJobStatus = async (jobId: string, status: JobStatus) => {
    if (!db) throw new Error('Firestore not available');
    await updateDoc(doc(db, JOBS_COLLECTION, jobId), {
      status,
      updatedAt: Timestamp.now(),
    });
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status, updatedAt: new Date() } : job))
    );
  };

  const duplicateJob = async (jobId: string) => {
    const source = jobs.find((j) => j.id === jobId);
    if (!source) throw new Error('Job not found');

    return createJob({
      title: `${source.title} (Copy)`,
      department: source.department,
      location: source.location,
      locationType: source.locationType,
      employmentType: source.employmentType,
      experienceRange: source.experienceRange,
      overview: source.overview,
      responsibilities: source.responsibilities,
      mustHave: source.mustHave,
      niceToHave: source.niceToHave,
      successMetrics: source.successMetrics,
      jdFileUrl: source.jdFileUrl,
      jdFileName: source.jdFileName,
      status: 'draft',
      questionnaire: source.questionnaire,
    });
  };

  const deleteJob = async (jobId: string) => {
    if (!db) throw new Error('Firestore not available');

    try {
      setError(null);

      const jobRef = doc(db, JOBS_COLLECTION, jobId);
      const jobSnap = await getDoc(jobRef);

      // Delete JD file from Storage if present
      if (jobSnap.exists()) {
        const jobData = jobSnap.data();
        const jdUrl: string | undefined = jobData?.jdFileUrl;
        if (storage && jdUrl) {
          try {
            await deleteObject(ref(storage, jdUrl));
          } catch (storageErr) {
            console.warn('[Careers] Failed to delete JD from storage, continuing', storageErr);
          }
        }
      }

      // Delete related applications and their resumes
      const appsQuery = query(
        collection(db, APPLICATIONS_COLLECTION),
        where('jobId', '==', jobId)
      );
      const appsSnap = await getDocs(appsQuery);

      for (const appDoc of appsSnap.docs) {
        const appData = appDoc.data();
        const resumeUrl: string | undefined = appData?.resumeUrl;

        if (storage && resumeUrl) {
          try {
            await deleteObject(ref(storage, resumeUrl));
          } catch (storageErr) {
            console.warn('[Careers] Failed to delete resume from storage, continuing', storageErr);
          }
        }

        await deleteDoc(appDoc.ref);
      }

      // Delete the job document itself
      await deleteDoc(jobRef);

      // Update local state
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      setApplications((prev) => prev.filter((app) => app.jobId !== jobId));
    } catch (err: any) {
      console.error('[Careers] Error deleting job and related data', err);
      setError(err?.message || 'Failed to delete job and related applications.');
      throw err;
    }
  };

  const uploadJDFile = async (jobId: string, file: File): Promise<{ jdFileUrl: string; jdFileName: string }> => {
    if (!storage || !db) throw new Error('Storage or Firestore not available');
    const storagePath = `careers/jd/${jobId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    const jdFileUrl = await getDownloadURL(storageRef);
    const jdFileName = file.name;
    await updateJob({ id: jobId, jdFileUrl, jdFileName });
    return { jdFileUrl, jdFileName };
  };

  const removeJDFile = async (jobId: string, jdFileUrl?: string) => {
    if (!db) throw new Error('Firestore not available');
    if (storage && jdFileUrl) {
      try {
        await deleteObject(ref(storage, jdFileUrl));
      } catch (err) {
        console.warn('[Careers] JD delete skipped', err);
      }
    }
    await updateJob({ id: jobId, jdFileUrl: '', jdFileName: '' });
  };

  const uploadResume = async (jobId: string, file: File): Promise<{ resumeUrl: string; resumeFileName: string }> => {
    if (!storage) throw new Error('Storage not available');
    const storagePath = `careers/resumes/${jobId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    const resumeUrl = await getDownloadURL(storageRef);
    return { resumeUrl, resumeFileName: file.name };
  };

  const createApplication = async (applicationData: CreateCareerApplicationData): Promise<{ id: string; emailFailed: boolean }> => {
    if (!db) throw new Error('Firestore not available');

    const now = Timestamp.now();
    const rawPayload = {
      ...applicationData,
      fullName: sanitizeText(applicationData.fullName),
      email: sanitizeText(applicationData.email),
      phone: sanitizeText(applicationData.phone),
      linkedinUrl: sanitizeOptionalText(applicationData.linkedinUrl),
      githubUrl: sanitizeOptionalText(applicationData.githubUrl),
      portfolioUrl: sanitizeOptionalText(applicationData.portfolioUrl),
      location: sanitizeOptionalText(applicationData.location),
      noticePeriod: sanitizeOptionalText(applicationData.noticePeriod),
      status: 'new' as ApplicationStatus,
      adminNotes: '',
      createdAt: now,
      updatedAt: now,
    };
    const payload = sanitizeForFirestore(rawPayload);

    const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), payload);
    await updateDoc(doc(db, JOBS_COLLECTION, applicationData.jobId), {
      applicationsCount: increment(1),
      updatedAt: Timestamp.now(),
    });

    const applicationForEmail: CareerApplication = mapApplication(docRef.id, payload);

    let emailFailed = false;
    try {
      await sendApplicationEmails(applicationForEmail);
    } catch (emailError) {
      emailFailed = true;
      console.error('[Careers] Email sending failed after persistence', emailError);
    }

    await loadAll();
    return { id: docRef.id, emailFailed };
  };

  const updateApplicationStatus = async (applicationId: string, status: ApplicationStatus) => {
    if (!db) throw new Error('Firestore not available');
    await updateDoc(doc(db, APPLICATIONS_COLLECTION, applicationId), {
      status,
      updatedAt: Timestamp.now(),
    });
    setApplications((prev) =>
      prev.map((application) =>
        application.id === applicationId ? { ...application, status, updatedAt: new Date() } : application
      )
    );
  };

  const updateApplicationNotes = async (applicationId: string, notes: string) => {
    if (!db) throw new Error('Firestore not available');
    await updateDoc(doc(db, APPLICATIONS_COLLECTION, applicationId), {
      adminNotes: sanitizeText(notes),
      updatedAt: Timestamp.now(),
    });
    setApplications((prev) =>
      prev.map((application) =>
        application.id === applicationId
          ? { ...application, adminNotes: notes, updatedAt: new Date() }
          : application
      )
    );
  };

  const deleteApplication = async (applicationId: string) => {
    if (!db) throw new Error('Firestore not available');

    try {
      setError(null);

      const appRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
      const appSnap = await getDoc(appRef);

      if (!appSnap.exists()) {
        return;
      }

      const appData = appSnap.data();
      const resumeUrl: string | undefined = appData?.resumeUrl;
      const jobId: string | undefined = appData?.jobId;

      // Best-effort delete of resume file from Storage
      if (storage && resumeUrl) {
        try {
          await deleteObject(ref(storage, resumeUrl));
        } catch (storageErr) {
          console.warn('[Careers] Failed to delete resume from storage, continuing', storageErr);
        }
      }

      // Decrement applicationsCount on the related job if we know the jobId
      if (jobId) {
        try {
          await updateDoc(doc(db, JOBS_COLLECTION, jobId), {
            applicationsCount: increment(-1),
            updatedAt: Timestamp.now(),
          });
        } catch (jobErr) {
          console.warn('[Careers] Failed to update job applicationsCount after deleting application', jobErr);
        }
      }

      // Delete the application document itself
      await deleteDoc(appRef);

      // Update local state
      setApplications((prev) => prev.filter((application) => application.id !== applicationId));
      if (jobId) {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  applicationsCount: Math.max(0, (job.applicationsCount || 0) - 1),
                  updatedAt: new Date(),
                }
              : job
          )
        );
      }
    } catch (err: any) {
      console.error('[Careers] Error deleting application', err);
      setError(err?.message || 'Failed to delete application.');
      throw err;
    }
  };

  const saveBaseQuestionnaire = async (questions: CareerQuestion[]) => {
    if (!db) throw new Error('Firestore not available');
    const payload = {
      questions: sanitizeQuestions(questions),
      updatedAt: Timestamp.now(),
    };
    const baseRef = doc(db, QUESTIONNAIRES_COLLECTION, BASE_QUESTIONNAIRE_DOC_ID);
    const baseDoc = await getDoc(baseRef);
    if (baseDoc.exists()) {
      await updateDoc(baseRef, payload);
    } else {
      await setDoc(baseRef, {
        ...payload,
        createdAt: Timestamp.now(),
      });
    }
    setBaseQuestions(questions);
  };

  const canApplyToJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    return Boolean(job && job.status === 'published');
  };

  return {
    jobs,
    applications,
    baseQuestions,
    publicJobs: getPublicJobs,
    loading,
    error,
    reload: loadAll,
    createJob,
    updateJob,
    updateJobStatus,
    duplicateJob,
    deleteJob,
    uploadJDFile,
    removeJDFile,
    uploadResume,
    createApplication,
    updateApplicationStatus,
    updateApplicationNotes,
    deleteApplication,
    saveBaseQuestionnaire,
    canApplyToJob,
  };
};

