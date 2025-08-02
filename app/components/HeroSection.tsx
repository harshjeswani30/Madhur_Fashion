"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Star, Zap, Heart } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import Link from "next/link"

export default function HeroSection() {
  const { theme } = useTheme()
  
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Logo positioned within hero section */}
      <div className="absolute top-12 left-[-2rem] z-50">
        <img 
          src="/Pink and Red Modern Personal Logo.png" 
          alt="Madhur Fashion Logo" 
          className="h-96 w-96 object-contain"
        />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-40 right-20 w-32 h-32 bg-pink-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"
        />
        
        {/* Floating Icons */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            x: [0, 10, 0],
          }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-32 right-1/4 text-purple-400/30"
        >
          <Star size={24} />
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, 25, 0],
            x: [0, -15, 0],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-40 left-1/3 text-pink-400/30"
        >
          <Heart size={32} />
        </motion.div>
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-1/2 right-10 text-blue-400/30"
        >
          <Zap size={28} />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center pt-24">
        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`mb-8 backdrop-blur-sm rounded-3xl p-8 ${
            theme === 'dark' 
              ? 'bg-black/20 border border-white/10' 
              : 'bg-white/60 border border-gray-200/40'
          }`}
        >
          <h1 className={`text-6xl md:text-8xl font-extrabold mb-4 leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            <motion.span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Madhur Fashion
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            Where elegance meets artificial intelligence. Serving quality men's fashion from our store in 
            <span className="text-orange-600 font-semibold"> Bhimganj Mandi, Kota</span>, we bring you 
            <span className="text-purple-600 font-semibold"> AI-powered styling</span>, 
            <span className="text-pink-600 font-semibold"> virtual try-ons</span>, and 
            <span className="text-blue-600 font-semibold"> personalized recommendations</span>.
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
        >
          {[
            {
              icon: <Sparkles className="h-8 w-8" />,
              title: "AI Styling",
              description: "Get personalized outfit recommendations powered by advanced AI",
              color: theme === 'dark' 
                ? "from-purple-500/40 to-purple-600/40 border-purple-400/50" 
                : "from-purple-100/80 to-purple-200/80 border-purple-300/60"
            },
            {
              icon: <Star className="h-8 w-8" />,
              title: "Virtual Try-On",
              description: "See how clothes look on you before you buy with AR technology",
              color: theme === 'dark' 
                ? "from-pink-500/40 to-pink-600/40 border-pink-400/50" 
                : "from-pink-100/80 to-pink-200/80 border-pink-300/60"
            },
            {
              icon: <Heart className="h-8 w-8" />,
              title: "Smart Curation",
              description: "Discover unique pieces curated just for your style preferences",
              color: theme === 'dark' 
                ? "from-blue-500/40 to-blue-600/40 border-blue-400/50" 
                : "from-blue-100/80 to-blue-200/80 border-blue-300/60"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`backdrop-blur-xl bg-gradient-to-br ${feature.color} border rounded-2xl p-6 text-left hover:shadow-2xl transition-all duration-300`}
            >
              <div className={`mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-700'
              }`}>{feature.icon}</div>
              <h3 className={`font-bold text-lg mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{feature.title}</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/products">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Explore Collection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/ai-assistant">
            <Button 
              variant="outline" 
              size="lg" 
              className={`px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300 ${
                theme === 'dark' 
                  ? 'border-white/50 text-white hover:bg-white/20' 
                  : 'border-gray-400 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Try AI Stylist
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className={`mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto backdrop-blur-sm rounded-2xl p-6 ${
            theme === 'dark' 
              ? 'bg-black/20 border border-white/10' 
              : 'bg-white/30 border border-gray-200/30'
          }`}
        >
          {[
            { number: "4.5⭐", label: "Google Rating" },
            { number: "Kota", label: "Rajasthan Store" },
            { number: "10AM", label: "Daily Opening" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl md:text-3xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{stat.number}</div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 ${
          theme === 'dark' ? 'text-white/50' : 'text-gray-400'
        }`}
      >
        <div className={`w-6 h-10 border-2 rounded-full flex justify-center ${
          theme === 'dark' ? 'border-white/30' : 'border-gray-300'
        }`}>
          <div className={`w-1 h-3 rounded-full mt-2 ${
            theme === 'dark' ? 'bg-white/50' : 'bg-gray-400'
          }`}></div>
        </div>
      </motion.div>
    </section>
  )
}
