"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star } from "lucide-react"
import { useCart } from "./CartProvider"
import { useTheme } from "./ThemeProvider"
import AddToCartAnimation from "./AddToCartAnimation"

// Placeholder product data
const featuredProducts = [
  {
    id: "fp1",
    name: "Luxury Silk Suit",
    price: 1299.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 85,
  },
  {
    id: "fp2",
    name: "Tailored Linen Blazer",
    price: 349.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 110,
  },
  {
    id: "fp3",
    name: "Handcrafted Leather Loafers",
    price: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 90,
  },
  {
    id: "fp4",
    name: "Designer Polo Shirt",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 150,
  },
]

export default function FeaturedProducts() {
  const { addToCart } = useCart()
  const { theme } = useTheme()
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 })
  const [animatedProduct, setAnimatedProduct] = useState<(typeof featuredProducts)[0] | null>(null)

  const handleAddToCart = (product: (typeof featuredProducts)[0], event: React.MouseEvent<HTMLButtonElement>) => {
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
        className="text-4xl md:text-5xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400"
      >
        Featured Products
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
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
                <div className={`flex items-center text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>
                    {product.rating.toFixed(1)} ({product.reviews} reviews)
                  </span>
                </div>
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
      </div>
      {animatedProduct && (
        <AddToCartAnimation show={showAnimation} position={animationPosition} product={animatedProduct} />
      )}
    </section>
  )
}
