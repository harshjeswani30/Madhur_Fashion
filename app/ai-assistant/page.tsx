"use client"
import { motion } from "framer-motion"
import Enhanced3DAIAssistant from "../components/Enhanced3DAIAssistant"
import { useTheme } from "../components/ThemeProvider"

export default function AIAssistantPage() {
  const { theme } = useTheme()
  
  return (
    <div className="min-h-screen">
      {/* Hero Section with Card */}
      <div className="relative min-h-[60vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`mb-8 backdrop-blur-sm rounded-3xl p-8 border ${
              theme === 'dark' 
                ? 'bg-black/20 border-white/10' 
                : 'bg-white/80 border-gray-200/40'
            }`}
          >
            <h1 className={`text-4xl md:text-6xl font-extrabold mb-6 leading-tight`}>
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                AI Style Assistant
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-8 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}
            >
              Your personal stylist, powered by AI. Try on outfits, build looks, and get instant advice.
            </motion.p>
            
            {/* Feature Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className={`px-6 py-3 rounded-full backdrop-blur-sm ${
                theme === 'dark' 
                  ? 'bg-purple-500/20 border border-purple-400/30 text-purple-300' 
                  : 'bg-purple-100/80 border border-purple-300/60 text-purple-700'
              }`}>
                🎤 Voice Recognition
              </div>
              <div className={`px-6 py-3 rounded-full backdrop-blur-sm ${
                theme === 'dark' 
                  ? 'bg-blue-500/20 border border-blue-400/30 text-blue-300' 
                  : 'bg-blue-100/80 border border-blue-300/60 text-blue-700'
              }`}>
                🌍 Multilingual Support
              </div>
              <div className={`px-6 py-3 rounded-full backdrop-blur-sm ${
                theme === 'dark' 
                  ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
                  : 'bg-green-100/80 border border-green-300/60 text-green-700'
              }`}>
                👗 Fashion Expertise
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Assistant Interface */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-sm ${
          theme === 'dark' 
            ? 'bg-slate-800/20 border-purple-500/20' 
            : 'bg-white/10 border-gray-200/10'
        }`}>
          <Enhanced3DAIAssistant />
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-8 rounded-3xl shadow-xl border backdrop-blur-sm flex flex-col items-center ${
            theme === 'dark' 
              ? 'bg-black/20 border-white/10' 
              : 'bg-white/80 border-gray-200/40'
          }`}>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              3D Avatar Interaction
            </h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Interact with our lifelike 3D avatar powered by Ready Player Me technology for an immersive fashion consultation experience.
            </p>
          </div>

          <div className={`p-8 rounded-3xl shadow-xl border backdrop-blur-sm flex flex-col items-center ${
            theme === 'dark' 
              ? 'bg-black/20 border-white/10' 
              : 'bg-white/80 border-gray-200/40'
          }`}>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Smart Recommendations
            </h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get personalized fashion recommendations based on your preferences, body type, and current trends.
            </p>
          </div>

          <div className={`p-8 rounded-3xl shadow-xl border backdrop-blur-sm flex flex-col items-center ${
            theme === 'dark' 
              ? 'bg-black/20 border-white/10' 
              : 'bg-white/80 border-gray-200/40'
          }`}>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Natural Conversation
            </h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Chat naturally in English or Hindi with voice input and audio responses for a seamless experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
