import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Get Forecast - Accurate Weather Forecasts",
    template: "%s | Get Forecast - Accurate Weather Forecasts",
  },
  description: "Get accurate weather forecasts for New York, Los Angeles, Chicago, London, Toronto, Sydney and 1000+ cities worldwide. Real-time weather data, hourly and daily forecasts, 7-day outlook, air quality index, pollen count, UV index, and severe weather alerts.",
  keywords: [
    // Core weather terms
    "weather", "forecast", "weather app", "weather forecast", "current weather", "weather today", "weather tomorrow",
    "hourly forecast", "daily forecast", "7-day forecast", "weather forecast app", "weather conditions",
    "local weather", "weather radar", "weather map", "weather alerts", "severe weather", "weather data",
    
    // Weather metrics
    "temperature", "humidity", "wind speed", "precipitation", "air quality", "air quality index", "AQI",
    "pollen count", "pollen forecast", "UV index", "visibility", "pressure", "atmospheric pressure",
    "sunrise", "sunset", "feels like temperature", "dew point", "heat index", "wind chill",
    
    // Popular US cities
    "weather New York", "weather Los Angeles", "weather Chicago", "weather Houston", "weather Phoenix",
    "weather Philadelphia", "weather San Antonio", "weather San Diego", "weather Dallas", "weather San Jose",
    "weather Austin", "weather Jacksonville", "weather Fort Worth", "weather Columbus", "weather Charlotte",
    "weather San Francisco", "weather Indianapolis", "weather Seattle", "weather Denver", "weather Washington DC",
    "weather Boston", "weather El Paso", "weather Detroit", "weather Nashville", "weather Portland",
    "weather Memphis", "weather Oklahoma City", "weather Las Vegas", "weather Louisville", "weather Baltimore",
    "weather Milwaukee", "weather Albuquerque", "weather Tucson", "weather Fresno", "weather Sacramento",
    "weather Kansas City", "weather Mesa", "weather Atlanta", "weather Omaha", "weather Miami",
    "weather Cleveland", "weather Tulsa", "weather Oakland", "weather Minneapolis", "weather Wichita",
    "weather Arlington", "weather Tampa", "weather New Orleans", "weather Honolulu", "weather Raleigh",
    
    // Major English-speaking cities
    "weather London", "weather Toronto", "weather Sydney", "weather Melbourne", "weather Auckland",
    "weather Dublin", "weather Vancouver", "weather Calgary", "weather Edmonton", "weather Winnipeg",
    "weather Ottawa", "weather Brisbane", "weather Perth", "weather Adelaide", "weather Manchester",
    "weather Birmingham", "weather Liverpool", "weather Glasgow", "weather Edinburgh", "weather Belfast",
    "weather Cardiff", "weather Christchurch", "weather Wellington", "weather Cape Town", "weather Johannesburg",
    
    // City-specific variations
    "New York weather", "Los Angeles weather", "Chicago weather", "London weather", "Toronto weather",
    "Sydney weather", "Melbourne weather", "weather forecast New York", "weather forecast Los Angeles",
    "weather forecast Chicago", "weather forecast London", "current weather New York", "current weather Los Angeles",
    
    // Long-tail keywords
    "weather forecast for", "current weather in", "today's weather", "tomorrow's weather", "weekly weather forecast",
    "hourly weather forecast", "daily weather forecast", "weather app free", "accurate weather forecast",
    "real-time weather", "weather updates", "weather information", "weather report", "weather prediction",
  ],
  authors: [{ name: "Weather App" }],
  creator: "Weather App",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://get-forecast.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Weather Forecast App",
    description: "Get accurate weather forecasts for New York, Los Angeles, Chicago, London, Toronto, Sydney and 1000+ cities worldwide. Real-time weather data, hourly and daily forecasts, 7-day outlook, air quality index, pollen count, UV index, and severe weather alerts.",
    siteName: "Weather Forecast App",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Weather Forecast App',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weather Forecast App",
    description: "Get accurate weather forecasts for New York, Los Angeles, Chicago, London, Toronto, Sydney and 1000+ cities worldwide. Real-time weather data, hourly and daily forecasts, 7-day outlook, air quality index, pollen count, UV index, and severe weather alerts.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a2e' },
  ],
};

// Structured data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Weather Forecast App',
  description: 'Get accurate weather forecasts for New York, Los Angeles, Chicago, London, Toronto, Sydney and 1000+ cities worldwide. Real-time weather data, hourly and daily forecasts, 7-day outlook, air quality index, pollen count, UV index, and severe weather alerts.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://get-forecast.com',
  applicationCategory: 'WeatherApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '100',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
