"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, Store, Truck, CheckCircle, Loader2 } from "lucide-react"
import { useCart } from "../components/CartProvider"
import { useTheme } from "../components/ThemeProvider"
import { useRouter, useSearchParams } from "next/navigation" // Import useSearchParams

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart()
  const { theme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams() // Use useSearchParams to read URL parameters
  const [checkoutOption, setCheckoutOption] = useState<"showroom" | "online">("online")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const status = searchParams.get("status")
    if (status === "success") {
      setCheckoutMessage("Your order was placed successfully! You will receive a confirmation email shortly.")
      clearCart()
    } else if (status === "cancel") {
      setCheckoutMessage("Your payment was cancelled. You can try again or choose showroom pickup.")
      setError("Payment cancelled.")
    }
  }, [searchParams, clearCart])

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setCheckoutMessage("Your cart is empty!")
      setError("Your cart is empty!")
      return
    }

    setIsLoading(true)
    setError(null) // Clear previous errors

    if (checkoutOption === "showroom") {
      // Simulate showroom pickup order placement
      setTimeout(() => {
        setCheckoutMessage("Order confirmed for showroom pickup! Payment will be collected at the showroom. Thank you!")
        clearCart()
        setIsLoading(false)
      }, 1500)
    } else {
      // Online payment and delivery
      if (!deliveryAddress.trim()) {
        setError("Please enter a delivery address.")
        setIsLoading(false)
        return
      }
      try {
        const response = await fetch("/api/stripe-checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            deliveryAddress: deliveryAddress,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create checkout session.")
        }

        const { url } = await response.json()
        window.location.href = url // Redirect to Stripe Checkout
        // Cart will be cleared on success page via useEffect
      } catch (err: any) {
        console.error("Checkout error:", err)
        setCheckoutMessage(`Checkout failed: ${err.message || "An unexpected error occurred."}`)
        setError(err.message || "An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen pt-16">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Your Shopping Cart
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-300 mb-10 text-center max-w-2xl"
      >
        Review your items and choose your checkout method.
      </motion.p>

      <Card className="w-full max-w-3xl bg-slate-900 border-purple-500/30 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-purple-400" /> Cart Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {checkoutMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10 px-4"
            >
              <CheckCircle className="h-20 w-20 text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Order Status</h3>
              <p className="text-lg text-gray-300">{checkoutMessage}</p>
              <Button onClick={() => router.push("/")} className="mt-8 bg-purple-600 hover:bg-purple-700 text-white">
                Continue Shopping
              </Button>
            </motion.div>
          ) : (
            <>
              <ScrollArea className="h-80 pr-4 mb-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-lg">Your cart is empty!</p>
                    <p className="text-sm mt-2">Start adding some amazing products.</p>
                    <Button onClick={() => router.push("/products")} className="mt-4 bg-purple-600 hover:bg-purple-700">
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-white/10"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md border border-white/20"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <p className="text-gray-300 text-sm">
                            {item.size && `Size: ${item.size}, `}
                            {item.color && `Color: ${item.color}`}
                          </p>
                          <p className="text-purple-400 font-bold">₹{item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 text-white border-white/30 hover:bg-white/10 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, Number.parseInt(e.target.value), item.size, item.color)
                              }
                              className="w-16 text-center bg-white/10 border-white/20 text-white"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 text-white border-white/30 hover:bg-white/10 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:bg-red-400/20"
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <Separator className="my-6 bg-white/20" />

              <div className="flex items-center justify-between text-white text-xl font-bold mb-4">
                <span>Total:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Choose Checkout Method:</h3>
                <RadioGroup
                  value={checkoutOption}
                  onValueChange={(value: "showroom" | "online") => setCheckoutOption(value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="online-payment"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-white/20 bg-white/5 p-4 hover:bg-white/10 cursor-pointer data-[state=checked]:border-purple-500"
                  >
                    <RadioGroupItem value="online" id="online-payment" className="sr-only" />
                    <CreditCard className="mb-2 h-6 w-6 text-purple-400" />
                    <span className="text-white font-medium">Online Payment & Delivery</span>
                  </Label>
                  <Label
                    htmlFor="showroom-pickup"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-white/20 bg-white/5 p-4 hover:bg-white/10 cursor-pointer data-[state=checked]:border-purple-500"
                  >
                    <RadioGroupItem value="showroom" id="showroom-pickup" className="sr-only" />
                    <Store className="mb-2 h-6 w-6 text-purple-400" />
                    <span className="text-white font-medium">Take in Service (Pay at Showroom)</span>
                  </Label>
                </RadioGroup>

                {checkoutOption === "online" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2"
                  >
                    <Label htmlFor="delivery-address" className="text-gray-300 flex items-center gap-2">
                      <Truck className="h-4 w-4" /> Delivery Address
                    </Label>
                    <Input
                      id="delivery-address"
                      placeholder="Enter your delivery address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </motion.div>
                )}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center mt-4"
                >
                  {error}
                </motion.p>
              )}

              <Button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-3 mt-6"
                disabled={cartItems.length === 0 || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : checkoutOption === "showroom" ? (
                  <>
                    <Store className="mr-2 h-5 w-5" /> Confirm Showroom Pickup
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" /> Proceed to Online Payment
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-full mt-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
                disabled={cartItems.length === 0 || isLoading}
              >
                Clear Cart
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
