import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
})

export const metadata: Metadata = {
  title: "Power Flow Diagram",
  description: "Interactive power flow diagram showing energy distribution",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`bg-[#111217] ${roboto.variable}`}>
      <body className={`${roboto.className} bg-[#111217]`}>{children}</body>
    </html>
  )
}



import './globals.css'