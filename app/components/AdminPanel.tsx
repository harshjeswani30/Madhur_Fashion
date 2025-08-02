"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  BarChart3,
  Settings,
  Upload,
  Minus,
  ChevronUp,
  ChevronDown
} from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
  status: "active" | "inactive"
  description: string
  image: string
}

interface StaffMember {
  id: number
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  joinDate: string
}

interface OrderStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Royal Blue Sherwani",
      price: 299.99,
      category: "Traditional",
      stock: 15,
      status: "active",
      description: "Elegant royal blue sherwani with intricate embroidery",
      image: "/placeholder.jpg"
    },
    {
      id: 2,
      name: "Black Formal Blazer",
      price: 189.99,
      category: "Formal",
      stock: 25,
      status: "active",
      description: "Premium black formal blazer for professional occasions",
      image: "/placeholder.jpg"
    },
    {
      id: 3,
      name: "Maroon Lehenga Set",
      price: 499.99,
      category: "Traditional",
      stock: 8,
      status: "active",
      description: "Beautiful maroon lehenga set with golden work",
      image: "/placeholder.jpg"
    },
    {
      id: 4,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      category: "Clothing",
      stock: 150,
      status: "active",
      description: "High-quality cotton t-shirt with modern fit",
      image: "/placeholder.jpg"
    },
    {
      id: 5,
      name: "Designer Jeans",
      price: 89.99,
      category: "Clothing",
      stock: 75,
      status: "active",
      description: "Premium denim jeans with contemporary styling",
      image: "/placeholder.jpg"
    },
    {
      id: 6,
      name: "Leather Jacket",
      price: 199.99,
      category: "Outerwear",
      stock: 25,
      status: "inactive",
      description: "Genuine leather jacket with classic design",
      image: "/placeholder.jpg"
    }
  ])

  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "Kailash Jeswani",
      email: "kailashjeswani@madhurfashion.com",
      role: "owner",
      status: "active",
      joinDate: "2024-01-01"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@madhurfashion.com",
      role: "staff",
      status: "active",
      joinDate: "2024-02-15"
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@madhurfashion.com",
      role: "staff",
      status: "active",
      joinDate: "2024-03-10"
    },
    {
      id: 4,
      name: "Sneha Patel",
      email: "sneha.patel@madhurfashion.com",
      role: "staff",
      status: "active",
      joinDate: "2024-04-05"
    }
  ])

  const [orderStats] = useState<OrderStats>({
    totalOrders: 1247,
    totalRevenue: 45670.50,
    pendingOrders: 23,
    completedOrders: 1224
  })

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: ""
  })

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    role: "staff"
  })

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [editingStock, setEditingStock] = useState<number | null>(null)
  const [stockInput, setStockInput] = useState("")

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      const product: Product = {
        id: Date.now(),
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        stock: parseInt(newProduct.stock) || 0,
        status: "active",
        description: newProduct.description,
        image: newProduct.image || "/placeholder.jpg"
      }
      setProducts([...products, product])
      setNewProduct({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: ""
      })
    }
  }

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.email) {
      const staffMember: StaffMember = {
        id: Date.now(),
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        status: "active",
        joinDate: new Date().toISOString().split('T')[0]
      }
      setStaff([...staff, staffMember])
      setNewStaff({
        name: "",
        email: "",
        role: "staff"
      })
    }
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const handleDeleteStaff = (id: number) => {
    setStaff(staff.filter(s => s.id !== id))
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
  }

  const handleEditStaff = (staffMember: StaffMember) => {
    setEditingStaff(staffMember)
  }

  const handleUpdateProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
      setEditingProduct(null)
    }
  }

  const handleUpdateStaff = () => {
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? editingStaff : s))
      setEditingStaff(null)
    }
  }

  const toggleProductStatus = (id: number) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
    ))
  }

  const toggleStaffStatus = (id: number) => {
    setStaff(staff.map(s => 
      s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s
    ))
  }

  const adjustStock = (id: number, adjustment: number) => {
    console.log(`Adjusting stock for product ${id} by ${adjustment}`)
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + adjustment)
          console.log(`Product ${id}: ${p.stock} -> ${newStock}`)
          return { ...p, stock: newStock }
        }
        return p
      })
      console.log('Updated products:', updatedProducts)
      return updatedProducts
    })
  }

  const updateStock = (id: number, newStock: number) => {
    console.log(`Setting stock for product ${id} to ${newStock}`)
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(p => {
        if (p.id === id) {
          const finalStock = Math.max(0, newStock)
          console.log(`Product ${id}: setting to ${finalStock}`)
          return { ...p, stock: finalStock }
        }
        return p
      })
      console.log('Updated products:', updatedProducts)
      return updatedProducts
    })
  }

  const startEditingStock = (id: number, currentStock: number) => {
    setEditingStock(id)
    setStockInput(currentStock.toString())
  }

  const saveStock = (id: number) => {
    const newStock = parseInt(stockInput) || 0
    console.log(`Saving stock for product ${id}: ${newStock}`)
    updateStock(id, newStock)
    setEditingStock(null)
    setStockInput("")
  }

  const cancelEditingStock = () => {
    console.log('Cancelling stock edit')
    setEditingStock(null)
    setStockInput("")
  }

  const handleStockInputKeyDown = (e: React.KeyboardEvent, productId: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveStock(productId)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEditingStock()
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: "Out of Stock", color: "text-red-600 bg-red-50" }
    if (stock <= 10) return { status: "Low Stock", color: "text-orange-600 bg-orange-50" }
    if (stock <= 25) return { status: "In Stock", color: "text-yellow-600 bg-yellow-50" }
    return { status: "In Stock", color: "text-green-600 bg-green-50" }
  }

  const quickStockAdjust = (id: number, newStock: number) => {
    console.log(`Quick adjusting stock for product ${id} to ${newStock}`)
    if (!isNaN(newStock)) {
      updateStock(id, newStock)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your fashion store with advanced controls
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold">{orderStats.totalOrders}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">${orderStats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Products</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Staff Members</p>
                  <p className="text-3xl font-bold">{staff.length}</p>
                </div>
                <Users className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Staff
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm">New order #1248 received</span>
                        <Badge variant="secondary">2 min ago</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm">Product stock updated</span>
                        <Badge variant="secondary">15 min ago</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm">New staff member added</span>
                        <Badge variant="secondary">1 hour ago</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Order Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Pending Orders</span>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {orderStats.pendingOrders}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Completed Orders</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {orderStats.completedOrders}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total Orders</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {orderStats.totalOrders}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              {/* Test Section */}
              <Card className="bg-blue-50 dark:bg-blue-900/20">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">🧪 Test Stock Functions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      onClick={() => {
                        console.log('Test: Adding 5 to Royal Blue Sherwani (ID: 1)')
                        adjustStock(1, 5)
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-green-100 hover:bg-green-200"
                    >
                      +5 to Royal Blue Sherwani
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('Test: Removing 3 from Black Formal Blazer (ID: 2)')
                        adjustStock(2, -3)
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-red-100 hover:bg-red-200"
                    >
                      -3 from Black Formal Blazer
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('Test: Setting Maroon Lehenga to 50 (ID: 3)')
                        updateStock(3, 50)
                      }}
                      variant="outline"
                      size="sm"
                      className="bg-purple-100 hover:bg-purple-200"
                    >
                      Set Maroon Lehenga to 50
                    </Button>
                  </div>
                  <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded border">
                    <h4 className="font-medium mb-2">Current Stock Levels:</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {products.slice(0, 3).map(product => (
                        <div key={product.id} className="flex justify-between">
                          <span>{product.name.substring(0, 15)}...</span>
                          <span className="font-bold">{product.stock}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Open browser console (F12) to see function logs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Inventory Overview
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Monitor and adjust stock levels for all products
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <motion.tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left p-4 font-medium">Product Name</th>
                          <th className="text-left p-4 font-medium">Current Stock</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </motion.tr>
                      </thead>
                      <tbody>
                        {products.filter(p => p.status === "active").map((product) => {
                          const stockStatus = getStockStatus(product.stock)
                          return (
                            <motion.tr
                              key={product.id}
                              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <td className="p-4">
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.category}</div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {editingStock === product.id ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        value={stockInput}
                                        onChange={(e) => setStockInput(e.target.value)}
                                        className="w-20 h-8"
                                        min="0"
                                        onKeyDown={(e) => handleStockInputKeyDown(e, product.id)}
                                        autoFocus
                                        onBlur={() => saveStock(product.id)}
                                      />
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => saveStock(product.id)}
                                        className="h-8 px-2"
                                      >
                                        ✓
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelEditingStock}
                                        className="h-8 px-2"
                                      >
                                        ✕
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-3">
                                      <span 
                                        className={`px-3 py-1 rounded-md font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${stockStatus.color}`}
                                        onClick={() => startEditingStock(product.id, product.stock)}
                                        title="Click to edit stock"
                                      >
                                        {product.stock}
                                      </span>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            console.log(`Decreasing stock for product ${product.id}`)
                                            adjustStock(product.id, -1)
                                          }}
                                          disabled={product.stock <= 0}
                                          className="h-7 w-7 p-0"
                                          title="Decrease by 1"
                                        >
                                          <Minus className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            console.log(`Increasing stock for product ${product.id}`)
                                            adjustStock(product.id, 1)
                                          }}
                                          className="h-7 w-7 p-0"
                                          title="Increase by 1"
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge 
                                  variant="outline"
                                  className={stockStatus.color}
                                >
                                  {stockStatus.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <Select
                                    onValueChange={(value) => quickStockAdjust(product.id, parseInt(value))}
                                  >
                                    <SelectTrigger className="w-32 h-8">
                                      <SelectValue placeholder="Adjust Stock" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="0">Set to 0</SelectItem>
                                      <SelectItem value="10">Set to 10</SelectItem>
                                      <SelectItem value="25">Set to 25</SelectItem>
                                      <SelectItem value="50">Set to 50</SelectItem>
                                      <SelectItem value="100">Set to 100</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      console.log(`Adding 10 to product ${product.id}`)
                                      adjustStock(product.id, 10)
                                    }}
                                    className="h-8"
                                    title="Add 10 units"
                                  >
                                    +10
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      console.log(`Removing 10 from product ${product.id}`)
                                      adjustStock(product.id, -10)
                                    }}
                                    disabled={product.stock <= 10}
                                    className="h-8"
                                    title="Remove 10 units"
                                  >
                                    -10
                                  </Button>
                                </div>
                              </td>
                            </motion.tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Inventory Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-red-600 dark:text-red-400 text-2xl font-bold">
                        {products.filter(p => p.stock === 0 && p.status === "active").length}
                      </div>
                      <div className="text-red-600 dark:text-red-400 text-sm">Out of Stock</div>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-orange-600 dark:text-orange-400 text-2xl font-bold">
                        {products.filter(p => p.stock > 0 && p.stock <= 10 && p.status === "active").length}
                      </div>
                      <div className="text-orange-600 dark:text-orange-400 text-sm">Low Stock</div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-green-600 dark:text-green-400 text-2xl font-bold">
                        {products.filter(p => p.stock > 10 && p.status === "active").length}
                      </div>
                      <div className="text-green-600 dark:text-green-400 text-sm">In Stock</div>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-blue-600 dark:text-blue-400 text-2xl font-bold">
                        {products.filter(p => p.status === "active").reduce((total, p) => total + p.stock, 0)}
                      </div>
                      <div className="text-blue-600 dark:text-blue-400 text-sm">Total Units</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Product
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productPrice">Price</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productCategory">Category</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Shoes">Shoes</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                          <SelectItem value="Outerwear">Outerwear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productStock">Stock</Label>
                      <Input
                        id="productStock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="productDescription">Description</Label>
                      <Textarea
                        id="productDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Enter product description"
                      />
                    </div>
                  </div>
                  <Button onClick={handleAddProduct} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Management</CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        console.log('Test button clicked')
                        adjustStock(1, 5)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Test Stock +5 (Product 1)
                    </Button>
                    <Button 
                      onClick={() => {
                        console.log('Test button clicked')
                        adjustStock(1, -3)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Test Stock -3 (Product 1)
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <motion.tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left p-3 font-medium">Name</th>
                          <th className="text-left p-3 font-medium">Price</th>
                          <th className="text-left p-3 font-medium">Category</th>
                          <th className="text-left p-3 font-medium">Stock</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Actions</th>
                        </motion.tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <motion.tr
                            key={product.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="p-3">{product.name}</td>
                            <td className="p-3">${product.price}</td>
                            <td className="p-3">{product.category}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                {editingStock === product.id ? (
                                  <div className="flex items-center gap-1">
                                    <Input
                                      type="number"
                                      value={stockInput}
                                      onChange={(e) => setStockInput(e.target.value)}
                                      className="w-16 h-6 text-xs"
                                      min="0"
                                      onKeyDown={(e) => handleStockInputKeyDown(e, product.id)}
                                      autoFocus
                                      onBlur={() => saveStock(product.id)}
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => saveStock(product.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      ✓
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={cancelEditingStock}
                                      className="h-6 w-6 p-0"
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          adjustStock(product.id, -1)
                                        }}
                                        disabled={product.stock <= 0}
                                        className="h-6 w-6 p-0 hover:bg-red-100"
                                        title="Decrease by 1"
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span 
                                        className={`min-w-[3rem] text-center font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1 rounded ${
                                          product.stock === 0 ? 'text-red-600 bg-red-50' :
                                          product.stock <= 10 ? 'text-orange-600 bg-orange-50' :
                                          product.stock <= 25 ? 'text-yellow-600 bg-yellow-50' :
                                          'text-green-600 bg-green-50'
                                        }`}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          startEditingStock(product.id, product.stock)
                                        }}
                                        title="Click to edit stock"
                                      >
                                        {product.stock}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          adjustStock(product.id, 1)
                                        }}
                                        className="h-6 w-6 p-0 hover:bg-green-100"
                                        title="Increase by 1"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <div className="flex flex-col gap-0">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          adjustStock(product.id, 10)
                                        }}
                                        className="h-4 w-6 p-0 hover:bg-green-100"
                                        title="Add 10"
                                      >
                                        <ChevronUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          adjustStock(product.id, -10)
                                        }}
                                        disabled={product.stock <= 10}
                                        className="h-4 w-6 p-0 hover:bg-red-100"
                                        title="Remove 10"
                                      >
                                        <ChevronDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge 
                                variant={product.status === "active" ? "default" : "secondary"}
                                className={product.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                              >
                                {product.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleProductStatus(product.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Staff Member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="staffName">Full Name</Label>
                      <Input
                        id="staffName"
                        value={newStaff.name}
                        onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="staffEmail">Email</Label>
                      <Input
                        id="staffEmail"
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="staffRole">Role</Label>
                      <Select
                        value={newStaff.role}
                        onValueChange={(value) => setNewStaff({...newStaff, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleAddStaff} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Staff Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <motion.tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left p-3 font-medium">Name</th>
                          <th className="text-left p-3 font-medium">Email</th>
                          <th className="text-left p-3 font-medium">Role</th>
                          <th className="text-left p-3 font-medium">Join Date</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Actions</th>
                        </motion.tr>
                      </thead>
                      <tbody>
                        {staff.map((member) => (
                          <motion.tr
                            key={member.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="p-3">{member.name}</td>
                            <td className="p-3">{member.email}</td>
                            <td className="p-3">
                              <Badge variant="outline" className="capitalize">
                                {member.role}
                              </Badge>
                            </td>
                            <td className="p-3">{member.joinDate}</td>
                            <td className="p-3">
                              <Badge 
                                variant={member.status === "active" ? "default" : "secondary"}
                                className={member.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                              >
                                {member.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditStaff(member)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleStaffStatus(member.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteStaff(member.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Store Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input id="storeName" defaultValue="Madhur Fashion" />
                      </div>
                      <div>
                        <Label htmlFor="storeEmail">Store Email</Label>
                        <Input id="storeEmail" defaultValue="info@madhurfashion.com" />
                      </div>
                      <div>
                        <Label htmlFor="storePhone">Store Phone</Label>
                        <Input id="storePhone" defaultValue="+91 98765 43210" />
                      </div>
                      <div>
                        <Label htmlFor="storeAddress">Store Address</Label>
                        <Input id="storeAddress" defaultValue="123 Fashion Street, Mumbai" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Low Stock Alerts</h4>
                          <p className="text-sm text-gray-600">Get notified when products are low in stock</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
