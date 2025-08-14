import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
})

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Dashboard Ekonomi Kreatif Jawa Barat",
  description: "Dashboard analitik komprehensif untuk data ekonomi kreatif Jawa Barat",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${geist.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
