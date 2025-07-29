import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'KCBNet - Internet Fiber Optic Provider',
  description: 'Penyedia layanan internet fiber optic terpercaya untuk rumah dan bisnis. Unlimited, stabil, dan support 24/7.',
  generator: 'KCBNet.id',
  keywords: ['internet fiber', 'provider internet', 'fiber optic', 'internet karawang', 'kcbnet', 'internet unlimited'],
  authors: [{ name: 'KCBNet Team' }],
  creator: 'KCBNet.id',
  publisher: 'CV. Kemilau Cahaya Barokah',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
