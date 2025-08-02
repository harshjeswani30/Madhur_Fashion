// This file now imports the Product interface from Supabase
// The actual product data is managed through the database
export { type Product } from './supabase'

// For backward compatibility, you can get products from the database
import { DatabaseService } from './supabase'

export async function getProducts() {
  return await DatabaseService.getAllProducts()
}

export async function getProductById(id: string) {
  const products = await DatabaseService.getAllProducts()
  return products.find(p => p.id === id)
}

export async function searchProducts(query: string, filters?: any) {
  if (filters?.category) {
    return await DatabaseService.getProductsByCategory(filters.category)
  }
  return await DatabaseService.searchProducts(query)
}

// Helper functions for product filtering (using database)
export const getProductsByCategory = async (category: string) => {
  return await DatabaseService.getProductsByCategory(category)
}

export const getProductsByOccasion = async (occasion: string) => {
  return await DatabaseService.searchProducts(occasion)
}

export const getProductsByTags = async (tags: string[]) => {
  return await DatabaseService.searchProducts(tags.join(' '))
}

export const getInStockProducts = async () => {
  return await DatabaseService.getAllProducts()
}

export const getAllCategories = async (): Promise<string[]> => {
  const products = await DatabaseService.getAllProducts()
  return [...new Set(products.map((product: any) => product.category))]
}

export const getAllOccasions = async (): Promise<string[]> => {
  const products = await DatabaseService.getAllProducts()
  const occasions = products.flatMap((product: any) => product.occasion || [])
  return [...new Set(occasions)]
}

// Legacy mock data (no longer used - kept for reference)
// All product data is now stored in Supabase database
