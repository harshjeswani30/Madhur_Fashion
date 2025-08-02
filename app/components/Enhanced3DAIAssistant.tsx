"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Camera, Upload, Ruler, Shirt, RotateCw, ZoomIn, Send, Bot, Loader2, Trash2, Mic, MicOff, Volume2, VolumeX, ShoppingBag, Star } from "lucide-react"
import { useTheme } from "./ThemeProvider"
import VirtualAssistant from "./VirtualAssistant"
import { useCart } from "./CartProvider"
import { type Product } from "@/lib/products"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AnimatePresence } from "framer-motion"

interface ChatMessage {
  sender: "user" | "ai"
  text: string
  language: "en" | "hi"
}

export default function Enhanced3DAIAssistant() {
  const { theme } = useTheme()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState("chat") // Changed default to 'chat'
  const [userImage, setUserImage] = useState<string | null>(null)
  const [selectedOutfit, setSelectedOutfit] = useState<string | null>(null)
  const [outfitScale, setOutfitScale] = useState(1)
  const [outfitRotation, setOutfitRotation] = useState(0)
  const [outfitPosition, setOutfitPosition] = useState({ x: 0, y: 0 })
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: "ai", text: "Hello! I'm your personal fashion assistant. What occasion are you shopping for today?", language: "en" },
  ])
  const [chatInput, setChatInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Product recommendation state
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [showProducts, setShowProducts] = useState(false)
  const [productsLoading, setProductsLoading] = useState(false)
  
  // Audio and language features
  const [isRecording, setIsRecording] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en')
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const outfits = [
    { id: "suit", name: "Classic Suit", image: "/placeholder.svg?height=400&width=300" },
    { id: "sherwani", name: "Royal Sherwani", image: "/placeholder.svg?height=400&width=300" },
    { id: "kurta", name: "Designer Kurta", image: "/placeholder.svg?height=400&width=300" },
  ]

  const outfitCategories = [
    {
      id: "top",
      name: "Tops",
      icon: Shirt,
      items: [
        { id: "t1", name: "White Dress Shirt", image: "/placeholder.svg?height=100&width=100", price: 59.99 },
        { id: "t2", name: "Navy Polo", image: "/placeholder.svg?height=100&width=100", price: 45.0 },
      ],
    },
    {
      id: "bottom",
      name: "Bottoms",
      icon: Ruler,
      items: [
        { id: "b1", name: "Black Slim Fit Trousers", image: "/placeholder.svg?height=100&width=100", price: 89.99 },
        { id: "b2", name: "Khaki Chinos", image: "/placeholder.svg?height=100&width=100", price: 75.0 },
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
  const [selectedBuilderItems, setSelectedBuilderItems] = useState<OutfitItem[]>([])
  const [builderTotalPrice, setBuilderTotalPrice] = useState(0)

  // Try-On Handlers
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
      setOutfitScale(1)
      setOutfitRotation(0)
      setOutfitPosition({ x: 0, y: 0 })
    }
  }

  // Outfit Builder Handlers
  const handleAddBuilderItem = (categoryId: string, itemId: string) => {
    const category = outfitCategories.find((cat) => cat.id === categoryId)
    const item = category?.items.find((i) => i.id === itemId)
    if (item) {
      const newItem = { ...item, category: category?.name || "" }
      setSelectedBuilderItems((prev) => {
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

  const handleRemoveBuilderItem = (itemId: string) => {
    setSelectedBuilderItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  // Chat Handlers
  const detectLanguage = (text: string): 'en' | 'hi' => {
    // Simple language detection - in real app, use a proper language detection library
    const hindiRegex = /[\u0900-\u097F]/
    return hindiRegex.test(text) ? 'hi' : 'en'
  }

  // Get product recommendations based on user query
  const getProductRecommendations = async (userQuery: string, language: 'en' | 'hi') => {
    try {
      setProductsLoading(true)
      console.log('Getting product recommendations for:', userQuery)
      
      const response = await fetch('/api/product-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userQuery: userQuery,
          language: language
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        if (data.products && data.products.length > 0) {
          setRecommendedProducts(data.products)
          setShowProducts(true)
          console.log(`Found ${data.products.length} product recommendations`)
          return data.products
        } else {
          // No products found but API worked
          setRecommendedProducts([])
          setShowProducts(true) // Still show the section with "no products" message
          console.log('No products found:', data.message)
          return []
        }
      } else {
        console.log('Product recommendation failed:', data.error)
        setRecommendedProducts([])
        setShowProducts(false)
        return []
      }
      
    } catch (error) {
      console.error('Failed to get product recommendations:', error)
      setRecommendedProducts([])
      setShowProducts(false)
      return []
    } finally {
      setProductsLoading(false)
    }
  }
  const getAIResponse = async (input: string, language: 'en' | 'hi', history: ChatMessage[]): Promise<string> => {
    try {
      console.log('Sending request to AI API:', { input, language, historyLength: history.length })
      
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          language: language,
          conversationHistory: history
        }),
      })

      console.log('AI API response status:', response.status)
      
      if (!response.ok) {
        console.error('AI API returned error status:', response.status)
        throw new Error(`API returned status ${response.status}`)
      }

      const data = await response.json()
      console.log('AI API response data:', data)
      
      if (data.error && data.fallbackResponse) {
        console.warn('AI API Error, using fallback:', data.error)
        return data.fallbackResponse
      }
      
      if (data.response) {
        console.log('Received AI response:', data.response.substring(0, 100) + '...')
        return data.response
      }
      
      throw new Error('No response from AI service')
      
    } catch (error) {
      console.error('Failed to get AI response:', error)
      
      // Enhanced fallback responses based on context
      const fallbackResponses = {
        en: [
          `I'd love to help you with "${input}". As your fashion assistant, I can recommend styles based on your preferences. What occasion are you shopping for?`,
          `Thanks for asking about "${input}". Let me suggest some trendy options from our collection. Are you looking for traditional or contemporary styles?`,
          `Great question about "${input}"! I specialize in personalized styling. Could you tell me more about your style preferences and budget?`,
          `I understand you're interested in "${input}". Our fashion experts can help you find the perfect look. What's your preferred color palette?`,
        ],
        hi: [
          `"${input}" के बारे में पूछने के लिए धन्यवाद। मैं आपकी पसंद के अनुसार स्टाइल सुझा सकता हूं। आप किस अवसर के लिए खरीदारी कर रहे हैं?`,
          `"${input}" के लिए मैं कुछ ट्रेंडी विकल्प सुझा सकता हूं। क्या आप पारंपरिक या आधुनिक स्टाइल की तलाश में हैं?`,
          `"${input}" के बारे में बेहतरीन सवाल! मैं व्यक्तिगत स्टाइलिंग में विशेषज्ञ हूं। कृपया अपनी पसंद और बजट के बारे में बताएं?`,
          `मैं समझ गया कि आप "${input}" में रुचि रखते हैं। हमारे फैशन एक्सपर्ट आपको परफेक्ट लुक खोजने में मदद कर सकते हैं। आपका पसंदीदा रंग कौन सा है?`,
        ]
      }
      
      const responses = fallbackResponses[language]
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  const speakText = (text: string, language: 'en' | 'hi') => {
    if (!audioEnabled || typeof window === 'undefined') return
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US'
    utterance.rate = 0.8
    utterance.pitch = 1
    
    window.speechSynthesis.speak(utterance)
  }

  const handleSendChatMessage = async (inputText?: string, detectedLang?: 'en' | 'hi') => {
    const messageText = inputText || chatInput.trim()
    if (messageText === "") return

    const language = detectedLang || detectLanguage(messageText)
    setCurrentLanguage(language)

    const newMessage: ChatMessage = { sender: "user", text: messageText, language }
    setChatMessages((prev) => [...prev, newMessage])
    setChatInput("")
    setLoading(true)
    setError(null)

    try {
      // Get product recommendations in parallel with AI response
      const productsPromise = getProductRecommendations(messageText, language)
      
      // Get AI response with conversation history for context
      const currentHistory = [...chatMessages, newMessage]
      const aiResponsePromise = getAIResponse(messageText, language, currentHistory)
      
      // Wait for both responses
      const [recommendedProducts, aiResponseText] = await Promise.all([
        productsPromise,
        aiResponsePromise
      ])
      
      const aiResponse: ChatMessage = {
        sender: "ai",
        text: aiResponseText,
        language
      }
      setChatMessages((prev) => [...prev, aiResponse])
      
      // Speak the AI response
      speakText(aiResponseText, language)
      
      // Show products if any were found
      if (recommendedProducts && recommendedProducts.length > 0) {
        console.log(`Showing ${recommendedProducts.length} recommended products`)
      }
      
    } catch (error) {
      console.error('Error getting AI response:', error)
      setError('Failed to get response. Please try again.')
      
      // Add error message to chat
      const errorResponse: ChatMessage = {
        sender: "ai",
        text: language === 'hi' 
          ? 'क्षमा करें, मुझे कुछ तकनीकी समस्या हो रही है। कृपया दोबारा प्रयास करें।'
          : 'Sorry, I\'m experiencing some technical issues. Please try again.',
        language
      }
      setChatMessages((prev) => [...prev, errorResponse])
    } finally {
      setLoading(false)
    }
  }

  // Audio Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const audioChunks: BlobPart[] = []

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        await processAudioInput(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setError('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const processAudioInput = async (audioBlob: Blob) => {
    // In a real app, you would send this to a speech-to-text service
    // For demo purposes, we'll simulate speech recognition
    setLoading(true)
    
    // Simulate processing delay
    setTimeout(() => {
      // Mock speech-to-text result
      const mockTranscriptions = [
        { text: "Show me some formal shirts", language: "en" as const },
        { text: "मुझे कुछ शानदार कुर्ते दिखाइए", language: "hi" as const },
        { text: "What's trending in fashion?", language: "en" as const },
        { text: "शादी के लिए कपड़े दिखाएं", language: "hi" as const }
      ]
      
      const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]
      handleSendChatMessage(randomTranscription.text, randomTranscription.language)
    }, 1000)
  }

  return (
    <section className={`min-h-[calc(100vh-64px)] p-8 ${
      theme === 'dark' ? 'text-white' : 'text-gray-900'
    }`}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        AI Style Assistant
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-300 mb-10 text-center max-w-2xl mx-auto"
      >
        Your personal stylist, powered by AI. Try on outfits, build looks, and get instant advice.
      </motion.p>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-8">
          <Button
            variant={activeTab === "try-on" ? "default" : "outline"}
            onClick={() => setActiveTab("try-on")}
            className="mx-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Camera className="mr-2 h-4 w-4" /> Virtual Try-On
          </Button>
          <Button
            variant={activeTab === "outfit-builder" ? "default" : "outline"}
            onClick={() => setActiveTab("outfit-builder")}
            className="mx-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Shirt className="mr-2 h-4 w-4" /> Outfit Builder
          </Button>
          <Button
            variant={activeTab === "chat" ? "default" : "outline"}
            onClick={() => setActiveTab("chat")}
            className="mx-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Bot className="mr-2 h-4 w-4" /> AI Chat
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "try-on" && (
            <motion.div
              key="try-on"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="bg-slate-900 border-purple-500/30 shadow-lg flex flex-col items-center justify-center p-4 relative min-h-[500px]">
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
                    <p className="text-lg text-gray-300">Loading Image...</p>
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
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <img
                      src={userImage || "/placeholder.svg"}
                      alt="User"
                      className="max-w-full max-h-full object-contain"
                    />
                    {selectedOutfit && (
                      <img
                        src={selectedOutfit || "/placeholder.svg"}
                        alt="Outfit"
                        className="absolute"
                        style={{
                          width: `calc(100% * ${outfitScale})`,
                          height: `calc(100% * ${outfitScale})`,
                          transform: `translate(${outfitPosition.x}px, ${outfitPosition.y}px) rotate(${outfitRotation}deg)`,
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>
                )}
              </Card>
              <Card className={`shadow-lg p-6 space-y-6 ${
                theme === 'dark' 
                  ? 'bg-slate-900 border-purple-500/30' 
                  : 'bg-white border-gray-200'
              }`}>
                <CardTitle className={`flex items-center gap-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Shirt className="h-5 w-5 text-purple-400" /> Outfit Controls
                </CardTitle>
                <div>
                  <Label htmlFor="outfit-select" className={`mb-2 block ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Select Outfit
                  </Label>
                  <Select value={selectedOutfit || ""} onValueChange={handleOutfitSelect}>
                    <SelectTrigger id="outfit-select" className={`w-full ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <SelectValue placeholder="Choose an outfit" />
                    </SelectTrigger>
                    <SelectContent className={`${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      {outfits.map((outfit) => (
                        <SelectItem key={outfit.id} value={outfit.id}>
                          {outfit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scale-slider" className="text-gray-300 mb-2 block">
                    <ZoomIn className="inline-block h-4 w-4 mr-2" /> Scale ({outfitScale.toFixed(1)}x)
                  </Label>
                  <input
                    id="scale-slider"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={outfitScale}
                    onChange={(e) => setOutfitScale(Number.parseFloat(e.target.value))}
                    className="w-full"
                    disabled={!selectedOutfit}
                  />
                </div>
                <div>
                  <Label htmlFor="rotation-slider" className="text-gray-300 mb-2 block">
                    <RotateCw className="inline-block h-4 w-4 mr-2" /> Rotation ({outfitRotation}°){" "}
                  </Label>
                  <input
                    id="rotation-slider"
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={outfitRotation}
                    onChange={(e) => setOutfitRotation(Number.parseInt(e.target.value))}
                    className="w-full"
                    disabled={!selectedOutfit}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  disabled={!userImage || !selectedOutfit}
                >
                  <Camera className="mr-2 h-4 w-4" /> Capture Look
                </Button>
              </Card>
            </motion.div>
          )}

          {activeTab === "outfit-builder" && (
            <motion.div
              key="outfit-builder"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="bg-slate-900 border-purple-500/30 shadow-lg p-6 space-y-6">
                <CardTitle className="text-white flex items-center gap-2">
                  <Shirt className="h-6 w-6 text-purple-400" /> Build Your Outfit
                </CardTitle>
                {outfitCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <Label htmlFor={`${category.id}-select`} className="text-gray-300 flex items-center gap-2">
                      <category.icon className="h-4 w-4" /> {category.name}
                    </Label>
                    <Select onValueChange={(itemId) => handleAddBuilderItem(category.id, itemId)}>
                      <SelectTrigger
                        id={`${category.id}-select`}
                        className="w-full bg-gray-800 border-gray-700 text-white"
                      >
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
                  onClick={() => alert("AI Suggestion coming soon!")}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white mt-4"
                >
                  <Sparkles className="mr-2 h-4 w-4" /> AI Outfit Suggestion
                </Button>
              </Card>

              <Card className="bg-slate-900 border-purple-500/30 shadow-lg p-6 space-y-6">
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-400" /> Your Current Outfit
                </CardTitle>
                <div className="space-y-4">
                  {selectedBuilderItems.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <p className="text-lg">Start building your outfit!</p>
                      <p className="text-sm mt-2">Select items from the left panel.</p>
                    </div>
                  ) : (
                    selectedBuilderItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-white/10"
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
                          onClick={() => handleRemoveBuilderItem(item.id)}
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
                    <span>${builderTotalPrice.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    disabled={selectedBuilderItems.length === 0}
                  >
                    Add Outfit to Cart
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* 3D Virtual Assistant */}
              <Card className="bg-slate-900 border-purple-500/30 shadow-lg h-[70vh] flex flex-col">
                <CardHeader className="border-b border-purple-500/30">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="h-6 w-6 text-purple-400" /> Virtual Fashion Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4">
                  <VirtualAssistant />
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <Card className="bg-slate-900 border-purple-500/30 shadow-lg h-[70vh] flex flex-col">
                <CardHeader className="border-b border-purple-500/30">
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="h-6 w-6 text-purple-400" /> AI Chat Assistant
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAudioEnabled(!audioEnabled)}
                        className="text-gray-400 hover:text-white"
                      >
                        {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                      <div className="text-xs text-gray-400">
                        {currentLanguage === 'hi' ? 'हिंदी' : 'English'}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
              <CardContent className="flex-1 p-6 overflow-y-auto flex flex-col">
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-start gap-3 ${message.sender === "user" ? "justify-end" : ""}`}
                    >
                      {message.sender === "ai" && (
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`p-3 rounded-lg max-w-[75%] ${
                          message.sender === "user"
                            ? "bg-purple-600 text-white rounded-br-none"
                            : "bg-gray-700 text-gray-100 rounded-bl-none"
                        }`}
                      >
                        {message.text}
                      </div>
                      {message.sender === "user" && (
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=32&width=32" />
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="p-3 rounded-lg bg-gray-700 text-gray-100 rounded-bl-none flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Typing...
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="mt-auto p-6 border-t border-purple-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loading}
                    className={`${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    } text-white p-2`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1 flex items-center gap-2">
                    <Textarea
                      placeholder={currentLanguage === 'hi' ? "अपना स्टाइल प्रश्न पूछें..." : "Ask your style question..."}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendChatMessage()
                        }
                      }}
                      className="flex-1 bg-gray-800 border-gray-700 text-white resize-none"
                      rows={1}
                      disabled={loading}
                    />
                    <Button
                      onClick={() => handleSendChatMessage()}
                      disabled={loading || chatInput.trim() === ""}
                      className="bg-purple-600 hover:bg-purple-700 text-white p-2 h-auto"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                {isRecording && (
                  <div className="text-center text-red-400 text-sm animate-pulse">
                    🎤 {currentLanguage === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}
                  </div>
                )}
                {error && (
                  <div className="text-center text-red-400 text-sm mt-2">
                    {error}
                  </div>
                )}
              </div>
            </Card>

            {/* Product Recommendations Section */}
            {showProducts && (
              <Card className="bg-slate-900 border-purple-500/30 shadow-lg mt-6">
                <CardHeader className="border-b border-purple-500/30">
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-6 w-6 text-purple-400" /> 
                      {currentLanguage === 'hi' ? 'सुझावित उत्पाद' : 'Product Recommendations'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {recommendedProducts.length > 0 
                        ? `${recommendedProducts.length} ${currentLanguage === 'hi' ? 'आइटम मिले' : 'items found'}`
                        : currentLanguage === 'hi' ? 'कोई उत्पाद नहीं' : 'No products available'
                      }
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {productsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                      <span className="ml-2 text-gray-400">
                        {currentLanguage === 'hi' ? 'उत्पाद खोजे जा रहे हैं...' : 'Finding products...'}
                      </span>
                    </div>
                  ) : recommendedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recommendedProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-slate-800 rounded-lg overflow-hidden hover:bg-slate-700 transition-colors"
                        >
                          <div className="aspect-square bg-gray-700 flex items-center justify-center">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                            
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-400">({product.reviews})</span>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <span className="text-2xl font-bold text-white">₹{product.price}</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                product.in_stock 
                                  ? 'bg-green-600 text-green-100' 
                                  : 'bg-red-600 text-red-100'
                              }`}>
                                {product.in_stock 
                                  ? (currentLanguage === 'hi' ? `स्टॉक में (${product.stock_count})` : `In Stock (${product.stock_count})`)
                                  : (currentLanguage === 'hi' ? 'स्टॉक समाप्त' : 'Out of Stock')
                                }
                              </span>
                            </div>

                            {product.occasion && product.occasion.length > 0 && (
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-1">
                                  {product.occasion.slice(0, 3).map((occasion) => (
                                    <span
                                      key={occasion}
                                      className="text-xs px-2 py-1 bg-purple-600/20 text-purple-300 rounded"
                                    >
                                      {occasion}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <Button
                              onClick={() => addToCart(product)}
                              disabled={!product.in_stock}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <ShoppingBag className="h-4 w-4 mr-2" />
                              {currentLanguage === 'hi' ? 'कार्ट में जोड़ें' : 'Add to Cart'}
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    /* Empty Inventory State */
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">
                        {currentLanguage === 'hi' ? 'कोई उत्पाद उपलब्ध नहीं' : 'No Products Available'}
                      </h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        {currentLanguage === 'hi' 
                          ? 'फिलहाल हमारे पास कोई उत्पाद उपलब्ध नहीं है। कृपया बाद में वापस आएं या व्यवस्थापक से संपर्क करें।'
                          : 'We don\'t have any products in our inventory yet. Please check back later or contact admin to add products.'
                        }
                      </p>
                      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-4">
                        <p className="text-blue-300 text-sm">
                          {currentLanguage === 'hi' 
                            ? '💡 व्यवस्थापक: उत्पाद अनुभाग में जाकर अपना इन्वेंटरी जोड़ें'
                            : '💡 Admin: Add your inventory through the Products section to enable AI recommendations'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setShowProducts(false)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      {currentLanguage === 'hi' ? 'बंद करें' : 'Close'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
