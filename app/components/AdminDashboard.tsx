import { SelectItem, SelectContent, SelectValue, SelectTrigger } from "@/components/ui/select"
import { Select } from "@/components/ui/select"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Package, DollarSign, Users, Loader2, Star, Upload, Save, AlertCircle, Check } from "lucide-react"
import { useAuth } from "./AuthProvider"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Product, DatabaseService } from '@/lib/supabase'

interface Staff {
  id: string
  username: string
  email: string
  role: "owner" | "staff"
}

// Fashion categories and subcategories
const CATEGORIES = {
  Traditional: ["Sherwanis", "Lehengas", "Suits", "Sarees", "Indo-Western"],
  Formal: ["Business Suits", "Blazers", "Formal Shirts", "Dress Pants", "Formal Dresses"],
  Casual: ["T-Shirts", "Jeans", "Casual Shirts", "Shorts", "Casual Dresses"],
  Footwear: ["Formal Shoes", "Casual Shoes", "Sandals", "Boots", "Ethnic Footwear"],
  Accessories: ["Ties", "Belts", "Watches", "Jewelry", "Bags"]
}

const OCCASIONS = ["Wedding", "Party", "Formal", "Casual", "Festival", "Reception", "Sangeet", "Business"]
const COLORS = ["Red", "Blue", "Black", "White", "Gold", "Silver", "Green", "Pink", "Purple", "Orange", "Yellow", "Brown", "Maroon", "Navy"]
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

