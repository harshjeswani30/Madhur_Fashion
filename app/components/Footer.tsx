"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Clock, Star, Mail, Heart } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import Link from "next/link"

export default function Footer() {
  const { theme } = useTheme()
  
  return (
    <footer className={`relative ${
      theme === 'dark' ? 'bg-black/90' : 'bg-white/90'
    } backdrop-blur-xl border-t ${
      theme === 'dark' ? 'border-white/10' : 'border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Store Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3 className={`text-xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Madhur Fashion</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className={`h-5 w-5 mt-1 ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`} />
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Bhimganj Mandi<br />
                    Kota, Rajasthan 324002<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
                <a 
                  href="tel:+919982049645"
                  className={`text-sm hover:underline ${
                    theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  +91 99820 49645
                </a>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Daily: 10:00 AM onwards
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Star className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'
                }`} />
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  4.5/5 Google Rating
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className={`text-xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Quick Links</h3>
            
            <div className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Products", href: "/products" },
                { name: "AI Assistant", href: "/ai-assistant" },
                { name: "Virtual Showroom", href: "/showroom" },
                { name: "Admin Panel", href: "/admin" }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block text-sm transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className={`text-xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Our Services</h3>
            
            <div className="space-y-2">
              {[
                "AI-Powered Styling",
                "Virtual Try-On",
                "Personal Shopping",
                "Custom Tailoring",
                "Online & In-Store",
                "Quality Men's Wear"
              ].map((service) => (
                <p
                  key={service}
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {service}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Customer Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className={`text-xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Customer Reviews</h3>
            
            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  "Good quality based clothes"
                </p>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  - Deepesh C.
                </p>
              </div>
              
              <div className={`p-3 rounded-lg ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  "Staff is nice and well behaved"
                </p>
                <p className={`text-xs mt-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  - Raheem K.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`mt-12 pt-8 border-t ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                © 2025 Madhur Fashion. Made with
              </p>
              <Heart className="h-4 w-4 text-red-500" />
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                in Kota, Rajasthan
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://www.google.com/maps/place/Madhur+Fashion,+Men's+Wear/@25.2230215,75.8776575,17z"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm hover:underline ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Find us on Google Maps
              </a>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                |
              </span>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Bhimganj Mandi, Kota
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
