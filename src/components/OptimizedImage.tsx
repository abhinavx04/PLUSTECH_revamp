import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Optimized Image Component
 * - Adds loading="lazy" by default
 * - Includes width/height to prevent layout shift
 * - Shows loading placeholder
 * - Handles errors gracefully
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  objectFit = 'contain',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageLoading = priority ? 'eager' : loading;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : undefined,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" aria-hidden="true" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={imageLoading}
        decoding="async"
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} w-full h-full object-${objectFit}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Image not available
        </div>
      )}
    </div>
  );
};

