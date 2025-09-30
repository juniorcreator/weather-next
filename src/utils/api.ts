"use server";

const BASE = "https://pfa.foreca.com/api/v1";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

/** Returns the current, hourly, and daily values for the first city match found. */
export async function getCityWeatherSimple(city: string) {
  const token = process.env.WEATHER_API;
  if (!token) throw new Error("Missing WEATHER_API token");

  const queryCity = encodeURIComponent(city.trim());
  const lang = "en";
  const hourlyPeriods = 24 * 2;
  const dailyPeriods = 7;
  // 168 hours = 7 days hourly
  const searchUrl = `${BASE}/location/search/${queryCity}?lang=${lang}&token=${encodeURIComponent(token)}`;

  // 1) location search
  const searchJson = await fetchJson(searchUrl);
  const locations = searchJson.locations ?? searchJson ?? [];
  if (!Array.isArray(locations) || locations.length === 0) return null; // ничего не найдено

  const loc = locations[0];
  const id = encodeURIComponent(String(loc.id ?? `${loc.lat},${loc.lon}`));

  // 2) parallel get current, hourly и daily
  const urls = {
    current: `${BASE}/current/${id}?token=${encodeURIComponent(token)}&lang=${lang}`,
    hourly: `${BASE}/forecast/hourly/${id}?periods=${168}&token=${encodeURIComponent(token)}&lang=${lang}`,
    daily: `${BASE}/forecast/daily/${id}?periods=${7}&token=${encodeURIComponent(token)}&lang=${lang}`,
  };

  const [current, hourly, daily] = await Promise.all([
    fetchJson(urls.current),
    fetchJson(urls.hourly),
    fetchJson(urls.daily),
  ]);

  return { location: loc, current, hourly, daily };
}
