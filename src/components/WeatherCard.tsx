'use client'

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card"
import { useEffect, useState } from 'react'

const weatherGifs = {
  Clear: {
    day: "https://media.giphy.com/media/XWXnf6hRiKrV6/giphy.gif",
    night: "https://media.tenor.com/WPqFfKvgIbUAAAAd/stars-train.gif",
    morning: "https://i.redd.it/l402nc2coum71.gif",
    evening: "https://art.pixilart.com/6eb3abfd9f8d46a.gif",
  },
  Clouds: {
    day: "https://i.redd.it/cogriye4xdha1.gif",
    night: "https://cdnb.artstation.com/p/assets/images/images/041/601/775/original/ida-franzen-karlsson-background-animation.gif?1632167232",
    morning: "https://i.redd.it/5gz63rrijbh71.gif",
    evening: "https://i.pinimg.com/originals/c1/b3/16/c1b31611e66b7c211bfd0296dd454bfb.gif",
  },
  Rain: {
    day: "https://i.pinimg.com/originals/08/68/09/08680930d8348ecd845c99a4f5306605.gif",
    night: "https://i.pinimg.com/originals/37/bf/c6/37bfc69eb6c58084ab377df8a01fae14.gif",
    morning: "https://wallpaperaccess.com/full/9142337.gif",
    evening: "https://wallpaperaccess.com/full/9142337.gif",
  },
  Snow: {
    day: "https://i.redd.it/8n2ztzvoan541.gif",
    night: "https://i.pinimg.com/originals/71/5a/3d/715a3d6dcdd4225528d79f104e2e0785.gif",
    morning: "https://giffiles.alphacoders.com/211/211056.gif",
    evening: "https://giffiles.alphacoders.com/211/211056.gif",
  },
  Thunderstorm: {
    day: "https://i.pinimg.com/originals/37/bf/c6/37bfc69eb6c58084ab377df8a01fae14.gif",
    night: "https://tse4.mm.bing.net/th/id/OIP.dGRqAVfNh90yVuDT5wIppgHaEo?rs=1&pid=ImgDetMain",
    morning: "https://i.pinimg.com/originals/37/bf/c6/37bfc69eb6c58084ab377df8a01fae14.gif",
    evening: "https://tse4.mm.bing.net/th/id/OIP.dGRqAVfNh90yVuDT5wIppgHaEo?rs=1&pid=ImgDetMain",
  },
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

interface WeatherCardProps {
  weather: any;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const [currentTime, setCurrentTime] = useState('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const updateTime = () => {
      setCurrentTime(formatTime(new Date()))
    }
    updateTime() // Set initial time
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Tauri' in window) {
      const appWindow = (window as any).__TAURI__.window.appWindow;
      const unlisten = appWindow.listen('tauri://move', ({ event, payload }) => {
        console.log('Window moved', payload);
      });

      return () => {
        unlisten.then((f: () => void) => f());
      };
    }
  }, []);

  if (!weather) return null

  const { main, description, temp, humidity, wind_speed, name, timeOfDay } = weather

  const getBackgroundGif = (weatherMain: string, timeOfDay: string) => {
    const condition = weatherGifs[weatherMain] || weatherGifs.Clear
    return condition[timeOfDay] || condition.day
  }

  return (
    <Card 
      isHoverable 
      isPressable 
      className="w-[350px] h-[500px] overflow-hidden rounded-3xl shadow-2xl cursor-move"
      style={{
        backgroundImage: `url(${getBackgroundGif(main, timeOfDay)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div 
        className="absolute top-0 left-0 w-full h-8 cursor-move" 
        data-tauri-drag-region
      />
      <CardHeader className="absolute z-10 top-2 left-2 flex-col items-start">
        <h4 className="font-bold text-3xl text-white drop-shadow-lg">{name.split(',')[0]}</h4>
        <p className="text-lg italic font-medium text-white/90 drop-shadow-lg tracking-wide">{capitalizeWords(description)}</p>
        <p className="text-sm text-white/90 drop-shadow-lg capitalize">{timeOfDay}</p>
        {isClient && (
          <p className="text-xl font-bold text-white drop-shadow-lg mt-2">{currentTime}</p>
        )}
      </CardHeader>
      <CardBody className="absolute z-10 bottom-16 left-2 p-2">
        <p className="text-7xl font-bold text-white drop-shadow-lg">{temp}°C</p>
      </CardBody>
      <CardFooter className="absolute z-10 bottom-2 right-2 flex-col items-end">
        <p className="text-white drop-shadow-lg text-lg">Humidity: {humidity}%</p>
        <p className="text-white drop-shadow-lg text-lg">Wind: {wind_speed} m/s</p>
      </CardFooter>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0" />
    </Card>
  )
}


