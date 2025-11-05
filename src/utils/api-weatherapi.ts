"use server";

// Query can be city name (string), coordinates (string in format "lat,lon"), or "auto:ip" for IP-based location
export const getWeather = async (query: string) => {
  const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API2}&q=${query}&days=7&pollen=yes&aqi=yes&alerts=yes`);

  // console.log(response, '<< response');

  return await response.json();
}

// Get weather by IP address (fallback when geolocation fails)
export const getWeatherByIP = async () => {
  return await getWeather("auto:ip");
}
