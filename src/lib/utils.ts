import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeImageUrl(url: string, size: string = '64x64'): string {
  let normalizedUrl = url;
  
  normalizedUrl = normalizedUrl.replace(/\d+x\d+/g, size);
  
  if (normalizedUrl.startsWith('//')) {
    normalizedUrl = `https:${normalizedUrl}`;
  }
  
  return normalizedUrl;
}
