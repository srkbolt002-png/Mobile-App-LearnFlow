import { get, set } from 'idb-keyval';

/**
 * Simple image cache using IndexedDB for offline support
 */

const CACHE_VERSION = 'v1';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedImage {
  blob: Blob;
  timestamp: number;
  version: string;
}

export async function getCachedImage(url: string): Promise<string | null> {
  try {
    const cached = await get<CachedImage>(url);
    
    if (!cached) return null;
    
    // Check if cache is expired or version mismatch
    if (
      cached.version !== CACHE_VERSION ||
      Date.now() - cached.timestamp > CACHE_EXPIRY
    ) {
      return null;
    }
    
    return URL.createObjectURL(cached.blob);
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
}

export async function cacheImage(url: string, blob: Blob): Promise<void> {
  try {
    await set(url, {
      blob,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    });
  } catch (error) {
    console.error('Error caching image:', error);
  }
}

export async function prefetchImage(url: string): Promise<void> {
  try {
    // Check if already cached
    const cached = await getCachedImage(url);
    if (cached) return;
    
    // Fetch and cache
    const response = await fetch(url);
    const blob = await response.blob();
    await cacheImage(url, blob);
  } catch (error) {
    console.error('Error prefetching image:', error);
  }
}

export async function prefetchImages(urls: string[]): Promise<void> {
  await Promise.allSettled(urls.map(url => prefetchImage(url)));
}
