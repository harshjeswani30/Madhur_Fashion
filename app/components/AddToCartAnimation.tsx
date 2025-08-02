"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Check, ShoppingBag } from "lucide-react"

interface AddToCartAnimationProps {
  product: any
  show: boolean
  position: { x: number; y: number }
}

export default function AddToCartAnimation({ product, show, position }: AddToCartAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (product) {
      setShowAnimation(true)
      const timer = setTimeout(() => {
        setShowAnimation(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [product])

  return (
    <AnimatePresence>
      {showAnimation && product && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 pointer-events-none"
          />

          {/* Animation Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 text-center max-w-sm">
              {/* Product Image */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Cart Icon Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <ShoppingCart className="h-8 w-8 text-white" />
                </motion.div>
              </motion.div>

              {/* Success Message */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                <div className="flex items-center justify-center mb-2">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <span className="text-green-400 font-semibold">Added to Cart!</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{product.nameHindi}</p>
                <p className="text-purple-400 font-bold">
                  Size: {product.selectedSize} | ₹{product.price?.toLocaleString()}
                </p>
              </motion.div>

              {/* Floating Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    scale: 0,
                    x: 0,
                    y: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                    y: Math.sin((i * 60 * Math.PI) / 180) * 60,
                  }}
                  transition={{
                    delay: 0.5 + i * 0.1,
                    duration: 1.5,
                  }}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Cart Icon Bounce Animation */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="fixed top-4 right-20 z-50 pointer-events-none"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
          </motion.div>
        </>
      )}

      {show && (
        <motion.div
          initial={{ opacity: 1, scale: 1, x: position.x, y: position.y }}
          animate={{
            opacity: 0,
            scale: 0.5,
            y: position.y - 100, // Fly upwards
            x: position.x + 50, // Fly slightly to the side
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed z-[100] pointer-events-none"
        >
          <ShoppingBag className="h-8 w-8 text-purple-400" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
