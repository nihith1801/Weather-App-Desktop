'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from "./providers"
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Add any client-side only classes here
    document.body.classList.add('vsc-initialized')
  }, [])

  return (
    <html lang="en" className="dark">
      <head>
        <title>Weather App</title>
        <meta name="description" content="A creative weather app with card effects" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Noto+Serif+Telugu:wght@100..900&family=Cousine:wght@700&display=swap" rel="stylesheet" />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body className={`${inter.className} bg-gray-900 dark:bg-gray-950 min-h-screen`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}




