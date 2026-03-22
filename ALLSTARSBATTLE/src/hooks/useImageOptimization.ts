import { useState, useEffect } from 'react';

interface OptimizationConfig {
  quality?: number;
  maxWidth?: number;
  format?: 'webp' | 'jpg' | 'png';
}

// Hook pour optimiser les images avec caching
export const useImageOptimization = (imageUrl: string | undefined, config?: OptimizationConfig) => {
  const [optimizedUrl, setOptimizedUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      setOptimizedUrl('');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Si l'image vient de R2 (domaine Cloudflare), on peut ajouter les paramètres d'optimisation
    if (imageUrl.includes('r2.dev') || imageUrl.includes('imagecdn')) {
      // Cloudflare Image Optimization
      const params = new URLSearchParams({
        fit: 'scale-down',
        width: String(config?.maxWidth || 1920),
        quality: String(config?.quality || 85),
        format: config?.format || 'auto'
      });
      const optimized = `${imageUrl}?${params.toString()}`;
      setOptimizedUrl(optimized);
      setIsLoading(false);
    } else {
      // Pour les autres images, pas de transformation côté serveur disponible
      // Appliquer les optimisations côté client
      setOptimizedUrl(imageUrl);
      setIsLoading(false);
    }
  }, [imageUrl, config?.maxWidth, config?.quality, config?.format]);

  return { optimizedUrl, isLoading, error };
};

// Hook pour déterminer si on doit charger une image en lazy loading
export const useVisibilityObserver = (elementRef: React.RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '50px', // Charger 50px avant que l'image soit visible
        threshold: 0.01
      }
    );

    observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return isVisible;
};
