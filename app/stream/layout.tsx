import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KCBNet IPTV - Live TV Streaming',
  description: 'Nikmati layanan IPTV streaming langsung dari KCBNet. Tonton saluran TV favorit Anda dengan kualitas HD.',
  keywords: ['iptv', 'live tv', 'streaming', 'television', 'kcbnet', 'tv online'],
}

export default function StreamLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
