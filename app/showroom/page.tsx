"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Phone, MessageCircle, Users, Award, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "../components/ThemeProvider"
import VirtualShowroom from "../components/VirtualShowroom"

export default function ShowroomPage() {
  const { theme } = useTheme()
  const teamMembers = [
    {
      name: "Kailash Jeswani",
      role: "Founder & Creative Head",
      image: "/placeholder.svg?height=300&width=300",
      description: "Visionary leader with 15+ years in luxury fashion",
      specialties: ["Design Direction", "Brand Strategy", "Customer Relations"],
    },
    {
      name: "Kishan",
      role: "Showroom Manager",
      image: "/placeholder.svg?height=300&width=300",
      description: "Expert in customer service and inventory management",
      specialties: ["Customer Service", "Inventory", "Operations"],
    },
    {
      name: "Anil",
      role: "Showroom Manager",
      image: "/placeholder.svg?height=300&width=300",
      description: "Specialist in product knowledge and sales",
      specialties: ["Product Knowledge", "Sales", "Customer Care"],
    },
    {
      name: "Harsh",
      role: "Styling Expert",
      image: "/placeholder.svg?height=300&width=300",
      description: "Professional stylist with expertise in traditional and modern wear",
      specialties: ["Personal Styling", "Fashion Consulting", "Trend Analysis"],
    },
  ]

  const showroomFeatures = [
    {
      icon: Award,
      title: "Premium Experience",
      description: "Luxurious showroom with personalized service",
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Professional stylists and fashion consultants",
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description: "Only the finest fabrics and craftsmanship",
    },
  ]

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Visit Our Showroom</h1>
          <p className={`text-xl max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Experience luxury fashion in person at our premium showroom. Meet our expert team and discover the perfect
            outfit for every occasion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className={`backdrop-blur-xl p-8 ${
              theme === 'dark' 
                ? 'bg-slate-900 border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              <h2 className={`text-3xl font-bold mb-8 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Address</h3>
                    <p className={`leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      123 Fashion Street, Premium Plaza
                      <br />
                      Luxury District, Mumbai - 400001
                      <br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Opening Hours</h3>
                    <div className="text-gray-400 space-y-1">
                      <p>Monday - Saturday: 10:00 AM - 9:00 PM</p>
                      <p>Sunday: 11:00 AM - 8:00 PM</p>
                      <p className="text-purple-400 text-sm mt-2">*Extended hours during festival seasons</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
                    <p className="text-gray-400">+91 98765 43210</p>
                    <p className="text-gray-400">+91 98765 43211</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
                    <p className="text-gray-400 mb-3">+91 98765 43210</p>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => window.open("https://wa.me/919876543210", "_blank")}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Chat on WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="backdrop-blur-xl bg-slate-900 border-white/10 p-8 h-full">
              <h2 className="text-3xl font-bold text-white mb-8">Location</h2>
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                  <p className="text-white font-semibold mb-2">Interactive Map</p>
                  <p className="text-gray-400 text-sm">Premium Plaza, Fashion Street</p>
                  <Button
                    className="mt-4 bg-purple-600 hover:bg-purple-700"
                    onClick={() => window.open("https://maps.google.com", "_blank")}
                  >
                    View on Google Maps
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Showroom Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Visit Our Showroom?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {showroomFeatures.map((feature, index) => (
              <Card key={index} className="backdrop-blur-xl bg-slate-900 border-white/10 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Expert Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="backdrop-blur-xl bg-slate-900 border-white/10 overflow-hidden hover:border-purple-500/30 transition-all duration-300">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <Badge className="mb-3 bg-purple-500/20 text-purple-300">{member.role}</Badge>
                    <p className="text-gray-400 text-sm mb-4">{member.description}</p>
                    <div className="space-y-1">
                      {member.specialties.map((specialty, specIndex) => (
                        <Badge key={specIndex} className="mr-1 mb-1 bg-gray-500/20 text-gray-300 text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-16"
        >
          <Card className="backdrop-blur-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-12">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Visit?</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience our premium collection in person. Our expert team is ready to help you find the perfect outfit
              for any occasion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
                onClick={() => window.open("tel:+919876543210")}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg bg-transparent"
                onClick={() => window.open("https://wa.me/919876543210", "_blank")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp Us
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Virtual Showroom */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
          <VirtualShowroom />
        </motion.div>
      </div>
    </div>
  )
}
