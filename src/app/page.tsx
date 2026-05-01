import Search from "@/components/search/Search";
import { getWeatherByIP, getWeather } from "@/utils/api-weatherapi";
import { RootWeather } from "@/types/weather";
import { cookies } from "next/headers";
import type { Metadata } from "next";

async function getInitialWeatherData(): Promise<RootWeather | null> {
  try {
    const cookieStore = await cookies();
    const savedLocation = cookieStore.get("weather-location");

    if (savedLocation?.value) {
      try {
        const locationData = JSON.parse(savedLocation.value);

        if (locationData.lat && locationData.lon) {
          const query = `${locationData.lat},${locationData.lon}`;
          const weatherData = await getWeather(query);

          if (!weatherData?.error) {
            return weatherData;
          }
        }

        if (locationData.cityName) {
          const weatherData = await getWeather(locationData.cityName);

          if (!weatherData?.error) {
            return weatherData;
          }
        }
      } catch (parseError) {
        console.error("Failed to parse saved location:", parseError);
      }
    }

    try {
      const weatherData = await getWeatherByIP();

      if (weatherData?.error) {
        return await getWeather("New York");
      }

      return weatherData;
    } catch (ipError) {
      return await getWeather("New York");
    }
  } catch (error) {
    try {
      return await getWeather("New York");
    } catch (fallbackError) {
      console.error("Failed to load initial weather data:", fallbackError);
      return null;
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const weatherData = await getInitialWeatherData();

  const defaultTitle = "Get Forecast - Accurate Weather Forecasts";
  const defaultDescription =
    "Get accurate weather forecasts for New York, Los Angeles, Chicago, London, Toronto, Sydney and 1000+ cities worldwide. Real-time weather data, hourly and daily forecasts, 7-day outlook, air quality index, pollen count, UV index, and severe weather alerts.";

  if (weatherData?.location?.name && !weatherData.error) {
    const cityName = weatherData.location.name;
    const cityTitle = `Weather Forecast for ${cityName}`;
    const cityDescription = `Get accurate weather forecasts for ${cityName}. Real-time weather data, hourly and daily forecasts, 7-day outlook, air quality index, pollen count, UV index, and severe weather alerts.`;

    return {
      title: cityTitle,
      description: cityDescription,
      openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        title: cityTitle,
        description: cityDescription,
        siteName: "Get Forecast",
        images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `Weather Forecast for ${cityName}` }],
      },
      twitter: {
        card: "summary_large_image",
        title: cityTitle,
        description: cityDescription,
        images: ["/og-image.png"],
      },
      alternates: { canonical: "/" },
    };
  }

  return {
    title: defaultTitle,
    description: defaultDescription,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      title: defaultTitle,
      description: defaultDescription,
      siteName: "Get Forecast",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Weather Forecast App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: ["/og-image.png"],
    },
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  const initialWeatherData = await getInitialWeatherData();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.get-forecast.com";
  const cookieStore = await cookies();
  const savedUnit = cookieStore.get("temperature-unit")?.value as "C" | "F" | undefined;
  const initialUnit = savedUnit === "C" ? "C" : "F";

  const generateStructuredData = () => {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Weather Forecast App",
      url: baseUrl,
      applicationCategory: "WeatherApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    };

    if (initialWeatherData?.location?.name && !initialWeatherData.error) {
      const cityName = initialWeatherData.location.name;
      const description = `Get accurate weather forecasts for ${cityName}. Real-time weather data, hourly and daily forecasts, 7-day outlook, air quality index, pollen count, UV index, and severe weather alerts.`;

      return {
        ...baseStructuredData,
        description,
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "100" },
        areaServed: {
          "@type": "City",
          name: cityName,
          addressRegion: initialWeatherData.location.region || "",
          addressCountry: initialWeatherData.location.country || "",
        },
      };
    }

    return {
      ...baseStructuredData,
      description:
        "Get accurate weather forecasts for New York, Los Angeles, Chicago, London, Toronto, Sydney and 1000+ cities worldwide. Real-time weather data, hourly and daily forecasts, 7-day outlook, air quality index, pollen count, UV index, and severe weather alerts.",
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "100" },
    };
  };

  const structuredData = generateStructuredData();

  return (
    <div id="root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-background">
        <Search initialUnit={initialUnit} initialWeatherData={initialWeatherData} />
      </div>
    </div>
  );
}
