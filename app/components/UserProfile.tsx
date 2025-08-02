"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Camera, Save, LogOut, Loader2 } from "lucide-react" // Import Loader2
import { useAuth } from "./AuthProvider"

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, updateUserProfile, logout } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [avatar, setAvatar] = useState(user?.avatar || "/placeholder.svg?height=100&width=100")
  const [measurements, setMeasurements] = useState(user?.measurements || { size: "M", height: "", weight: "" })
  const [preferences, setPreferences] = useState(user?.preferences || { style: "classic", colors: [] })
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setAvatar(user.avatar || "/placeholder.svg?height=100&width=100")
      setMeasurements(user.measurements || { size: "M", height: "", weight: "" })
      setPreferences(user.preferences || { style: "classic", colors: [] })
      if (!user.profileComplete) {
        setEditMode(true) // Force edit mode if profile is incomplete
        setMessage("Please complete your profile to get personalized recommendations!")
        setMessageType("info")
      } else {
        setEditMode(false)
        setMessage(null)
      }
    }
  }, [user])

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      await updateUserProfile({
        name,
        email,
        avatar,
        measurements,
        preferences,
        profileComplete: true, // Mark as complete after saving
      })
      setMessage("Profile updated successfully!")
      setMessageType("success")
      setEditMode(false)
    } catch (err: any) {
      setMessage(err.message || "Failed to update profile.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  const handleClose = () => {
    // Reset to original user data if closing without saving in edit mode
    if (editMode && user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setAvatar(user.avatar || "/placeholder.svg?height=100&width=100")
      setMeasurements(user.measurements || { size: "M", height: "", weight: "" })
      setPreferences(user.preferences || { style: "classic", colors: [] })
    }
    setEditMode(false)
    setMessage(null)
    onClose()
  }

  if (!user) return null // Should not happen if modal is only opened for authenticated users

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
            className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg"
          >
            <Card className="bg-transparent border-none text-white">
              <CardHeader className="relative pb-0">
                <CardTitle className="text-2xl text-center text-white">Your Profile</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  Manage your personal information and preferences.
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
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg mb-4 text-center ${
                      messageType === "success"
                        ? "bg-green-500/20 text-green-300"
                        : messageType === "error"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-blue-500/20 text-blue-300"
                    }`}
                  >
                    {message}
                  </motion.div>
                )}
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-2 border-purple-500">
                        <AvatarImage src={avatar || "/placeholder.svg"} alt="User Avatar" />
                        <AvatarFallback className="bg-purple-600 text-white text-3xl">
                          {name ? name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {editMode && (
                        <>
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                          <Label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
                          >
                            <Camera className="h-4 w-4 text-white" />
                            <span className="sr-only">Upload Avatar</span>
                          </Label>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white">{user.email}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!editMode}
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!editMode}
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Measurements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="size" className="text-gray-300">
                          Size
                        </Label>
                        <Select
                          value={measurements.size}
                          onValueChange={(value) => setMeasurements((prev) => ({ ...prev, size: value }))}
                          disabled={!editMode}
                        >
                          <SelectTrigger id="size" className="w-full bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="height" className="text-gray-300">
                          Height (cm)
                        </Label>
                        <Input
                          id="height"
                          type="number"
                          value={measurements.height}
                          onChange={(e) => setMeasurements((prev) => ({ ...prev, height: e.target.value }))}
                          disabled={!editMode}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight" className="text-gray-300">
                          Weight (kg)
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          value={measurements.weight}
                          onChange={(e) => setMeasurements((prev) => ({ ...prev, weight: e.target.value }))}
                          disabled={!editMode}
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Style Preferences</h4>
                    <div>
                      <Label htmlFor="style" className="text-gray-300">
                        Preferred Style
                      </Label>
                      <Select
                        value={preferences.style}
                        onValueChange={(value) => setPreferences((prev) => ({ ...prev, style: value }))}
                        disabled={!editMode}
                      >
                        <SelectTrigger id="style" className="w-full bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {["classic", "modern", "casual", "ethnic", "formal"].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="colors" className="text-gray-300">
                        Favorite Colors (comma-separated)
                      </Label>
                      <Input
                        id="colors"
                        value={preferences.colors.join(", ")}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            colors: e.target.value.split(",").map((c) => c.trim()),
                          }))
                        }
                        disabled={!editMode}
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    {!editMode ? (
                      <Button
                        type="button"
                        onClick={() => setEditMode(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleClose} // Use handleClose to reset and close
                          className="border-gray-500/50 text-gray-300 hover:bg-gray-500/10 bg-transparent"
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                          {loading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" /> Save Changes
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </form>
                <div className="mt-6 pt-4 border-t border-white/20">
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
