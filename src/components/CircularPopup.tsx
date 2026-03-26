'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface CircularPopupProps {
  temp: number;
  onExpand: () => void;
}

export function CircularPopup({ temp, onExpand }: CircularPopupProps) {
  const popupRef = useRef(null)
  const clickCount = useRef(0)
  const clickTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    gsap.from(popupRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
  }, []);

  const handleClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (clickCount.current === 3) {
        onExpand();
      }
      clickCount.current = 0;
    }, 300);
  };

  return (
    <div 
      ref={popupRef}
      className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer shadow-lg"
      onClick={handleClick}
    >
      <p className="text-2xl font-bold text-white">{temp}°C</p>
    </div>
  )
}

