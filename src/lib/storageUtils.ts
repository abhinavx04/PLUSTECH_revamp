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
    const compressedFile = await compressImage(file);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;
    const storagePath = `${path}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Upload file
    await uploadBytes(storageRef, compressedFile);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

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
    
    // Decode the path (URL encoded) - may need multiple decodes
    let encodedPath = pathMatch[1];
    let decodedPath = encodedPath;
    
    // Try decoding multiple times in case of double encoding
    try {
      decodedPath = decodeURIComponent(encodedPath);
      // If still encoded, try again
      if (decodedPath.includes('%')) {
        decodedPath = decodeURIComponent(decodedPath);
      }
    } catch (e) {
      // If decoding fails, use the original
      decodedPath = encodedPath;
    }
    
    return decodedPath;
  } catch (error) {
    console.error('[Storage] Error extracting path from URL:', error, downloadURL);
    return null;
  }
}

/**
 * Delete image from Firebase Storage
 * @param imageUrl - Firebase Storage download URL or storage path
 * @returns true if deleted successfully, false if image doesn't exist or URL is invalid
 */
export async function deleteImageFromStorage(
  imageUrl: string,
  allowedPaths: string[] = ['news/images/', 'projects/images/', 'certifications/images/', 'csr/images/']
): Promise<boolean> {
  if (!storage) {
    return false;
  }

  if (!imageUrl) {
    return false;
  }

  try {
    // Extract storage path from URL or use as-is if it's already a path
    let storagePath: string | null = null;
    
    if (imageUrl.startsWith('gs://')) {
      // Google Cloud Storage URL
      storagePath = imageUrl.replace('gs://', '');
    } else if (imageUrl.startsWith('https://')) {
      // Firebase Storage download URL
      storagePath = extractStoragePathFromURL(imageUrl);
    } else if (imageUrl.startsWith('/') || imageUrl.includes('/')) {
      // Assume it's a storage path (remove leading slash if present)
      storagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    } else {
      // Assume it's a path
      storagePath = imageUrl;
    }

    if (!storagePath) {
      console.error('[Storage] Could not extract storage path from URL:', imageUrl);
      return false;
    }

    // Normalize the path (handle URL encoding)
    storagePath = decodeURIComponent(storagePath);

    // Only delete if it matches an allowed prefix (security)
    const isAllowedPath = allowedPaths.some(prefix => {
      return storagePath?.startsWith(prefix);
    });
    
    if (!isAllowedPath) {
      console.error('[Storage] Path not in allowed list, skipping deletion:', {
        path: storagePath,
        allowedPaths: allowedPaths
      });
      return false;
    }

    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    return true;
  } catch (error: any) {
    // If file doesn't exist, that's okay (might have been deleted already)
    if (error?.code === 'storage/object-not-found') {
      return true; // Consider it successful
    }
    
    // If permission denied, log error with details
    if (error?.code === 'storage/unauthorized' || error?.code === 'storage/permission-denied') {
      console.error('[Storage] ❌ PERMISSION DENIED - Cannot delete image:', {
        url: imageUrl,
        errorCode: error?.code,
        errorMessage: error?.message,
        note: 'Make sure you are logged in and Storage rules allow delete for authenticated users'
      });
      // Throw error so caller knows deletion failed
      throw new Error(`Permission denied: Cannot delete image. Make sure you are authenticated and Storage rules allow delete. Error: ${error?.message || error?.code}`);
    }
    
    console.error('[Storage] ❌ Error deleting image:', {
      url: imageUrl,
      error: error,
      errorCode: error?.code,
      errorMessage: error?.message
    });
    throw error; // Throw error so caller knows deletion failed
  }
}

/**
 * Delete PDF from Firebase Storage
 * @param pdfUrl - Firebase Storage download URL or storage path
 * @param allowedPaths - Array of allowed path prefixes for security
 * @returns true if deleted successfully, false if PDF doesn't exist or URL is invalid
 */
export async function deletePDFFromStorage(
  pdfUrl: string,
  allowedPaths: string[] = ['annualReturns/pdfs/', 'csr/pdfs/']
): Promise<boolean> {
  if (!storage) {
    return false;
  }

  if (!pdfUrl) {
    return false;
  }

  try {
    // Extract storage path from URL or use as-is if it's already a path
    let storagePath: string | null = null;
    
    if (pdfUrl.startsWith('gs://') || pdfUrl.startsWith('annualReturns/') || pdfUrl.startsWith('csr/')) {
      // Already a storage path
      storagePath = pdfUrl.replace('gs://', '');
    } else if (pdfUrl.startsWith('https://')) {
      // Firebase Storage download URL
      storagePath = extractStoragePathFromURL(pdfUrl);
    } else {
      // Assume it's a path
      storagePath = pdfUrl;
    }

    if (!storagePath) {
      return false;
    }

    // Only delete if it matches an allowed prefix (security)
    const isAllowedPath = allowedPaths.some(prefix => storagePath?.startsWith(prefix));
    if (!isAllowedPath) {
      return false;
    }

    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    return true;
  } catch (error: any) {
    // If file doesn't exist, that's okay (might have been deleted already)
    if (error?.code === 'storage/object-not-found') {
      return true; // Consider it successful
    }
    
    // If permission denied, return false but don't throw
    if (error?.code === 'storage/unauthorized') {
      return false; // Return false but don't throw
    }
    
    console.error('[Storage] Error deleting PDF:', error);
    return false;
  }
}

