import { useState, useEffect, useLayoutEffect, useRef } from "react";

const STORAGE_KEY = "weather-location";
type TemperatureUnit = "C" | "F";

export const useGeolocation = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lon) {
          setLocation({ lat: parsed.lat, lon: parsed.lon });
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to load saved location:", err);
      }
    }
  }, []);

  const requestLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
      if (!response.ok) {
        throw new Error("Network error occurred");
      }
      const { latitude, longitude, city, ...rest } = await response.json();
      setLocation({ lat: latitude, lon: longitude });
      setError(null);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lat: latitude, lon: longitude }),
      );
      console.log("Rest geo data", rest);
    } catch (error) {
      throw new Error(`Could not get geo data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return { location, error, loading, requestLocation };
};

export const useTemperatureUnit = () => {
  const [unit, setUnit] = useState<TemperatureUnit>("F");
  const unit2 = useRef("F");

  const toggleUnit = () => {
    setUnit((current) => {
      const newUnit = current === "C" ? "F" : "C";
      if (typeof window !== "undefined") {
        localStorage.setItem("temperature-unit", newUnit);
      }
      document.cookie = `temperature-unit=${newUnit}; path=/; max-age=31536000`;
      return newUnit;
    });
  };

  useLayoutEffect(() => {
    const iii = localStorage.getItem("temperature-unit");
    console.log(iii, " iii");
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("temperature-unit");
      console.log(saved, " saved");
      if (saved === "F" || saved === "C") {
        setUnit(saved);
        unit2.current = saved;
      }
    }
  }, []);

  return { unit, unit2, toggleUnit };
};
