/**
 * Image compression utility
 * Compresses images to 1-2MB range while maintaining high quality
 */

/**
 * Compress an image file to target size (1-2MB)
 * Uses canvas API for compression
 * Handles images of any size by automatically resizing and compressing
 */
export async function compressImage(
  file: File,
  maxWidthOrHeight: number = 1920
): Promise<File> {
  return new Promise((resolve, reject) => {
    const originalSizeMB = file.size / (1024 * 1024);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        // For very large images, be more aggressive with resizing
        // If original is huge, reduce max dimension further
        if (originalSizeMB > 20) {
          maxWidthOrHeight = 1600; // Smaller for very large files
        } else if (originalSizeMB > 10) {
          maxWidthOrHeight = 1800;
        }
        
        if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
          if (width > height) {
            height = (height / width) * maxWidthOrHeight;
            width = maxWidthOrHeight;
          } else {
            width = (width / height) * maxWidthOrHeight;
            height = maxWidthOrHeight;
          }
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Use better image smoothing for quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels to get target size
        let quality = 0.85; // Start with good quality
        let attempts = 0;
        const maxAttempts = 15; // More attempts for larger files
        
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              const sizeMB = blob.size / (1024 * 1024);
              
              // If size is within target range (0.8-2MB), we're done
              if (sizeMB >= 0.8 && sizeMB <= 2) {
                const compressedFile = new File(
                  [blob],
                  file.name,
                  { type: 'image/jpeg', lastModified: Date.now() }
                );
                resolve(compressedFile);
                return;
              }
              
              // If too large and we can reduce quality more
              if (sizeMB > 2 && quality > 0.6 && attempts < maxAttempts) {
                quality -= 0.03; // Smaller steps for better control
                attempts++;
                tryCompress();
                return;
              }
              
              // If too small, increase quality slightly
              if (sizeMB < 0.8 && quality < 0.95 && attempts < maxAttempts) {
                quality = Math.min(0.95, quality + 0.02);
                attempts++;
                tryCompress();
                return;
              }
              
              // Accept current result if close enough or max attempts reached
              const compressedFile = new File(
                [blob],
                file.name,
                { type: 'image/jpeg', lastModified: Date.now() }
              );
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        
        tryCompress();
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get file size in MB
 */
export function getFileSizeMB(file: File): number {
  return file.size / (1024 * 1024);
}

/**
 * Validate image file
 * Note: No size limit - images will be compressed automatically
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
    };
  }
  
  return { valid: true };
}

