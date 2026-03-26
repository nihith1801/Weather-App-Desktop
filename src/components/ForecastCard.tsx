'use client'

import { useEffect, useRef } from 'react'
import { Card, CardHeader, CardBody } from "@nextui-org/card"
import { gsap } from 'gsap'
import { Droplets, Wind } from 'lucide-react'

interface ForecastDay {
  date: string;
  temp: number;
  humidity: number;
  wind_speed: number;
}

interface ForecastCardProps {
  forecast: ForecastDay[];
}

export function ForecastCard({ forecast }: ForecastCardProps) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    gsap.from(card, {
      y: 500,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out"
    });
  }, []);

  return (
    <Card ref={cardRef} className="w-[350px] h-[500px] overflow-y-auto bg-gray-800 text-white font-roboto-mono">
      <CardHeader className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700">
        <h3 className="text-xl font-bold">7-Day Forecast</h3>
      </CardHeader>
      <CardBody className="p-4">
        {forecast.map((day, index) => (
          <div key={index} className="mb-4 p-3 bg-gray-700 rounded-lg">
            <p className="text-lg font-semibold mb-2">{day.date}</p>
            <p className="text-2xl font-bold mb-2">{day.temp}°C</p>
            <div className="flex items-center text-sm mb-1">
              <Droplets className="mr-2" size={16} />
              <span>Humidity: {day.humidity}%</span>
            </div>
            <div className="flex items-center text-sm">
              <Wind className="mr-2" size={16} />
              <span>Wind: {day.wind_speed} m/s</span>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

