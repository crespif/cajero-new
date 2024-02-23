import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from './ui/footer'
import Header from './ui/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CELTA',
  description: 'Cajero Virtual de CELTA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen flex-col items-center justify-between p-5 bg-gray-100 overflow-hidden` } >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
