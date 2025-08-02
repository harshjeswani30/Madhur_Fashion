import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/ThemeProvider"
import { AuthProvider } from "./components/AuthProvider"
import { CartProvider } from "./components/CartProvider"
import PersistentNavigation from "./components/PersistentNavigation" // Import the new navigation component
import ClientVantaBackground from "./components/ClientVantaBackground"
import Footer from "./components/Footer"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Madhur Fashion - Where Elegance Meets Intelligence",
  description: "Discover exquisite menswear, personalized styling, and a revolutionary virtual try-on experience.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* Load Vanta.js dependencies */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js"
          strategy="beforeInteractive"
        />
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen relative">
                {/* Animated Background - WAVES for Light Theme, NET for Dark Theme */}
                <ClientVantaBackground />
                
                {/* Content with higher z-index */}
                <div className="relative z-10">
                {/* Persistent Navigation */}
                <PersistentNavigation />

                {/* Main Content with proper spacing for navigation */}
                <main className="pt-16">{children}</main>
                
                {/* Footer with real business information */}
                <Footer />
                </div>
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
