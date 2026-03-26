'use client'

import { useEffect, useState, useRef } from 'react'
import { WeatherCard } from '../components/WeatherCard'
import { ForecastCard } from '../components/ForecastCard'
import { CircularPopup } from '../components/CircularPopup'
import { fetchWeather, fetchCityFromCoords } from '../utils/api'
import { gsap } from 'gsap'

export default function Home() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [error, setError] = useState(null)
  const [apiKey] = useState('80128c9bc0416d0ad81ba57c40c9b871')
  const [isLoading, setIsLoading] = useState(true)
  const [showForecast, setShowForecast] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const detectCity = async () => {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          const { latitude, longitude } = position.coords
          const detectedCity = await fetchCityFromCoords(latitude, longitude, apiKey)
          getWeather(detectedCity)
        } catch (error) {
          console.error('Error detecting city:', error)
          getWeather('London') // Fallback to London if geolocation fails
        }
      } else {
        getWeather('London') // Fallback to London if geolocation is not supported
      }
    }

    detectCity()
  }, [apiKey])

  const getWeather = async (city: string) => {
    if (!city) return
    try {
      setError(null)
      setIsLoading(true)
      const data = await fetchWeather(city, apiKey)
      setWeather(data)
      // For this example, we'll generate mock forecast data
      setForecast(generateMockForecast())
    } catch (error) {
      console.error('Error fetching weather:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockForecast = () => {
    const forecast = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      forecast.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        temp: Math.round(Math.random() * 20 + 10),
        humidity: Math.round(Math.random() * 50 + 30),
        wind_speed: Math.round(Math.random() * 10 + 1),
      })
    }
    return forecast
  }

  const handleMinimize = () => {
    gsap.to(containerRef.current, {
      scale: 0.1,
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: () => setIsMinimized(true)
    });
  }

  const handleExpand = () => {
    setIsMinimized(false);
    gsap.from(containerRef.current, {
      scale: 0.1,
      opacity: 0,
      duration: 0.5,
      ease: "power3.inOut"
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {error ? (
        <div className="bg-red-500 text-white p-4 rounded-3xl mb-4 max-w-[350px] text-center">
          {error}
        </div>
      ) : weather ? (
        isMinimized ? (
          <CircularPopup temp={weather.temp} onExpand={handleExpand} />
        ) : (
          <div ref={containerRef} className="relative">
            <WeatherCard 
              weather={weather} 
              onShowForecast={() => setShowForecast(true)} 
              onMinimize={handleMinimize}
            />
            {showForecast && <ForecastCard forecast={forecast} />}
          </div>
        )
      ) : null}
    </div>
  )
}

