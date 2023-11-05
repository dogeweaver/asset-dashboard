import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/navbar/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

// console.log("Tokens component render")

export default function RootLayout({children}: {
  children: React.ReactNode
}) {
  return (
      <html className="h-full" lang="en">
      <body className="h-full flex bg-white">
      <Navbar />
      <div className="p-10 flex-1 overflow-y-scroll">
        {children}
      </div>
      </body>
      </html>
  )
}
