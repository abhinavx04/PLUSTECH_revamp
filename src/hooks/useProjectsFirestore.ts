import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { deleteImageFromStorage } from '../lib/storageUtils';

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category?: string;
  featuredImageUrl?: string;
  youtubeVideoId?: string;
  year?: string;
  location?: string;
  technologies?: string[];
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectData {
  title: string;
  shortDescription: string;
  description: string;
  category?: string;
  featuredImageUrl?: string;
  youtubeVideoId?: string;
  year?: string;
  location?: string;
  technologies?: string[];
  status: 'draft' | 'published';
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id: string;
}

const COLLECTION_NAME = 'projects';

// Firestore does not allow fields with value `undefined`. This helper removes them.
const sanitizeForFirestore = <T extends Record<string, any>>(data: T): Record<string, any> => {
  const cleaned: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const useProjectsFirestore = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      if (!db) {
        setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const projectsCollection = collection(db, COLLECTION_NAME);
        let querySnapshot;

        try {
          const q = query(projectsCollection, orderBy('createdAt', 'desc'));
          querySnapshot = await getDocs(q);
        } catch (indexError: any) {
          if (indexError?.code === 'failed-precondition') {
            querySnapshot = await getDocs(projectsCollection);
          } else {
            throw indexError;
          }
        }

        const projectData: Project[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          projectData.push({
            id: docSnap.id,
            title: data.title || '',
            shortDescription: data.shortDescription || '',
            description: data.description || '',
            category: data.category,
            featuredImageUrl: data.featuredImageUrl,
            youtubeVideoId: data.youtubeVideoId,
            year: data.year,
            location: data.location,
            technologies: data.technologies || [],
            status: data.status || 'draft',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });

        // Ensure consistent ordering by createdAt if orderBy fallback was used
        projectData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setProjects(projectData);
      } catch (err: any) {
        console.error('[Projects] Error loading projects:', err);
        const code = err?.code || 'unknown';
        setError(
          code === 'permission-denied'
            ? 'Firestore permission denied. Update security rules to allow access to "projects" collection.'
            : `Failed to load projects. Error code: ${code}. Check console for details.`
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const createProject = async (projectData: CreateProjectData): Promise<string> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      const projectsCollection = collection(db, COLLECTION_NAME);
      const now = Timestamp.now();
      const payload = sanitizeForFirestore({
        ...projectData,
        createdAt: now,
        updatedAt: now,
      });
      const docRef = await addDoc(projectsCollection, payload);

      const newProject: Project = {
        id: docRef.id,
        ...projectData,
        technologies: projectData.technologies || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProjects((prev) => [newProject, ...prev]);

      return docRef.id;
    } catch (err: any) {
      console.error('[Projects] Error creating project:', err);
      const code = err?.code || 'unknown';
      setError(
        code === 'permission-denied'
          ? 'Firestore permission denied. Update security rules to allow write access to "projects" collection.'
          : `Failed to create project. Error code: ${code}.`
      );
      throw err;
    }
  };

  const updateProject = async (projectData: UpdateProjectData): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      const { id, ...updateData } = projectData;
      const projectDoc = doc(db, COLLECTION_NAME, id);

      // Delete old image if replaced
      const currentDoc = await getDoc(projectDoc);
      if (currentDoc.exists()) {
        const currentData = currentDoc.data();
        const oldImageUrl = currentData?.featuredImageUrl;
        const newImageUrl = updateData.featuredImageUrl;
        if (oldImageUrl && newImageUrl && oldImageUrl !== newImageUrl) {
          await deleteImageFromStorage(oldImageUrl, ['projects/images/', 'news/images/']);
        }
      }

      const payload = sanitizeForFirestore({
        ...updateData,
        updatedAt: Timestamp.now(),
      });
      await updateDoc(projectDoc, payload);

      setProjects((prev) =>
        prev.map((project) =>
          project.id === id
            ? {
                ...project,
                ...updateData,
                technologies: updateData.technologies || project.technologies,
                updatedAt: new Date(),
              }
            : project
        )
      );
    } catch (err: any) {
      console.error('[Projects] Error updating project:', err);
      const code = err?.code || 'unknown';
      setError(
        code === 'permission-denied'
          ? 'Firestore permission denied. Update security rules to allow write access to "projects" collection.'
          : `Failed to update project. Error code: ${code}.`
      );
      throw err;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      throw new Error('Firestore not available');
    }

    try {
      setError(null);
      const projectDoc = doc(db, COLLECTION_NAME, id);
      const docSnapshot = await getDoc(projectDoc);

      if (docSnapshot.exists()) {
        const projectData = docSnapshot.data();
        if (projectData?.featuredImageUrl) {
          await deleteImageFromStorage(projectData.featuredImageUrl, ['projects/images/', 'news/images/']);
        }
      }

      await deleteDoc(projectDoc);
      setProjects((prev) => prev.filter((project) => project.id !== id));
    } catch (err: any) {
      console.error('[Projects] Error deleting project:', err);
      const code = err?.code || 'unknown';
      setError(
        code === 'permission-denied'
          ? 'Firestore permission denied. Update security rules to allow delete access to "projects" collection.'
          : `Failed to delete project. Error code: ${code}.`
      );
      throw err;
    }
  };

  const getPublishedProjects = useCallback(
    () => projects.filter((project) => project.status === 'published'),
    [projects]
  );

  const getProjectById = useCallback(
    (id: string) => projects.find((project) => project.id === id),
    [projects]
  );

  const fetchProjectById = useCallback(async (id: string): Promise<Project | null> => {
    if (!db) {
      setError('Firestore not configured (check VITE_FIREBASE_* env vars)');
      return null;
    }

    try {
      const projectDoc = doc(db, COLLECTION_NAME, id);
      const docSnapshot = await getDoc(projectDoc);
      if (!docSnapshot.exists()) return null;

      const data = docSnapshot.data();
      const project: Project = {
        id: docSnapshot.id,
        title: data.title || '',
        shortDescription: data.shortDescription || '',
        description: data.description || '',
        category: data.category,
        featuredImageUrl: data.featuredImageUrl,
        youtubeVideoId: data.youtubeVideoId,
        year: data.year,
        location: data.location,
        technologies: data.technologies || [],
        status: data.status || 'draft',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };

      // Merge into state for reuse
      setProjects((prev) => {
        const exists = prev.some((p) => p.id === id);
        return exists
          ? prev.map((p) => (p.id === id ? project : p))
          : [...prev, project].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      });

      return project;
    } catch (err) {
      console.error('[Projects] Error fetching project by id:', err);
      return null;
    }
  }, [projects]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    getPublishedProjects,
    getProjectById,
    fetchProjectById,
  };
};

