"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: any, size?: string, color?: string) => void
  removeFromCart: (id: string, size?: string, color?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void
  getTotalPrice: () => number
  getTotalItems: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem("madhurFashionCart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("madhurFashionCart", JSON.stringify(cartItems))
  }, [cartItems])

  const findCartItemIndex = useCallback(
    (id: string, size?: string, color?: string) => {
      return cartItems.findIndex((item) => item.id === id && item.size === size && item.color === color)
    },
    [cartItems],
  )

  const addToCart = useCallback(
    (product: any, size?: string, color?: string) => {
      setCartItems((prevItems) => {
        const existingItemIndex = findCartItemIndex(product.id, size, color)

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems]
          updatedItems[existingItemIndex].quantity += 1
          return updatedItems
        } else {
          return [...prevItems, { ...product, quantity: 1, size, color }]
        }
      })
    },
    [findCartItemIndex],
  )

  const removeFromCart = useCallback((id: string, size?: string, color?: string) => {
    setCartItems((prevItems) => {
      return prevItems.filter((item) => !(item.id === id && item.size === size && item.color === color))
    })
  }, [])

  const updateQuantity = useCallback(
    (id: string, quantity: number, size?: string, color?: string) => {
      setCartItems((prevItems) => {
        const existingItemIndex = findCartItemIndex(id, size, color)

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems]
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            return updatedItems.filter((item) => !(item.id === id && item.size === size && item.color === color))
          }
          updatedItems[existingItemIndex].quantity = quantity
          return updatedItems
        }
        return prevItems
      })
    },
    [findCartItemIndex],
  )

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cartItems])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }, [cartItems])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
