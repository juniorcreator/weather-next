"use server";

// Query can be city name (string), coordinates (string in format "lat,lon"), or "auto:ip" for IP-based location
export const getWeather = async (query: string) => {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API2}&q=${query}&days=7&pollen=yes&aqi=yes&alerts=yes`,
    {
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  );

  return await response.json();
}

// Get weather by IP address (fallback when geolocation fails)
export const getWeatherByIP = async () => {
  return await getWeather("auto:ip");
}

// Search/Autocomplete API for location suggestions
export const searchLocations = async (query: string) => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${process.env.WEATHER_API2}&q=${encodeURIComponent(query)}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}
