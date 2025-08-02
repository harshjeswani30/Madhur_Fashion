"use client"

import { Separator } from "@/components/ui/separator"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, RotateCw, ZoomIn, Shirt, Loader2 } from "lucide-react" // Import Loader2

export default function VirtualTryOn() {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null)
  const [outfitScale, setOutfitScale] = useState(1)
  const [outfitRotation, setOutfitRotation] = useState(0)
  const [outfitPosition, setOutfitPosition] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const imageRef = useRef<HTMLImageElement>(null)
  const outfitRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const outfits = [
    { id: "suit", name: "Classic Suit", image: "/placeholder.svg?height=400&width=300" },
    { id: "sherwani", name: "Royal Sherwani", image: "/placeholder.svg?height=400&width=300" },
    { id: "kurta", name: "Designer Kurta", image: "/placeholder.svg?height=400&width=300" },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLoading(true)
      setError(null)
      const reader = new FileReader()
      reader.onloadend = () => {
        setUserImage(reader.result as string)
        setLoading(false)
      }
      reader.onerror = () => {
        setError("Failed to load image.")
        setLoading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleOutfitSelect = (outfitId: string) => {
    const outfit = outfits.find((o) => o.id === outfitId)
    if (outfit) {
      setSelectedOutfit(outfit.image)
      // Reset outfit position/scale for new outfit
      setOutfitScale(1)
      setOutfitRotation(0)
      setOutfitPosition({ x: 0, y: 0 })
    }
  }

  const handleDrag = (e: React.MouseEvent) => {
    if (!outfitRef.current || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const outfitRect = outfitRef.current.getBoundingClientRect()

    let isDragging = false
    let startX: number, startY: number, initialX: number, initialY: number

    const onMouseDown = (downEvent: React.MouseEvent) => {
      isDragging = true
      startX = downEvent.clientX
      startY = downEvent.clientY
      initialX = outfitPosition.x
      initialY = outfitPosition.y
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    }

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging) return
      const dx = moveEvent.clientX - startX
      const dy = moveEvent.clientY - startY
      setOutfitPosition({ x: initialX + dx, y: initialY + dy })
    }

    const onMouseUp = () => {
      isDragging = false
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }

    onMouseDown(e)
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Virtual Try-On
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-300 mb-10 text-center max-w-2xl mx-auto"
      >
        Upload your photo and virtually try on our latest collection.
      </motion.p>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Try-On Area */}
        <Card className="lg:col-span-2 bg-slate-900 border-purple-500/30 shadow-lg flex flex-col items-center justify-center p-4 relative min-h-[500px]">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
              <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
              <p className="text-lg text-gray-300">Loading Image...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 text-red-400 text-center p-4">
              <p className="text-lg mb-2">Error: {error}</p>
              <Button onClick={() => setUserImage(null)} variant="outline">
                Try Another Image
              </Button>
            </div>
          )}

          {!userImage && !loading && (
            <div className="text-center text-gray-400">
              <Camera className="h-20 w-20 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-4">Upload your photo to start trying on outfits!</p>
              <Input
                id="user-image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Label htmlFor="user-image-upload">
                <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer">
                  <span>
                    <Upload className="mr-2 h-4 w-4" /> Upload Photo
                  </span>
                </Button>
              </Label>
            </div>
          )}

          {userImage && (
            <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <img
                ref={imageRef}
                src={userImage || "/placeholder.svg"}
                alt="User"
                className="max-w-full max-h-full object-contain"
                style={{ filter: loading ? "blur(5px)" : "none" }}
              />
              {selectedOutfit && (
                <img
                  ref={outfitRef}
                  src={selectedOutfit || "/placeholder.svg"}
                  alt="Outfit"
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    width: `calc(100% * ${outfitScale})`,
                    height: `calc(100% * ${outfitScale})`,
                    transform: `translate(${outfitPosition.x}px, ${outfitPosition.y}px) rotate(${outfitRotation}deg)`,
                    objectFit: "contain",
                  }}
                  onMouseDown={handleDrag}
                />
              )}
            </div>
          )}
        </Card>

        {/* Controls Section */}
        <Card className="bg-slate-900 border-purple-500/30 shadow-lg p-6 space-y-6">
          <CardTitle className="text-white flex items-center gap-2">
            <Shirt className="h-5 w-5 text-purple-400" /> Outfit Controls
          </CardTitle>
          <Separator className="bg-purple-500/30" />

          {/* Outfit Selection */}
          <div>
            <Label htmlFor="outfit-select" className="text-gray-300 mb-2 block">
              Select Outfit
            </Label>
            <Select value={selectedOutfit || ""} onValueChange={handleOutfitSelect}>
              <SelectTrigger id="outfit-select" className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Choose an outfit" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {outfits.map((outfit) => (
                  <SelectItem key={outfit.id} value={outfit.id}>
                    {outfit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scale Control */}
          <div>
            <Label htmlFor="scale-slider" className="text-gray-300 mb-2 block">
              <ZoomIn className="inline-block h-4 w-4 mr-2" /> Scale ({outfitScale.toFixed(1)}x)
            </Label>
            <Slider
              id="scale-slider"
              min={0.5}
              max={2}
              step={0.1}
              value={[outfitScale]}
              onValueChange={([val]) => setOutfitScale(val)}
              className="[&>span:first-child]:bg-purple-600"
              disabled={!selectedOutfit}
            />
          </div>

          {/* Rotation Control */}
          <div>
            <Label htmlFor="rotation-slider" className="text-gray-300 mb-2 block">
              <RotateCw className="inline-block h-4 w-4 mr-2" /> Rotation ({outfitRotation}°){" "}
            </Label>
            <Slider
              id="rotation-slider"
              min={-180}
              max={180}
              step={1}
              value={[outfitRotation]}
              onValueChange={([val]) => setOutfitRotation(val)}
              className="[&>span:first-child]:bg-purple-600"
              disabled={!selectedOutfit}
            />
          </div>

          {/* Position Reset */}
          <Button
            onClick={() => setOutfitPosition({ x: 0, y: 0 })}
            variant="outline"
            className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
            disabled={!selectedOutfit}
          >
            Reset Position
          </Button>

          {/* Capture Button */}
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            disabled={!userImage || !selectedOutfit}
            onClick={() => alert("Capture functionality coming soon!")}
          >
            <Camera className="mr-2 h-4 w-4" /> Capture Look
          </Button>
        </Card>
      </div>
    </section>
  )
}