const initialStaff: Staff[] = [
  { id: "s1", username: "kailashjeswani", email: "kailashjeswani@madhurfashion.com", role: "owner" },
  { id: "s2", username: "staff1", email: "staff1@madhurfashion.com", role: "staff" },
  { id: "s3", username: "staff2", email: "staff2@madhurfashion.com", role: "staff" },
  { id: "s4", username: "manager", email: "manager@madhurfashion.com", role: "staff" },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [staff, setStaff] = useState<Staff[]>(initialStaff)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("products")
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Load products from Supabase database on component mount
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const products = await DatabaseService.getAllProducts()
      setProducts(products)
      console.log('✅ Loaded', products.length, 'products from database')
    } catch (error) {
      console.error('❌ Failed to load products from database:', error)
      toast({
        title: "Database Error",
        description: "Failed to load products from database. Please check your Supabase configuration.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Enhanced Product Management with Supabase Integration
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const newProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
        name: formData.get('productName') as string,
        description: formData.get('productDescription') as string,
        price: Number.parseFloat(formData.get('productPrice') as string),
        image: formData.get('productImage') as string || "/placeholder.svg?height=200&width=200",
        category: formData.get('productCategory') as string,
        subcategory: formData.get('productSubcategory') as string,
        rating: 4.0, // Default rating for new products
        reviews: 0, // Start with 0 reviews
        occasion: selectedOccasions,
        color: selectedColors,
        size: selectedSizes,
        in_stock: Number.parseInt(formData.get('productStock') as string) > 0,
        stock_count: Number.parseInt(formData.get('productStock') as string),
        tags: [
          ...(formData.get('productName') as string).toLowerCase().split(' '),
          formData.get('productCategory') as string,
          formData.get('productSubcategory') as string,
          ...selectedOccasions.map(o => o.toLowerCase()),
          ...selectedColors.map(c => c.toLowerCase())
        ]
      }

      const createdProduct = await DatabaseService.createProduct(newProduct)
      console.log('✅ Product added to database:', createdProduct.name)
      
      await loadProducts() // Reload products from database
      setCurrentProduct(null)
      setSelectedOccasions([])
      setSelectedColors([])
      setSelectedSizes([])
      
      toast({
        title: "Success",
        description: "Product added successfully to database!"
      })
    } catch (error) {
      console.error('❌ Failed to add product to database:', error)
      toast({
        title: "Database Error",
        description: "Failed to add product to database",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentProduct) return
    setLoading(true)
    
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const updates: Partial<Product> = {
        name: formData.get('productName') as string,
        description: formData.get('productDescription') as string,
        price: Number.parseFloat(formData.get('productPrice') as string),
        image: formData.get('productImage') as string,
        category: formData.get('productCategory') as string,
        subcategory: formData.get('productSubcategory') as string,
        occasion: selectedOccasions,
        color: selectedColors,
        size: selectedSizes,
        stock_count: Number.parseInt(formData.get('productStock') as string),
        in_stock: Number.parseInt(formData.get('productStock') as string) > 0,
        tags: [
          ...(formData.get('productName') as string).toLowerCase().split(' '),
          formData.get('productCategory') as string,
          formData.get('productSubcategory') as string,
          ...selectedOccasions.map(o => o.toLowerCase()),
          ...selectedColors.map(c => c.toLowerCase())
        ]
      }

      const updatedProduct = await DatabaseService.updateProduct(currentProduct.id, updates)
      console.log('✅ Product updated in database:', updatedProduct.name)
      
      await loadProducts()
      setCurrentProduct(null)
      setSelectedOccasions([])
      setSelectedColors([])
      setSelectedSizes([])
      
      toast({
        title: "Success",
        description: "Product updated successfully in database!"
      })
    } catch (error) {
      console.error('❌ Failed to update product in database:', error)
      toast({
        title: "Database Error",
        description: "Failed to update product in database",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setLoading(true)
    try {
      await DatabaseService.deleteProduct(id)
      console.log('✅ Product deleted from database')
      
      await loadProducts()
      toast({
        title: "Success",
        description: "Product deleted successfully from database!"
      })
    } catch (error) {
      console.error('❌ Failed to delete product from database:', error)
      toast({
        title: "Database Error",
        description: "Failed to delete product from database",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product)
    setSelectedOccasions(product.occasion || [])
    setSelectedColors(product.color || [])
    setSelectedSizes(product.size || [])
  }

  // Staff Management (Owner only)
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const newStaff: Staff = {
        id: `s${Date.now()}`,
        username: (e.target as any).staffUsername.value,
        email: (e.target as any).staffEmail.value,
        role: (e.target as any).staffRole.value,
      }
      setStaff((prev) => [...prev, newStaff])
      setCurrentStaff(null) // Clear form
      setLoading(false)
    }, 500)
  }

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentStaff) return
    setLoading(true)
    setTimeout(() => {
      setStaff((prev) =>
        prev.map((s) =>
          s.id === currentStaff.id
            ? {
                ...s,
                username: (e.target as any).staffUsername.value,
                email: (e.target as any).staffEmail.value,
                role: (e.target as any).staffRole.value,
              }
            : s,
        ),
      )
      setCurrentStaff(null) // Clear form
      setLoading(false)
    }, 500)
  }

  const handleDeleteStaff = (id: string) => {
    setLoading(true)
    setTimeout(() => {
      setStaff((prev) => prev.filter((s) => s.id !== id))
      setLoading(false)
    }, 500)
  }

  if (!user || (user.role !== "owner" && user.role !== "staff")) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Card className="bg-slate-900 border-red-500/30 text-center p-8">
          <CardTitle className="text-red-400 text-2xl mb-4">Access Denied</CardTitle>
          <CardContent className="text-gray-300">
            You do not have permission to view this page. Please log in as an admin or staff member.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <section className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
      >
        Admin Panel
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-gray-300 mb-10 text-center max-w-2xl mx-auto"
      >
        Manage products, inventory, and staff.
      </motion.p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 bg-gray-800 border-gray-700">
          <TabsTrigger value="products" className="text-white data-[state=active]:bg-purple-600">
            <Package className="mr-2 h-4 w-4" /> Products
          </TabsTrigger>
          <TabsTrigger value="inventory" className="text-white data-[state=active]:bg-purple-600">
            <DollarSign className="mr-2 h-4 w-4" /> Inventory
          </TabsTrigger>
          {user.role === "owner" && (
            <TabsTrigger value="staff" className="text-white data-[state=active]:bg-purple-600">
              <Users className="mr-2 h-4 w-4" /> Staff
            </TabsTrigger>
          )}
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="mt-6">
          <Card className="bg-slate-900 border-purple-500/30 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Product List</CardTitle>
              <Button
                onClick={() => {
                  setCurrentProduct({ 
                    id: "", 
                    name: "", 
                    description: "", 
                    price: 0, 
                    stock_count: 0, 
                    image: "", 
                    category: "",
                    subcategory: "",
                    rating: 4.0,
                    reviews: 0,
                    occasion: [],
                    color: [],
                    size: [],
                    in_stock: true,
                    tags: [],
                    created_at: "",
                    updated_at: ""
                  })
                  setSelectedOccasions([])
                  setSelectedColors([])
                  setSelectedSizes([])
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-gray-300">Image</TableHead>
                      <TableHead className="text-gray-300">Name</TableHead>
                      <TableHead className="text-gray-300">Category</TableHead>
                      <TableHead className="text-gray-300">Price</TableHead>
                      <TableHead className="text-gray-300">Stock</TableHead>
                      <TableHead className="text-gray-300 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
                            <p className="text-gray-400 mt-2">Loading...</p>
                          </TableCell>
                        </TableRow>
                      ) : products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                            No products available.
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="border-gray-700 hover:bg-white/5"
                          >
                            <TableCell>
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-md"
                              />
                            </TableCell>
                            <TableCell className="font-medium text-white">{product.name}</TableCell>
                            <TableCell className="text-gray-300">{product.category}</TableCell>
                            <TableCell className="text-purple-400">${product.price.toFixed(2)}</TableCell>
                            <TableCell className="text-gray-300">{product.stock_count}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-400 hover:bg-blue-400/20 mr-2"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-400 hover:bg-red-400/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {currentProduct && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 bg-white/5 border-purple-500/30 shadow-lg p-6 rounded-lg"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                {currentProduct.id ? "Edit Product" : "Add New Product"}
              </h3>
              <form onSubmit={currentProduct.id ? handleUpdateProduct : handleAddProduct} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-300">Basic Information</h4>
                  <div>
                    <Label htmlFor="productName" className="text-gray-300">
                      Product Name *
                    </Label>
                    <Input
                      id="productName"
                      name="productName"
                      defaultValue={currentProduct.name}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="e.g., Royal Blue Sherwani"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productDescription" className="text-gray-300">
                      Description
                    </Label>
                    <Textarea
                      id="productDescription"
                      name="productDescription"
                      defaultValue={currentProduct.description}
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                      placeholder="Detailed product description..."
                    />
                  </div>
                </div>

                {/* Category and Pricing */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-300">Category & Pricing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="productCategory" className="text-gray-300">
                        Category *
                      </Label>
                      <Select 
                        value={currentProduct.category}
                        onValueChange={(value) => setCurrentProduct(prev => prev ? {...prev, category: value, subcategory: ""} : null)}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {Object.keys(CATEGORIES).map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productSubcategory" className="text-gray-300">
                        Subcategory *
                      </Label>
                      <Select 
                        value={currentProduct.subcategory}
                        onValueChange={(value) => setCurrentProduct(prev => prev ? {...prev, subcategory: value} : null)}
                        disabled={!currentProduct.category}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          {currentProduct.category && CATEGORIES[currentProduct.category as keyof typeof CATEGORIES]?.map((subcat) => (
                            <SelectItem key={subcat} value={subcat}>{subcat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productPrice" className="text-gray-300">
                        Price (₹) *
                      </Label>
                      <Input
                        id="productPrice"
                        name="productPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        defaultValue={currentProduct.price}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="1299.99"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-300">Stock Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="productStock" className="text-gray-300">
                        Stock Quantity *
                      </Label>
                      <Input
                        id="productStock"
                        name="productStock"
                        type="number"
                        min="0"
                        defaultValue={currentProduct.stock_count}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="25"
                      />
                    </div>
                    <div>
                      <Label htmlFor="productImage" className="text-gray-300">
                        Image URL
                      </Label>
                      <Input
                        id="productImage"
                        name="productImage"
                        defaultValue={currentProduct.image}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* Occasions */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-300">Occasions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {OCCASIONS.map((occasion) => (
                      <label key={occasion} className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={selectedOccasions.includes(occasion)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOccasions(prev => [...prev, occasion])
                            } else {
                              setSelectedOccasions(prev => prev.filter(o => o !== occasion))
                            }
                          }}
                          className="text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm">{occasion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-300">Available Colors</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {COLORS.map((color) => (
                      <label key={color} className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedColors(prev => [...prev, color])
                            } else {
                              setSelectedColors(prev => prev.filter(c => c !== color))
                            }
                          }}
                          className="text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-purple-300">Available Sizes</h4>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {SIZES.map((size) => (
                      <label key={size} className="flex items-center space-x-2 text-gray-300">
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSizes(prev => [...prev, size])
                            } else {
                              setSelectedSizes(prev => prev.filter(s => s !== size))
                            }
                          }}
                          className="text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCurrentProduct(null)
                      setSelectedOccasions([])
                      setSelectedColors([])
                      setSelectedSizes([])
                    }}
                    className="border-gray-500/50 text-gray-300 hover:bg-gray-500/10"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {currentProduct.id ? "Update Product" : "Create Product"}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </TabsContent>

        {/* Inventory Tab (simplified, uses product data) */}
        <TabsContent value="inventory" className="mt-6">
          <Card className="bg-white/5 border-purple-500/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Inventory Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-gray-300">Product Name</TableHead>
                      <TableHead className="text-gray-300">Current Stock</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
                            <p className="text-gray-400 mt-2">Loading...</p>
                          </TableCell>
                        </TableRow>
                      ) : products.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                            No inventory data.
                          </TableCell>
                        </TableRow>
                      ) : (
                        products.map((product) => (
                          <motion.tr
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="border-gray-700 hover:bg-white/5"
                          >
                            <TableCell className="font-medium text-white">{product.name}</TableCell>
                            <TableCell className="text-gray-300">{product.stock_count}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  product.stock_count > 20
                                    ? "bg-green-500/20 text-green-400"
                                    : product.stock_count > 5
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {product.stock_count > 20 ? "In Stock" : product.stock_count > 5 ? "Low Stock" : "Out of Stock"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 bg-transparent"
                              >
                                Adjust Stock
                              </Button>
                            </TableCell>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab (Owner only) */}
        {user.role === "owner" && (
          <TabsContent value="staff" className="mt-6">
            <Card className="bg-white/5 border-purple-500/30 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Staff Accounts</CardTitle>
                <Button
                  onClick={() => setCurrentStaff({ id: "", username: "", email: "", role: "staff" })}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Staff
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-gray-300">Username</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Role</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
                              <p className="text-gray-400 mt-2">Loading...</p>
                            </TableCell>
                          </TableRow>
                        ) : staff.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                              No staff accounts.
                            </TableCell>
                          </TableRow>
                        ) : (
                          staff.map((member) => (
                            <motion.tr
                              key={member.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ duration: 0.3 }}
                              className="border-gray-700 hover:bg-white/5"
                            >
                              <TableCell className="font-medium text-white">{member.username}</TableCell>
                              <TableCell className="text-gray-300">{member.email}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    member.role === "owner"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-blue-500/20 text-blue-400"
                                  }`}
                                >
                                  {member.role}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setCurrentStaff(member)}
                                  className="text-blue-400 hover:bg-blue-400/20 mr-2"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteStaff(member.id)}
                                  className="text-red-400 hover:bg-red-400/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))
                        )}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {currentStaff && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 bg-white/5 border-purple-500/30 shadow-lg p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {currentStaff.id ? "Edit Staff Member" : "Add New Staff Member"}
                </h3>
                <form onSubmit={currentStaff.id ? handleUpdateStaff : handleAddStaff} className="space-y-4">
                  <div>
                    <Label htmlFor="staffUsername" className="text-gray-300">
                      Username
                    </Label>
                    <Input
                      id="staffUsername"
                      name="staffUsername"
                      defaultValue={currentStaff.username}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="staffEmail" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="staffEmail"
                      name="staffEmail"
                      type="email"
                      defaultValue={currentStaff.email}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="staffRole" className="text-gray-300">
                      Role
                    </Label>
                    <Select
                      value={currentStaff.role}
                      onValueChange={(value) =>
                        setCurrentStaff((prev) => (prev ? { ...prev, role: value as "owner" | "staff" } : null))
                      }
                    >
                      <SelectTrigger id="staffRole" className="w-full bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="staff">Staff</SelectItem>
                        {user.role === "owner" && <SelectItem value="owner">Owner</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStaff(null)}
                      className="border-gray-500/50 text-gray-300 hover:bg-gray-500/10"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {currentStaff.id ? "Update Staff" : "Add Staff"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </section>
  )
}
