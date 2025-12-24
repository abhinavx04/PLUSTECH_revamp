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
  where,
  Timestamp,
  getDoc,
  Query,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { deleteImageFromStorage } from '../lib/storageUtils';

export const PROCESS_OPTIONS = [
  'Ovens and Forced Coolers',
  'Air Supply with and without Temperature and Humidity Control with BLDC Blowers',
  'Integration with Material Handling System',
  'Integration with Robotic & Auto Applicators',
  'Paint Circulation, Sealer & U/B Circulation Systems',
  'Energy Saving Equipment - Heat Pumps, RTO, Heat Recovery Systems',
  'Robotic Skids and C Hanger Cleaning',
  'Spray/Dip Pretreatment Plants with Accessories and Auxiliary Systems',
  'Electrodeposition Plants with Accessories and Auxiliary Systems',
  'Autophoretic Plants with Accessories and Auxiliary Systems',
  'Paintbooths with Circulation and Recirculation System - Wet Type/ Dry Type',
  'Paint Sludge Separation System (Common and Individual)',
] as const;

export const SURFACE_OPTIONS = [
  'Sheet-Metal',
  'ABS/PP',
  'Special Surfaces',
] as const;

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  category?: string;
  processes?: string[];
  surfaces?: string[];
  featuredImageUrl?: string; // Keep for backward compatibility
  imageUrls?: string[]; // New: array of image URLs
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
  processes?: string[];
  surfaces?: string[];
  featuredImageUrl?: string; // Keep for backward compatibility
  imageUrls?: string[]; // New: array of image URLs
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

