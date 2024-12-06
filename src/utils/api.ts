import { fetch as tauriFetch, ResponseType } from '@tauri-apps/api/http';

async function fetchWithTauri(url: string) {
  const response = await tauriFetch(url, {
    method: 'GET',
    responseType: ResponseType.JSON,
  });
  if (response.ok) {
    return response.data;
  } else {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function fetchWeather(city: string, apiKey: string) {
  try {
    // First, we need to get the coordinates for the city
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geoData = typeof window !== 'undefined' && 'Tauri' in window
      ? await fetchWithTauri(geoUrl)
      : await (await fetch(geoUrl)).json();

    if (!geoData.length) {
      throw new Error('City not found');
    }

    const { lat, lon } = geoData[0];

    // Now we can use the coordinates to fetch weather data from One Call API 3.0
    const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${apiKey}`;
    const data = typeof window !== 'undefined' && 'Tauri' in window
      ? await fetchWithTauri(weatherUrl)
      : await (await fetch(weatherUrl)).json();

    const { current } = data;

    return {
      main: current.weather[0].main,
      description: current.weather[0].description,
      temp: Math.round(current.temp),
      humidity: current.humidity,
      wind_speed: current.wind_speed,
      name: city,
      timeOfDay: getTimeOfDay(current.dt, data.timezone_offset),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
}

function getTimeOfDay(timestamp: number, timezoneOffset: number): string {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours();

  if (hours >= 5 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 17) return 'day';
  if (hours >= 17 && hours < 20) return 'evening';
  return 'night';
}

export async function fetchCityFromCoords(lat: number, lon: number, apiKey: string): Promise<string> {
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
  const data = typeof window !== 'undefined' && 'Tauri' in window
    ? await fetchWithTauri(url)
    : await (await fetch(url)).json();

  if (!data.length) {
    throw new Error('City not found');
  }

  return data[0].name;
}



