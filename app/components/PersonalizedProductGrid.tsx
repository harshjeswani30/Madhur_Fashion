"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ShoppingBag, Star, Loader2 } from "lucide-react" // Corrected import for Loader2
import { useCart } from "./CartProvider"
import AddToCartAnimation from "./AddToCartAnimation"

// Placeholder product data
const products = [
  {
    id: "1",
    name: "Classic Fit Suit",
    price: 799.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Suits",
    rating: 4.5,
    reviews: 120,
  },
  {
    id: "2",
    name: "Slim Fit Chinos",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Pants",
    rating: 4.2,
    reviews: 85,
  },
  {
    id: "3",
    name: "Premium Cotton Shirt",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Shirts",
    rating: 4.8,
    reviews: 210,
  },
  {
    id: "4",
    name: "Leather Derby Shoes",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Footwear",
    rating: 4.6,
    reviews: 95,
  },
  {
    id: "5",
    name: "Wool Blend Blazer",
    price: 299.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Jackets",
    rating: 4.3,
    reviews: 70,
  },
  {
    id: "6",
    name: "Casual Denim Jeans",
    price: 79.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Pants",
    rating: 4.0,
    reviews: 150,
  },
  {
    id: "7",
    name: "Silk Tie Collection",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Accessories",
    rating: 4.7,
    reviews: 60,
  },
  {
    id: "8",
    name: "Sport Coat",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Jackets",
    rating: 4.4,
    reviews: 110,
  },
]

export default function PersonalizedProductGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("price-asc")
  const [loading, setLoading] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationPosition, setAnimationPosition] = useState({ x: 0, y: 0 })

  const { addToCart } = useCart()

  const categories = ["all", "Suits", "Pants", "Shirts", "Footwear", "Jackets", "Accessories"]

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price
      } else if (sortBy === "price-desc") {
        return b.price - a.price
      } else if (sortBy === "rating-desc") {
        return b.rating - a.rating
      }
      return 0
    })

  const handleAddToCart = (product: (typeof products)[0], event: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(product)
    const rect = event.currentTarget.getBoundingClientRect()
    setAnimationPosition({ x: rect.left, y: rect.top })
    setShowAnimation(true)
    setTimeout(() => setShowAnimation(false), 1000) // Animation duration
  }

  // Simulate loading for filter/sort changes
  const handleFilterChange = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Personalized Collection
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-300 mb-10 text-center max-w-2xl mx-auto"
      >
        Recommendations tailored just for you.
      </motion.p>

      {/* Filters and Sort */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              handleFilterChange()
            }}
            className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            setSelectedCategory(value)
            handleFilterChange()
          }}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value)
            handleFilterChange()
          }}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating-desc">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-400"
            >
              <p className="text-lg">No products found matching your criteria.</p>
            </motion.div>
          ) : (
            <motion.div
              key={filteredProducts.map((p) => p.id).join("-")} // Key for AnimatePresence
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-white/5 border-purple-500/30 shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300"
                >
                  <CardHeader className="p-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg font-semibold text-white mb-2">{product.name}</CardTitle>
                    <p className="text-purple-400 font-bold text-xl mb-2">${product.price.toFixed(2)}</p>
                    <div className="flex items-center text-sm text-gray-400">
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
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <AddToCartAnimation show={showAnimation} position={animationPosition} />
    </section>
  )
}
