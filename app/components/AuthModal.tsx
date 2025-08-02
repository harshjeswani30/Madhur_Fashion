"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Loader2 } from "lucide-react" // Import Loader2
import { useAuth } from "./AuthProvider"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login, register, adminLogin } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (activeTab === "admin") {
        await adminLogin(email, password)
      } else {
        await login(email, password)
      }
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register(username, email, password)
      onSuccess?.()
      onClose()
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setPassword("")
    setUsername("")
    setError(null)
    setLoading(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg"
          >
            <Card className="bg-transparent border-none text-white">
              <CardHeader className="relative pb-0">
                <CardTitle className="text-2xl text-center text-white">Welcome to Madhur Fashion</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  Sign in or create an account to continue.
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                    <TabsTrigger value="login" className="text-white data-[state=active]:bg-purple-600">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="register" className="text-white data-[state=active]:bg-purple-600">
                      Register
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="text-white data-[state=active]:bg-purple-600">
                      Admin
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="login" className="mt-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="m.fashion@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="login-password" className="text-gray-300">
                          Password
                        </Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="register" className="mt-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="register-username" className="text-gray-300">
                          Username
                        </Label>
                        <Input
                          id="register-username"
                          type="text"
                          placeholder="madhur_user"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-email" className="text-gray-300">
                          Email
                        </Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="m.fashion@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-password" className="text-gray-300">
                          Password
                        </Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  <TabsContent value="admin" className="mt-4">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-2">Admin Access</h3>
                        <p className="text-sm text-gray-400 mb-4">Enter your admin credentials to access the dashboard</p>
                      </div>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                          <Label htmlFor="admin-email" className="text-gray-300">
                            Email
                          </Label>
                          <Input
                            id="admin-email"
                            type="email"
                            placeholder="Enter your admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="admin-password" className="text-gray-300">
                            Password
                          </Label>
                          <Input
                            id="admin-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                          />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                            </>
                          ) : (
                            "Admin Login"
                          )}
                        </Button>
                      </form>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-center text-sm text-gray-400">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
