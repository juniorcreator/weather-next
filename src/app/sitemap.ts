import { MetadataRoute } from 'next';

/**
 * Sitemap configuration for SEO
 * 
 * Note: Since this app uses client-side search functionality,
 * all weather data is loaded dynamically. The sitemap focuses
 * on the main application page which handles all city searches.
 * 
 * For future enhancement: If city-specific pages are added,
 * they can be included here as static or dynamic routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://get-forecast.com';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly', // Weather data updates frequently
      priority: 1.0, // Highest priority for main page
    },
  ];
}

