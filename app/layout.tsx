import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" })

export const metadata: Metadata = {
  title: "ScienceLab Educational Platform - Non-Profit Science Education",
  description:
    "Accessible virtual science experiments for Physics, Chemistry, and Biology. A 501(c)(3) non-profit making quality education available to all students worldwide.",
  generator: "v0.app",
  keywords: "science education, virtual experiments, non-profit, accessibility, WCAG, physics, chemistry, biology",
  authors: [{ name: "ScienceLab Educational Platform" }],
  openGraph: {
    title: "ScienceLab Educational Platform",
    description: "Non-profit virtual science education for all students",
    type: "website",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0066cc",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AccessibilityToolbar />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
