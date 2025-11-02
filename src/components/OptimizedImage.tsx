import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

// Generate blur placeholder data URL
function getBlurDataURL(width = 8, height = 6): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Cg filter='url(%23b)'%3E%3Crect width='${width}' height='${height}' fill='%23a5b4fc'/%3E%3C/g%3E%3C/svg%3E`;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  aspectRatio = '16/9',
  priority = false 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setImageSrc('/placeholder.svg');
      setIsLoading(false);
      setError(true);
    };

    // Start loading immediately for priority images, otherwise use IntersectionObserver
    if (priority) {
      img.src = src;
    } else {
      // Lazy load with IntersectionObserver
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = src;
            observer.disconnect();
          }
        });
      }, {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      });

      const element = document.querySelector(`[data-src="${src}"]`);
      if (element) {
        observer.observe(element);
      } else {
        // Fallback: load immediately if element not found
        img.src = src;
      }

      return () => observer.disconnect();
    }
  }, [src, priority]);

  return (
    <div 
      className={cn("relative overflow-hidden bg-muted", className)}
      style={{ aspectRatio }}
      data-src={src}
    >
      {/* Blur placeholder - shows while loading */}
      {isLoading && (
        <img
          src={getBlurDataURL()}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? {} : { fetchpriority: 'low' })}
        />
      )}
    </div>
  );
}
