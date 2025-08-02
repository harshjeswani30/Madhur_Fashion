"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ShoppingBag, User, Menu, X, Sun, Moon, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "./ThemeProvider"
import { useAuth } from "./AuthProvider"
import { useCart } from "./CartProvider"
import AuthModal from "./AuthModal"
import UserProfile from "./UserProfile"
import ShoppingCart from "./ShoppingCart"
import ChatBot from "./ChatBot"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PersistentNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout } = useAuth()
  const { getTotalItems } = useCart()
  const router = useRouter()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const navigationItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "products", label: "Products", href: "/products" },
    { id: "ai-assistant", label: "AI Assistant", href: "/ai-assistant" },
    { id: "showroom", label: "Showroom", href: "/showroom" },
  ]

  // Add admin navigation only for authenticated admin users
  if (isAuthenticated && (user?.role === "owner" || user?.role === "staff")) {
    navigationItems.push({ id: "admin", label: "Admin", href: "/admin" })
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    if (!user?.profileComplete) {
      setShowProfile(true)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  return (
    <>
      {/* New Creative Navigation Layout */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex justify-between items-start">
          {/* Left Navigation Box (1/4) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-xl border rounded-2xl p-4 shadow-lg bg-white/30 dark:bg-black/30 border-gray-200 dark:border-white/20"
          >
            <div className="flex items-center space-x-4">
              {[
                { id: "home", label: "Home", href: "/" },
                { id: "products", label: "Products", href: "/products" },
                { id: "ai-assistant", label: "AI Assistant", href: "/ai-assistant" },
                { id: "showroom", label: "Showroom", href: "/showroom" },
              ].map((item) => (
                <Link 
                  key={item.id} 
                  href={item.href}
                  className="px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
              {/* Admin link for authenticated users */}
              {isAuthenticated && (user?.role === "owner" || user?.role === "staff") && (
                <Link 
                  href="/admin"
                  className="px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                >
                  Admin
                </Link>
              )}
            </div>
          </motion.div>

          {/* Right Actions Box (3/4) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="backdrop-blur-xl border rounded-2xl p-4 shadow-lg bg-white/30 dark:bg-black/30 border-gray-200 dark:border-white/20"
          >
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                suppressHydrationWarning
              >
                {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
                {!mounted && <Sun className="h-5 w-5" />}
              </Button>

              {/* Shopping Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCart(true)}
                className="relative text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                suppressHydrationWarning
              >
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>

              {/* User Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                    suppressHydrationWarning
                  >
                    {user?.avatar ? (
                      <img src={user.avatar || "/placeholder.svg"} alt="Profile" className="w-6 h-6 rounded-full" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                  
                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 backdrop-blur-xl border rounded-lg shadow-lg z-50 bg-white/30 border-gray-200 dark:bg-black/30 dark:border-white/20"
                      >
                        <div className="py-2">
                          <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email}</p>
                            {user?.role && (
                              <p className="text-xs text-purple-400 capitalize">{user.role}</p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => {
                              setShowProfile(true)
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm flex items-center transition-colors text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                          >
                            <Settings className="mr-3 h-4 w-4" />
                            Profile Settings
                          </button>
                          
                          <button
                            onClick={() => {
                              logout()
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm flex items-center transition-colors text-gray-700 hover:text-red-600 hover:bg-red-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-red-500/20"
                          >
                            <LogOut className="mr-3 h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAuthModal(true)}
                  className="text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                  suppressHydrationWarning
                >
                  <User className="h-5 w-5" />
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                suppressHydrationWarning
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 backdrop-blur-xl border rounded-2xl p-4 bg-white/30 border-gray-200 dark:bg-black/30 dark:border-white/20"
            >
              <div className="space-y-2">
                {[
                  { id: "home", label: "Home", href: "/" },
                  { id: "products", label: "Products", href: "/products" },
                  { id: "ai-assistant", label: "AI Assistant", href: "/ai-assistant" },
                  { id: "showroom", label: "Showroom", href: "/showroom" },
                ].concat(
                  isAuthenticated && (user?.role === "owner" || user?.role === "staff") 
                    ? [{ id: "admin", label: "Admin", href: "/admin" }] 
                    : []
                ).map((item) => (
                  <Link 
                    key={item.id} 
                    href={item.href}
                    className="block px-3 py-2 rounded-lg transition-all duration-300 text-gray-700 hover:text-black hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals (controlled by PersistentNavigation now) */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <ShoppingCart isOpen={showCart} onClose={() => setShowCart(false)} />
      <ChatBot />
    </>
  )
}
