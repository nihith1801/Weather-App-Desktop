'use client'

import { CardHeader, CardBody, CardFooter } from "@nextui-org/card"
import { Button } from "@nextui-org/button"
import { useEffect, useState, useRef } from 'react'
import { Droplets, Wind, ChevronDown } from 'lucide-react'
import { gsap } from 'gsap'

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
  onShowForecast: () => void;
  onMinimize: () => void;
}

export function WeatherCard({ weather, onShowForecast, onMinimize }: WeatherCardProps) {
  const [currentTime, setCurrentTime] = useState('')
  const [isClient, setIsClient] = useState(false)
  const cardRef = useRef(null)
  const clickCount = useRef(0)
  const clickTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsClient(true)
    const updateTime = () => {
      setCurrentTime(formatTime(new Date()))
    }
    updateTime()
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

  useEffect(() => {
    gsap.from(cardRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out"
    });
  }, []);

  const handleClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (clickCount.current === 3) {
        onMinimize();
      }
      clickCount.current = 0;
    }, 300);
  };

  if (!weather) return null

  const { main, description, temp, humidity, wind_speed, name, timeOfDay } = weather

  const getBackgroundGif = (weatherMain: string, timeOfDay: string) => {
    const condition = weatherGifs[weatherMain] || weatherGifs.Clear
    return condition[timeOfDay] || condition.day
  }

  return (
    <div 
      ref={cardRef}
      className="w-[350px] h-[500px] overflow-hidden rounded-3xl shadow-2xl cursor-move font-roboto-mono relative"
      style={{
        backgroundImage: `url(${getBackgroundGif(main, timeOfDay)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handleClick}
    >
      <div 
        className="absolute top-0 left-0 w-full h-8 cursor-move" 
        data-tauri-drag-region
      />
      <div className="absolute z-10 top-2 left-2 flex-col items-start">
        <h4 className="font-bold text-3xl text-white drop-shadow-lg">{name.split(',')[0]}</h4>
        <p className="text-lg italic font-medium text-white/90 drop-shadow-lg tracking-wide">{capitalizeWords(description)}</p>
        <p className="text-sm text-white/90 drop-shadow-lg capitalize">{timeOfDay}</p>
        {isClient && (
          <p className="text-xl font-bold text-white drop-shadow-lg mt-2">{currentTime}</p>
        )}
      </div>
      <div className="absolute z-10 bottom-16 left-2 p-2">
        <p className="text-7xl font-bold text-white drop-shadow-lg">{temp}°C</p>
      </div>
      <div className="absolute z-10 bottom-2 right-2 flex-col items-end">
        <div className="flex items-center text-white drop-shadow-lg text-lg mb-1">
          <Droplets className="mr-2" size={20} />
          <span>Humidity: {humidity}%</span>
        </div>
        <div className="flex items-center text-white drop-shadow-lg text-lg">
          <Wind className="mr-2" size={20} />
          <span>Wind: {wind_speed} m/s</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0" />
      <Button
        className="absolute bottom-2 left-2 z-20 bg-white/20 hover:bg-white/30 text-white"
        onClick={(e) => {
          e.stopPropagation();
          onShowForecast();
        }}
      >
        <ChevronDown size={24} />
      </Button>
    </div>
  )
}


