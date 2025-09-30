"use server";

export const getWeather = async (city: string) => {
  const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API2}&q=${city}&days=7&pollen=yes&aqi=yes&alerts=yes`);

  console.log(response, '<< response');

  return await response.json();
}
