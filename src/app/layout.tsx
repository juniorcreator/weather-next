import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Weather Forecast App",
    template: "%s | Weather Forecast",
  },
  description: "Get accurate weather forecasts for any location. Real-time weather data, hourly and daily forecasts, air quality, and pollen information.",
  keywords: ["weather", "forecast", "weather app", "temperature", "humidity", "air quality"],
  authors: [{ name: "Weather App" }],
  creator: "Weather App",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://weather-app.com'),
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
    description: "Get accurate weather forecasts for any location",
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
    description: "Get accurate weather forecasts for any location",
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
  description: 'Get accurate weather forecasts for any location. Real-time weather data, hourly and daily forecasts, air quality, and pollen information.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://weather-app.com',
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
      </body>
    </html>
  );
}
