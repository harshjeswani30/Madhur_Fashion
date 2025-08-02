"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import VirtualShowroom from "./components/VirtualShowroom"
import AIStyleAssistant from "./components/AIStyleAssistant"
import VirtualTryOn from "./components/VirtualTryOn"
import OutfitBuilder from "./components/OutfitBuilder"
import ProductGrid from "./components/ProductGrid"
import AdminPanel from "./components/AdminPanel"
import { useAuth } from "./components/AuthProvider"
import { useTheme } from "./components/ThemeProvider"
import HeroSection from "./components/HeroSection"
import FeaturedProducts from "./components/FeaturedProducts"
import AIRecommendations from "./components/AIRecommendations"
import Enhanced3DAIAssistant from "./components/Enhanced3DAIAssistant"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home")

  const { user, isAuthenticated } = useAuth()
  const { theme } = useTheme()

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          {activeSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <HeroSection />
              <FeaturedProducts />
              <AIRecommendations />
              <Enhanced3DAIAssistant />
            </motion.div>
          )}

          {activeSection === "showroom" && (
            <motion.div
              key="showroom"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <VirtualShowroom />
            </motion.div>
          )}

          {activeSection === "try-on" && (
            <motion.div
              key="try-on"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <VirtualTryOn />
            </motion.div>
          )}

          {activeSection === "builder" && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <OutfitBuilder />
            </motion.div>
          )}

          {activeSection === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGrid />
            </motion.div>
          )}

          {activeSection === "admin" && isAuthenticated && (user?.role === "owner" || user?.role === "staff") && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <AdminPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* AI Style Assistant - Always Available */}
      <AIStyleAssistant />
    </div>
  )
}
