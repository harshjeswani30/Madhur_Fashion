"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Trash2, Shirt, Scissors, Watch, Sparkles, Loader2 } from "lucide-react" // Import Loader2

// Mock data for outfit categories and items
const outfitCategories = [
  {
    id: "top",
    name: "Tops",
    icon: Shirt,
    items: [
      { id: "t1", name: "White Dress Shirt", image: "/placeholder.svg?height=100&width=100", price: 59.99 },
      { id: "t2", name: "Navy Polo", image: "/placeholder.svg?height=100&width=100", price: 45.0 },
      { id: "t3", name: "Striped T-Shirt", image: "/placeholder.svg?height=100&width=100", price: 29.99 },
    ],
  },
  {
    id: "bottom",
    name: "Bottoms",
    icon: Scissors,
    items: [
      { id: "b1", name: "Black Slim Fit Trousers", image: "/placeholder.svg?height=100&width=100", price: 89.99 },
      { id: "b2", name: "Khaki Chinos", image: "/placeholder.svg?height=100&width=100", price: 75.0 },
      { id: "b3", name: "Dark Wash Jeans", image: "/placeholder.svg?height=100&width=100", price: 95.0 },
    ],
  },
  {
    id: "accessory",
    name: "Accessories",
    icon: Watch,
    items: [
      { id: "a1", name: "Leather Belt", image: "/placeholder.svg?height=100&width=100", price: 35.0 },
      { id: "a2", name: "Pocket Square", image: "/placeholder.svg?height=100&width=100", price: 15.0 },
      { id: "a3", name: "Classic Watch", image: "/placeholder.svg?height=100&width=100", price: 199.99 },
    ],
  },
]

interface OutfitItem {
  id: string
  name: string
  image: string
  price: number
  category: string
}

export default function OutfitBuilder() {
  const [selectedItems, setSelectedItems] = useState<OutfitItem[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleAddItem = (categoryId: string, itemId: string) => {
    const category = outfitCategories.find((cat) => cat.id === categoryId)
    const item = category?.items.find((i) => i.id === itemId)
    if (item) {
      const newItem = { ...item, category: category?.name || "" }
      setSelectedItems((prev) => {
        // Replace item if same category, otherwise add
        const existingIndex = prev.findIndex((i) => i.category === newItem.category)
        if (existingIndex > -1) {
          const newItems = [...prev]
          newItems[existingIndex] = newItem
          return newItems
        }
        return [...prev, newItem]
      })
    }
  }

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  // Calculate total price whenever selectedItems changes
  useState(() => {
    const newTotalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0)
    setTotalPrice(newTotalPrice)
  }, [selectedItems])

  const handleGenerateRecommendation = () => {
    setLoading(true)
    // Simulate AI generating a full outfit
    setTimeout(() => {
      const recommendedOutfit: OutfitItem[] = [
        {
          id: "t1",
          name: "White Dress Shirt",
          image: "/placeholder.svg?height=100&width=100",
          price: 59.99,
          category: "Tops",
        },
        {
          id: "b1",
          name: "Black Slim Fit Trousers",
          image: "/placeholder.svg?height=100&width=100",
          price: 89.99,
          category: "Bottoms",
        },
        {
          id: "a1",
          name: "Leather Belt",
          image: "/placeholder.svg?height=100&width=100",
          price: 35.0,
          category: "Accessories",
        },
      ]
      setSelectedItems(recommendedOutfit)
      setLoading(false)
    }, 1500)
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Outfit Builder
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-300 mb-10 text-center max-w-2xl mx-auto"
      >
        Mix and match pieces to create your perfect look, or let our AI suggest an outfit for you.
      </motion.p>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Outfit Selection Panel */}
        <Card className="bg-white/5 border-purple-500/30 shadow-lg p-6 space-y-6">
          <CardTitle className="text-white flex items-center gap-2">
            <Shirt className="h-6 w-6 text-purple-400" /> Build Your Outfit
          </CardTitle>
          {outfitCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <Label htmlFor={`${category.id}-select`} className="text-gray-300 flex items-center gap-2">
                <category.icon className="h-4 w-4" /> {category.name}
              </Label>
              <Select onValueChange={(itemId) => handleAddItem(category.id, itemId)}>
                <SelectTrigger id={`${category.id}-select`} className="w-full bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder={`Select a ${category.name.toLowerCase().slice(0, -1)}`} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {category.items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - ${item.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <Button
            onClick={handleGenerateRecommendation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> AI Outfit Suggestion
              </>
            )}
          </Button>
        </Card>

        {/* Current Outfit Display */}
        <Card className="bg-white/5 border-purple-500/30 shadow-lg p-6 space-y-6">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" /> Your Current Outfit
          </CardTitle>
          <div className="space-y-4">
            {selectedItems.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p className="text-lg">Start building your outfit!</p>
                <p className="text-sm mt-2">Select items from the left panel.</p>
              </div>
            ) : (
              selectedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-4 bg-white/10 p-3 rounded-lg border border-white/10"
                >
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{item.name}</h3>
                    <p className="text-gray-300 text-sm">{item.category}</p>
                    <p className="text-purple-400 font-bold">${item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:bg-red-400/20"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))
            )}
          </div>
          <div className="border-t border-purple-500/30 pt-4 mt-auto">
            <div className="flex justify-between items-center text-white text-xl font-bold mb-4">
              <span>Total Price:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={selectedItems.length === 0}
              onClick={() => alert("Add to cart functionality coming soon!")}
            >
              Add Outfit to Cart
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
