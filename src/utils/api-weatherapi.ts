"use server";

export const getWeather = async (query: string) => {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API}&q=${query}&days=7&pollen=yes&aqi=yes&alerts=yes`,
    {
      next: { 
        revalidate: 300,
        tags: [`weather-${query}`],
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch weather: ${response.statusText}`);
  }

  return await response.json();
}

export const getWeatherByIP = async () => {
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API2}&q=auto:ip&days=7&pollen=yes&aqi=yes&alerts=yes`,
    {
      next: { 
        revalidate: 300,
        tags: ['weather-ip'],
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch weather by IP: ${response.statusText}`);
  }

  return await response.json();
}

export const searchLocations = async (query: string) => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=${process.env.WEATHER_API2}&q=${encodeURIComponent(query)}`,
      {
        next: { revalidate: 3600 },
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
