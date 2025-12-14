import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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

