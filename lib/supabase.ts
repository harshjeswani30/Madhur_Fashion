import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Tables Interface
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  subcategory: string
  rating: number
  reviews: number
  occasion: string[]
  color: string[]
  size: string[]
  in_stock: boolean
  stock_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  username: string
  email: string
  role: 'owner' | 'staff'
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: 'customer' | 'staff' | 'owner'
  avatar?: string
  profile_complete?: boolean
  measurements?: {
    size: string
    height: string
    weight: string
  }
  preferences?: {
    style: string
    colors: string[]
  }
  created_at: string
  updated_at: string
}

// Database helper functions
export class DatabaseService {
  
  // Products
  static async getAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async getProductsByCategory(category: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async searchProducts(searchTerm: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }

  // Staff Management
  static async getAllStaff() {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async createStaff(staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('staff')
      .insert([staff])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateStaff(id: string, updates: Partial<Staff>) {
    const { data, error } = await supabase
      .from('staff')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteStaff(id: string) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}
