"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "./CartProvider"
import Link from "next/link" // Import Link for navigation

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-white/10 backdrop-blur-xl border-l border-white/20"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/20">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
                </div>
                <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
                    <h3 className="text-lg font-semibold text-white mb-2">Your cart is empty</h3>
                    <p className="text-gray-400 mb-4">Add some items to get started</p>
                    <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex space-x-4">
                          <div className="w-16 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                            <div className="flex space-x-2 mb-2">
                              {item.size && (
                                <Badge className="bg-gray-500/20 text-gray-300 text-xs">Size: {item.size}</Badge>
                              )}
                              {item.color && (
                                <Badge className="bg-gray-500/20 text-gray-300 text-xs">{item.color}</Badge>
                              )}
                            </div>
                            <p className="text-purple-400 font-bold">${item.price}</p>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                                  className="text-white hover:bg-white/10 w-8 h-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                                  className="text-white hover:bg-white/10 w-8 h-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.id, item.size, item.color)}
                                className="text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-white/20 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold text-purple-400">${getTotalPrice().toFixed(2)}</span>
                  </div>

                  <Link href="/cart" passHref>
                    <Button
                      onClick={onClose} // Close sidebar when navigating to full cart page
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" /> View Full Cart & Checkout{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-300 bg-transparent hover:bg-red-500/10"
                  >
                    Clear Cart
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
