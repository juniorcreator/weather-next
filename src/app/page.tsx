import Search from "@/components/search/Search";
import { getWeatherByIP, getWeather } from "@/utils/api-weatherapi";
import { RootWeather } from "@/types/weather";
import { cookies } from "next/headers";

async function getInitialWeatherData(): Promise<RootWeather | null> {
  try {
    const cookieStore = await cookies();
    const savedLocation = cookieStore.get('weather-location');
    
    // If user has saved a location, use it
    if (savedLocation?.value) {
      try {
        const locationData = JSON.parse(savedLocation.value);
        
        // If coordinates are available, use them (more accurate)
        if (locationData.lat && locationData.lon) {
          const query = `${locationData.lat},${locationData.lon}`;
          const weatherData = await getWeather(query);
          
          if (!weatherData?.error) {
            return weatherData;
          }
        }
        
        // If only city name is available, use it
        if (locationData.cityName) {
          const weatherData = await getWeather(locationData.cityName);
          
          if (!weatherData?.error) {
            return weatherData;
          }
        }
      } catch (parseError) {
        // If parsing fails, continue to IP-based location
        console.error('Failed to parse saved location:', parseError);
      }
    }
    
    // If no saved location or saved location failed, try IP-based location
    try {
      const weatherData = await getWeatherByIP();
      
      // Check if there's an error in the response
      if (weatherData?.error) {
        // Fallback to default city if IP-based location fails
        return await getWeather("New York");
      }
      
      return weatherData;
    } catch (ipError) {
      // Fallback to default city on any error
      return await getWeather("New York");
    }
  } catch (error) {
    // Final fallback to default city
    try {
      return await getWeather("New York");
    } catch (fallbackError) {
      console.error('Failed to load initial weather data:', fallbackError);
      return null;
    }
  }
}

export default async function Home() {
  const initialWeatherData = await getInitialWeatherData();
  
  return (
    <div id="root">
      <div className="min-h-screen bg-background">
        <Search initialWeatherData={initialWeatherData} />
      </div>
    </div>
  );
}
