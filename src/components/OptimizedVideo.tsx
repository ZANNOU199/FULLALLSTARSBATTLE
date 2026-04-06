import React, { useRef } from 'react';
import { useVisibilityObserver } from '../hooks/useImageOptimization';

interface OptimizedVideoProps {
  src?: string;
  poster?: string;
  className?: string;
  muted?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  loading?: 'lazy' | 'eager';
  preload?: 'none' | 'metadata' | 'auto';
  quality?: 'low' | 'medium' | 'high';
}

/**
 * Composant vidéo optimisé avec lazy loading et qualité adaptative
 */
const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  poster,
  className = 'w-full h-full',
  muted = true,
  autoPlay = true,
  loop = true,
  controls = false,
  loading = 'lazy',
  preload = 'metadata',
  quality = 'medium'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = loading === 'lazy' ? useVisibilityObserver(containerRef) : true;

  // Map quality à une résolution max (pour futur streaming adaptatif)
  const qualityMap = {
    low: 480,
    medium: 720,
    high: 1080
  };

  if (!src) {
    return <div ref={containerRef} className={`${className} bg-zinc-800`} />;
  }

  // Ne pas rendre la vidéo si elle n'est pas visible en lazy loading
  if (loading === 'lazy' && !isVisible) {
    return (
      <div
        ref={containerRef}
        className={`${className} bg-zinc-800 animate-pulse`}
        style={{ backgroundImage: poster ? `url(${poster})` : undefined, backgroundSize: 'cover' }}
      />
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        poster={poster}
        muted={muted}
        autoPlay={autoPlay && isVisible}
        loop={loop}
        controls={controls}
        preload={preload}
        data-quality={quality}
        style={{ maxHeight: '100%' }}
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" srcLang="en" label="English" />
        Votre navigateur ne supporte pas la vidéo HTML5.
      </video>
    </div>
  );
};

export default OptimizedVideo;
