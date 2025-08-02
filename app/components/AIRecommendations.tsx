"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, RefreshCw, Star, Loader2 } from "lucide-react" // Corrected import for Loader2
import { useCart } from "./CartProvider"
import { useTheme } from "./ThemeProvider"
import AddToCartAnimation from "./AddToCartAnimation"

// Placeholder recommendation data
const initialRecommendations = [
  {
    id: "r1",
    name: "Smart Casual Blazer",
    price: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    reason: "Based on your recent views of blazers and shirts.",
    rating: 4.6,
  },
  {
    id: "r2",
    name: "Comfort Fit Trousers",
    price: 99.99,
    image: "/placeholder.svg?height=300&width=300",
    reason: "Pairs well with items in your wishlist.",
    rating: 4.4,
  },
  {
    id: "r3",
    name: "Minimalist Leather Wallet",
    price: 69.99,
    image: "/placeholder.svg?height=300&width=300",
    reason: "A popular accessory among similar shoppers.",
    rating: 4.7,
  },
]

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState(initialRecommendations)
  const [loading, setLoading] = useState(false)
  const { addToCart } = useCart()
  const { theme } = useTheme()
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 })
  const [animatedProduct, setAnimatedProduct] = useState<(typeof initialRecommendations)[0] | null>(null)

  const generateNewRecommendations = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newRecs = initialRecommendations.sort(() => 0.5 - Math.random()).slice(0, 3)
      setRecommendations(newRecs)
      setLoading(false)
    }, 1000)
  }

  const handleAddToCart = (product: (typeof initialRecommendations)[0], event: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(product)
    setAnimatedProduct(product)
    const rect = event.currentTarget.getBoundingClientRect()
    setAnimationPosition({ x: rect.left, y: rect.top })
    setShowAnimation(true)
    setTimeout(() => setShowAnimation(false), 1000) // Animation duration
  }

  return (
    <section className={`py-16 px-4 ${
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        AI-Powered Recommendations
      </motion.h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
        </div>
      ) : (
        <motion.div
          key={recommendations.map((r) => r.id).join("-")} // Key for AnimatePresence
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {recommendations.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`border shadow-lg transition-shadow duration-300 h-full flex flex-col ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-purple-500/30 hover:shadow-purple-500/30' 
                  : 'bg-white border-gray-200 hover:shadow-lg'
              }`}>
                <CardHeader className="p-0">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-60 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <CardTitle className={`text-lg font-semibold mb-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>{product.name}</CardTitle>
                  <p className="text-purple-400 font-bold text-xl mb-2">${product.price.toFixed(2)}</p>
                  <div className={`flex items-center text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{product.rating.toFixed(1)} Rating</span>
                  </div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>{product.reason}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="text-center mt-12">
        <Button
          onClick={generateNewRecommendations}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        >
          <RefreshCw className="mr-2 h-5 w-5" /> Get New Recommendations
        </Button>
      </div>
      {animatedProduct && (
        <AddToCartAnimation show={showAnimation} position={animationPosition} product={animatedProduct} />
      )}
    </section>
  )
}
