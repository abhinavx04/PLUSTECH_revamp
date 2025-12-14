import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { compressImage, validateImageFile } from './imageUtils';

/**
 * Upload image to Firebase Storage
 * @param file - Image file to upload
 * @param path - Storage path (e.g., 'news/images')
 * @returns Download URL of uploaded image
 */
export async function uploadImageToStorage(
  file: File,
  path: string = 'news/images'
): Promise<string> {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }

  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file');
  }

  try {
    // Compress image first
    console.log('[Storage] Compressing image...', {
      originalSize: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
      fileName: file.name,
    });

    const compressedFile = await compressImage(file);
    
    console.log('[Storage] Image compressed', {
      compressedSize: (compressedFile.size / (1024 * 1024)).toFixed(2) + 'MB',
      reduction: (((file.size - compressedFile.size) / file.size) * 100).toFixed(1) + '%',
    });

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;
    const storagePath = `${path}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Upload file
    console.log('[Storage] Uploading to:', storagePath);
    await uploadBytes(storageRef, compressedFile);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('[Storage] Upload successful:', downloadURL);

    return downloadURL;
  } catch (error: any) {
    console.error('[Storage] Upload error:', error);
    throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Extract storage path from Firebase Storage download URL
 * @param downloadURL - Firebase Storage download URL
 * @returns Storage path or null if URL is invalid
 */
function extractStoragePathFromURL(downloadURL: string): string | null {
  try {
    // Firebase Storage URLs format:
    // https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media&token={token}
    const url = new URL(downloadURL);
    
    if (url.hostname !== 'firebasestorage.googleapis.com') {
      // Not a Firebase Storage URL, return null
      return null;
    }
    
    // Extract the path from the URL
    const pathMatch = url.pathname.match(/\/o\/(.+)$/);
    if (!pathMatch) {
      return null;
    }
    
    // Decode the path (URL encoded)
    const encodedPath = pathMatch[1];
    const decodedPath = decodeURIComponent(encodedPath);
    
    return decodedPath;
  } catch (error) {
    console.error('[Storage] Error extracting path from URL:', error);
    return null;
  }
}

/**
 * Delete image from Firebase Storage
 * @param imageUrl - Firebase Storage download URL or storage path
 * @returns true if deleted successfully, false if image doesn't exist or URL is invalid
 */
export async function deleteImageFromStorage(imageUrl: string): Promise<boolean> {
  if (!storage) {
    console.warn('[Storage] Firebase Storage is not initialized');
    return false;
  }

  if (!imageUrl) {
    return false;
  }

  try {
    // Extract storage path from URL or use as-is if it's already a path
    let storagePath: string | null = null;
    
    if (imageUrl.startsWith('gs://') || imageUrl.startsWith('news/')) {
      // Already a storage path
      storagePath = imageUrl.replace('gs://', '');
    } else if (imageUrl.startsWith('https://')) {
      // Firebase Storage download URL
      storagePath = extractStoragePathFromURL(imageUrl);
    } else {
      // Assume it's a path
      storagePath = imageUrl;
    }

    if (!storagePath) {
      console.warn('[Storage] Could not extract storage path from URL:', imageUrl);
      return false;
    }

    // Only delete if it's in the news/images path (security)
    if (!storagePath.startsWith('news/images/')) {
      console.warn('[Storage] Path is not in news/images, skipping deletion:', storagePath);
      return false;
    }

    console.log('[Storage] Deleting image from path:', storagePath);
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    console.log('[Storage] Image deleted successfully');
    return true;
  } catch (error: any) {
    // If file doesn't exist, that's okay (might have been deleted already)
    if (error?.code === 'storage/object-not-found') {
      console.log('[Storage] Image not found (may have been deleted already)');
      return true; // Consider it successful
    }
    
    // If permission denied, log warning but don't throw
    if (error?.code === 'storage/unauthorized') {
      console.warn('[Storage] Permission denied - Storage rules may not allow delete. Update Firebase Storage rules to include "allow delete".');
      console.warn('[Storage] See FIRESTORE_RULES.md for updated Storage rules');
      return false; // Return false but don't throw
    }
    
    console.error('[Storage] Error deleting image:', error);
    return false;
  }
}

