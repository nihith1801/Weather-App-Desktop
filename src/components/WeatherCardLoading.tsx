'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card } from "@nextui-org/card"
import { gsap } from 'gsap'

export function WeatherCardLoading() {
  const [progress, setProgress] = useState(0)
  const circleRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1
        if (newProgress > 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 60)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    gsap.to(circleRef.current, {
      rotation: progress * 3.6,
      duration: 0.1,
      ease: "none"
    })
  }, [progress])

  return (
    <Card className="w-[350px] h-[500px] overflow-hidden shadow-2xl bg-gray-900 dark:bg-gray-950">
      <div className="relative w-full h-full flex items-center justify-center">
        <div 
          ref={circleRef}
          className="w-40 h-40 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, #d196dd 0%, #fd954e 100%)',
            clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)',
            transform: 'rotate(-90deg)',
          }}
        />
        <div 
          className="absolute w-36 h-36 rounded-full bg-gray-900 dark:bg-gray-950"
        />
        <div 
          ref={textRef}
          className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold mix-blend-difference"
          style={{ fontFamily: 'Cousine, monospace' }}
        >
          {progress}%
        </div>
      </div>
    </Card>
  )
}



