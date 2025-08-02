"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react" // Import Loader2
import { useChat } from "ai/react"

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat()

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 shadow-lg"
        onClick={toggleChat}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-4 z-50 w-full max-w-md h-[70vh]"
          >
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg h-full flex flex-col">
              <CardHeader className="border-b border-white/20 flex flex-row items-center justify-between p-4">
                <CardTitle className="text-white flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-400" /> AI Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-4 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 && !isLoading && (
                      <div className="text-center text-gray-400 py-8">
                        <p className="text-lg">Start a conversation with your AI stylist!</p>
                      </div>
                    )}
                    {messages.map((m) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                      >
                        {m.role === "assistant" && (
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`p-3 rounded-lg max-w-[75%] ${
                            m.role === "user"
                              ? "bg-purple-600 text-white rounded-br-none"
                              : "bg-gray-700 text-gray-100 rounded-bl-none"
                          }`}
                        >
                          {m.content}
                        </div>
                        {m.role === "user" && (
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}
                    {isLoading && (
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
                    {error && (
                      <div className="text-red-400 text-sm text-center mt-4">
                        Error: {error.message || "Something went wrong."}
                      </div>
                    )}
                  </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-1 bg-gray-800 border-gray-700 text-white resize-none"
                    rows={1}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || input.trim() === ""}
                    className="bg-purple-600 hover:bg-purple-700 text-white p-2 h-auto"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
