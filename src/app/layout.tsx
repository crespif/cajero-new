import type { Metadata } from 'next'
import { DM_Sans, Barlow } from 'next/font/google'
import './globals.css'
import Footer from './ui/footer'
import Header from './ui/header'
import { Toaster } from '@/components/ui/sonner'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  variable: '--font-barlow',
  weight: ['600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CELTA · Cajero Virtual',
  description: 'Cajero Virtual de CELTA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${barlow.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="flex h-[100dvh] flex-col items-center justify-between">
        <Header />
        {children}
        <Toaster />
        <Footer />
      </body>
    </html>
  )
}
