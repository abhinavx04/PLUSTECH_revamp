/**
 * Image compression utility
 * Compresses images to 1-2MB range while maintaining high quality
 */

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  quality: number;
}

/**
 * Compress an image file to target size (1-2MB)
 * Uses canvas API for compression
 */
export async function compressImage(
  file: File,
  targetSizeMB: number = 1.5,
  maxWidthOrHeight: number = 1920
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
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
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Try different quality levels to get target size
        let quality = 0.92; // Start with high quality
        let compressedBlob: Blob | null = null;
        let attempts = 0;
        const maxAttempts = 10;
        
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              
              const sizeMB = blob.size / (1024 * 1024);
              
              // If size is within target range (1-2MB), we're done
              if (sizeMB >= 1 && sizeMB <= 2) {
                const compressedFile = new File(
                  [blob],
                  file.name,
                  { type: 'image/jpeg', lastModified: Date.now() }
                );
                resolve(compressedFile);
                return;
              }
              
              // If too large and we can reduce quality more
              if (sizeMB > 2 && quality > 0.7 && attempts < maxAttempts) {
                quality -= 0.05;
                attempts++;
                tryCompress();
                return;
              }
              
              // If too small, increase quality slightly
              if (sizeMB < 1 && quality < 0.95 && attempts < maxAttempts) {
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
  
  // Check file size (max 10MB before compression)
  const maxSizeMB = 10;
  if (getFileSizeMB(file) > maxSizeMB) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeMB}MB before compression.`,
    };
  }
  
  return { valid: true };
}

