import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes image URL to absolute format required by Next.js Image
 * Converts protocol-relative URLs (//) to https://
 */
export function normalizeImageUrl(url: string): string {
  if (url.startsWith('//')) {
    return `https:${url}`
  }
  return url
}
