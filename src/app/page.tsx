'use client'

import { useEffect, useState } from 'react'
import { WeatherCard } from '../components/WeatherCard'
import { fetchWeather, fetchCityFromCoords } from '../utils/api'

export default function Home() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [apiKey] = useState('key')
  const [isLoading, setIsLoading] = useState(true)

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
    } catch (error) {
      console.error('Error fetching weather:', error)
      setError('Failed to fetch weather data. Please check your internet connection and try again.')
    } finally {
      setIsLoading(false)
    }
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
        <WeatherCard weather={weather} />
      ) : null}
    </div>
  )
}

