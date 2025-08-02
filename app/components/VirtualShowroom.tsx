"use client"

import { Separator } from "@/components/ui/separator"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RotateCw, ZoomIn, Shirt, Palette, Lightbulb, Download, Share2, Loader2 } from "lucide-react"

// Mock 3D model data
const mockModels = [
  {
    id: "suit",
    name: "Classic Suit",
    src: "/placeholder.glb?query=3d-suit-model",
    textures: {
      default: "/placeholder.svg?height=500&width=500",
      navy: "/placeholder.svg?height=500&width=500",
      charcoal: "/placeholder.svg?height=500&width=500",
    },
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "sherwani",
    name: "Royal Sherwani",
    src: "/placeholder.glb?query=3d-sherwani-model",
    textures: {
      default: "/placeholder.svg?height=500&width=500",
      gold: "/placeholder.svg?height=500&width=500",
      maroon: "/placeholder.svg?height=500&width=500",
    },
    sizes: ["M", "L", "XL", "XXL"],
  },
]

export default function VirtualShowroom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedModel, setSelectedModel] = useState(mockModels[0])
  const [currentTexture, setCurrentTexture] = useState(selectedModel.textures.default)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [lighting, setLighting] = useState(50)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate 3D model loading
  useEffect(() => {
    setLoading(true)
    setError(null)
    const timer = setTimeout(() => {
      // In a real app, you'd load the GLB/GLTF model here
      // For now, we just simulate success or failure
      const success = Math.random() > 0.1 // 90% chance of success
      if (success) {
        setLoading(false)
        // Simulate rendering the model on canvas
        const ctx = canvasRef.current?.getContext("2d")
        if (ctx) {
          const img = new Image()
          img.src = currentTexture
          img.onload = () => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            ctx.save()
            ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.scale(zoom, zoom)
            ctx.filter = `brightness(${lighting / 100})`
            ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)
            ctx.restore()
          }
          img.onerror = () => {
            setError("Failed to load model texture.")
            setLoading(false)
          }
        }
      } else {
        setError("Failed to load 3D model. Please try again.")
        setLoading(false)
      }
    }, 1500) // Simulate network delay
    return () => clearTimeout(timer)
  }, [selectedModel, currentTexture, rotation, zoom, lighting])

  const handleModelChange = (modelId: string) => {
    const newModel = mockModels.find((m) => m.id === modelId)
    if (newModel) {
      setSelectedModel(newModel)
      setCurrentTexture(newModel.textures.default)
      setRotation(0)
      setZoom(1)
      setLighting(50)
    }
  }

  const handleTextureChange = (textureKey: string) => {
    const texture = selectedModel.textures[textureKey as keyof typeof selectedModel.textures]
    if (texture) {
      setCurrentTexture(texture)
    }
  }

  const handleDownload = () => {
    if (canvasRef.current) {
      const image = canvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${selectedModel.name.replace(/\s/g, "-")}-render.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      alert("Image downloaded!")
    }
  }

  const handleShare = () => {
    alert("Share functionality coming soon!")
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Virtual Showroom
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-300 mb-10 text-center max-w-2xl mx-auto"
      >
        Experience our collection in 3D. Customize and visualize your perfect outfit.
      </motion.p>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3D Viewer Section */}
        <Card className="lg:col-span-2 bg-slate-900 border-purple-500/30 shadow-lg flex flex-col items-center justify-center p-4 relative min-h-[500px]">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
              <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
              <p className="text-lg text-gray-300">Loading 3D Model...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 text-red-400 text-center p-4">
              <p className="text-lg mb-2">Error: {error}</p>
              <Button onClick={() => handleModelChange(selectedModel.id)} variant="outline">
                Try Again
              </Button>
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={800}
            height={800}
            className={`w-full h-full max-h-[700px] object-contain ${loading || error ? "opacity-0" : "opacity-100"}`}
          />
        </Card>

        {/* Controls Section */}
        <Card className="bg-slate-900 border-purple-500/30 shadow-lg p-6 space-y-6">
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-400" /> Customization Controls
          </CardTitle>
          <Separator className="bg-purple-500/30" />

          {/* Model Selection */}
          <div>
            <Label htmlFor="model-select" className="text-gray-300 mb-2 block">
              <Shirt className="inline-block h-4 w-4 mr-2" /> Select Model
            </Label>
            <Select value={selectedModel.id} onValueChange={handleModelChange}>
              <SelectTrigger id="model-select" className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Choose a model" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {mockModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color/Texture Selection */}
          <div>
            <Label htmlFor="texture-select" className="text-gray-300 mb-2 block">
              <Palette className="inline-block h-4 w-4 mr-2" /> Select Color/Texture
            </Label>
            <Select
              value={
                Object.keys(selectedModel.textures).find(
                  (key) => selectedModel.textures[key as keyof typeof selectedModel.textures] === currentTexture,
                ) || "default"
              }
              onValueChange={handleTextureChange}
            >
              <SelectTrigger id="texture-select" className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Choose a color" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {Object.keys(selectedModel.textures).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rotation Control */}
          <div>
            <Label htmlFor="rotation-slider" className="text-gray-300 mb-2 block">
              <RotateCw className="inline-block h-4 w-4 mr-2" /> Rotation ({rotation}°){" "}
            </Label>
            <Slider
              id="rotation-slider"
              min={0}
              max={360}
              step={1}
              value={[rotation]}
              onValueChange={([val]) => setRotation(val)}
              className="[&>span:first-child]:bg-purple-600"
            />
          </div>

          {/* Zoom Control */}
          <div>
            <Label htmlFor="zoom-slider" className="text-gray-300 mb-2 block">
              <ZoomIn className="inline-block h-4 w-4 mr-2" /> Zoom ({zoom.toFixed(1)}x)
            </Label>
            <Slider
              id="zoom-slider"
              min={0.5}
              max={2}
              step={0.1}
              value={[zoom]}
              onValueChange={([val]) => setZoom(val)}
              className="[&>span:first-child]:bg-purple-600"
            />
          </div>

          {/* Lighting Control */}
          <div>
            <Label htmlFor="lighting-slider" className="text-gray-300 mb-2 block">
              <Lightbulb className="inline-block h-4 w-4 mr-2" /> Lighting ({lighting}%)
            </Label>
            <Slider
              id="lighting-slider"
              min={10}
              max={100}
              step={1}
              value={[lighting]}
              onValueChange={([val]) => setLighting(val)}
              className="[&>span:first-child]:bg-purple-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" /> Download Image
            </Button>
            <Button
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share Configuration
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
