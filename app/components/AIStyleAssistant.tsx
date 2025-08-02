"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, Loader2 } from "lucide-react" // Import Loader2

interface Message {
  id: number
  sender: "user" | "ai"
  text: string
}

export default function AIStyleAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm your AI Style Assistant. How can I help you find your perfect outfit today?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const newMessage: Message = { id: messages.length + 1, sender: "user", text: input }
    setMessages((prev) => [...prev, newMessage])
    setInput("")
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        sender: "ai",
        text: `That's an interesting request about "${input}". Let me think... For that, I'd recommend exploring our new collection of [suggested item] in [suggested color]. Would you like me to show you some options?`,
      }
      setMessages((prev) => [...prev, aiResponse])
      setLoading(false)
    }, 1500)
  }

  return (
    <section className="min-h-[calc(100vh-64px)] text-white p-8">
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
        Get personalized fashion advice and recommendations from our intelligent AI.
      </motion.p>

      <Card className="max-w-3xl mx-auto bg-slate-900 border-purple-500/30 shadow-lg h-[70vh] flex flex-col">
        <CardHeader className="border-b border-purple-500/30">
          <CardTitle className="text-white flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-400" /> Your Personal Stylist
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-6 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
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
          </ScrollArea>
          <div className="mt-6 flex items-center gap-2">
            <Textarea
              placeholder="Ask your style question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="flex-1 bg-gray-800 border-gray-700 text-white resize-none"
              rows={1}
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || input.trim() === ""}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 h-auto"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
