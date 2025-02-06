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
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />       
      </head>
      <body className={`${inter.className} flex h-[100dvh] flex-col items-center justify-between bg-gray-50` } >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
