import React, { useRef, useState } from 'react';
import { useImageOptimization, useVisibilityObserver } from '../hooks/useImageOptimization';

interface OptimizedImageProps {
  src?: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'same-origin' | 'origin' | 'strict-origin-when-cross-origin' | 'strict-origin' | 'origin-when-cross-origin' | 'unsafe-url';
  loading?: 'lazy' | 'eager';
  maxWidth?: number;
  quality?: number;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  showSkeleton?: boolean;
  placeholderColor?: string;
  width?: number;
  height?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = 'w-full h-full',
  objectFit = 'cover',
  referrerPolicy = 'no-referrer',
  loading = 'lazy',
  quality = 85,
  maxWidth = 1920,
  onError,
  showSkeleton = true,
  placeholderColor = 'bg-zinc-700',
  width,
  height
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = loading === 'lazy' ? useVisibilityObserver(containerRef) : true;
  const { optimizedUrl } = useImageOptimization(src, { quality, maxWidth });
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setError(true);
    setIsLoaded(true);
    onError?.(e);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Ne pas rendre l'image si elle n'est pas visible en lazy loading
  if (loading === 'lazy' && !isVisible && !isLoaded) {
    return (
      <div
        ref={containerRef}
        className={`${className} ${placeholderColor} animate-pulse`}
        title={alt}
      />
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {/* Skeleton loading state */}
      {showSkeleton && !isLoaded && !error && (
        <div className={`absolute inset-0 ${placeholderColor} animate-pulse`} />
      )}

      {/* Image */}
      {!error && (
        <img
          ref={imgRef}
          src={optimizedUrl}
          alt={alt}
          className={`w-full h-full object-${objectFit} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          referrerPolicy={referrerPolicy}
          loading={loading}
          onError={handleError}
          onLoad={handleLoad}
          decoding="async"
          width={width}
          height={height}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-600">
          <span className="text-xs text-center px-2">{alt}</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
