import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clarity - Online Therapy Platform',
  description: 'Find trusted and certified therapists. Take care of your mental health with Clarity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