// Shared query for published projects - matches Firestore security rules
// This ensures queries align with rules: resource.data.status == "published"
export const getPublishedProjectsQuery = (firestoreDb: typeof db): Query | null => {
  if (!firestoreDb) return null;
  
  const projectsCollection = collection(firestoreDb, COLLECTION_NAME);
  // CRITICAL: Filter by status to match security rules
  // Rules allow: resource.data.status == "published"
  // Query must use: where("status", "==", "published")
  return query(
    projectsCollection,
    where('status', '==', 'published'),
    orderBy('createdAt', 'desc')
  );
};

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

        console.log('[Projects] Loading projects from Firestore...');
        console.log('[Projects] Using query with status filter to match security rules');

        // Use shared query that filters by status to match security rules
        const publishedQuery = getPublishedProjectsQuery(db);
        
        if (!publishedQuery) {
          throw new Error('Firestore not available');
        }

        let querySnapshot;
        try {
          // Query with status filter - matches security rules: resource.data.status == "published"
          querySnapshot = await getDocs(publishedQuery);
          console.log('[Projects] Query executed successfully with status filter');
        } catch (indexError: any) {
          // If index doesn't exist for status + createdAt combination, try with status only
          if (indexError?.code === 'failed-precondition') {
            console.warn('[Projects] Composite index missing, trying status-only query');
            console.warn('[Projects] Error details:', indexError.message);
            
            // Fallback: query with status filter only (no orderBy)
            const statusOnlyQuery = query(
              collection(db, COLLECTION_NAME),
              where('status', '==', 'published')
            );
            querySnapshot = await getDocs(statusOnlyQuery);
            
            console.log('[Projects] Status-only query succeeded, will sort client-side');
          } else {
            throw indexError;
          }
        }

        console.log('[Projects] Loaded', querySnapshot.size, 'published documents');
        
        if (querySnapshot.empty) {
          console.warn('[Projects] No published documents found. Check that documents have status="published" (lowercase)');
        }

        const projectData: Project[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          
          // Validate status field exists and is correct
          const status = data.status || 'draft';
          if (status !== 'published') {
            console.warn(`[Projects] Document ${docSnap.id} has status "${status}", expected "published". Skipping.`);
            return; // Skip non-published documents (shouldn't happen with query filter, but safety check)
          }
          
          projectData.push({
            id: docSnap.id,
            title: data.title || '',
            shortDescription: data.shortDescription || '',
            description: data.description || '',
            category: data.category,
            processes: data.processes || [],
            surfaces: data.surfaces || [],
            featuredImageUrl: data.featuredImageUrl,
            imageUrls: data.imageUrls || (data.featuredImageUrl ? [data.featuredImageUrl] : []), // Support both old and new format
            youtubeVideoId: data.youtubeVideoId,
            year: data.year,
            location: data.location,
            technologies: data.technologies || [],
            status: status as 'published',
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });

        // Ensure consistent ordering by createdAt (if not already sorted by query)
        projectData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setProjects(projectData);
        console.log('[Projects] Processed', projectData.length, 'published projects');
      } catch (err: any) {
        console.error('[Projects] Error loading projects:', err);
        console.error('[Projects] Error code:', err?.code);
        console.error('[Projects] Error message:', err?.message);
        console.error('[Projects] Full error:', JSON.stringify(err, null, 2));
        
        const code = err?.code || 'unknown';
        let errorMsg = '';
        
        if (code === 'permission-denied') {
          errorMsg = 'Firestore permission denied. Query must filter by status="published" to match security rules. Ensure documents have status="published" (lowercase) and composite index exists for status + createdAt.';
          console.error('[Projects] PERMISSION DENIED - Query-Rules mismatch!');
          console.error('[Projects] Rules require: resource.data.status == "published"');
          console.error('[Projects] Query must include: where("status", "==", "published")');
          console.error('[Projects] Check Firebase Console for missing composite index');
        } else if (code === 'unavailable' || code === 'deadline-exceeded') {
          errorMsg = 'Network error. Please check your internet connection and try again.';
          console.error('[Projects] Network error - may be mobile connectivity issue');
        } else if (code === 'unauthenticated') {
          errorMsg = 'Authentication error. This should not happen for public reads.';
          console.error('[Projects] Authentication error - check Firebase config');
        } else {
          errorMsg = `Failed to load projects. Error code: ${code}. ${err?.message || 'Check console for details.'}`;
        }
        
        setError(errorMsg);
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
        processes: projectData.processes || [],
        surfaces: projectData.surfaces || [],
        createdAt: now,
        updatedAt: now,
      });
      const docRef = await addDoc(projectsCollection, payload);

      const newProject: Project = {
        id: docRef.id,
        ...projectData,
        technologies: projectData.technologies || [],
        processes: projectData.processes || [],
        surfaces: projectData.surfaces || [],
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

      // Delete old images if replaced
      const currentDoc = await getDoc(projectDoc);
      if (currentDoc.exists()) {
        const currentData = currentDoc.data();
        const oldImageUrls = currentData?.imageUrls || (currentData?.featuredImageUrl ? [currentData.featuredImageUrl] : []);
        const newImageUrls = updateData.imageUrls || (updateData.featuredImageUrl ? [updateData.featuredImageUrl] : []);
        
        // Delete images that are no longer in the new array
        const imagesToDelete = oldImageUrls.filter((url: string) => !newImageUrls.includes(url));
        for (const imageUrl of imagesToDelete) {
          await deleteImageFromStorage(imageUrl, ['projects/images/', 'news/images/']);
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
                processes: updateData.processes || project.processes,
                surfaces: updateData.surfaces || project.surfaces,
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
        const imageUrls = projectData?.imageUrls || (projectData?.featuredImageUrl ? [projectData.featuredImageUrl] : []);
        for (const imageUrl of imageUrls) {
          await deleteImageFromStorage(imageUrl, ['projects/images/', 'news/images/']);
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
        processes: data.processes || [],
        surfaces: data.surfaces || [],
        featuredImageUrl: data.featuredImageUrl,
        imageUrls: data.imageUrls || (data.featuredImageUrl ? [data.featuredImageUrl] : []), // Support both old and new format
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

