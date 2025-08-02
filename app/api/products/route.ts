import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, Product } from '@/lib/supabase'

// GET /api/products - Fetch all products with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const inStock = searchParams.get('inStock')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    console.log('🔍 Fetching products with filters:', { category, search, inStock, limit })
    
    let products: Product[] = []

    // Apply different fetching strategies based on filters
    if (search) {
      products = await DatabaseService.searchProducts(search)
    } else if (category && category !== 'all') {
      products = await DatabaseService.getProductsByCategory(category)
    } else {
      products = await DatabaseService.getAllProducts()
    }

    // Apply additional client-side filters
    if (inStock === 'true') {
      products = products.filter(product => product.in_stock && product.stock_count > 0)
    }

    // Limit results
    const limitedProducts = products.slice(0, limit)
    
    // Convert to object format for compatibility with existing frontend
    const productsObject = Object.fromEntries(limitedProducts.map(p => [p.id, p]))
    
    const totalFound = limitedProducts.length
    const hasInventory = totalFound > 0

    console.log(`✅ Found ${totalFound} products in database`)

    return NextResponse.json({
      products: productsObject,
      productsArray: limitedProducts, // Also provide as array for easier consumption
      totalFound,
      hasInventory,
      message: hasInventory 
        ? `Found ${totalFound} products` 
        : "No products available in inventory. Please add products through admin panel.",
      success: true
    })
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json({
      products: {},
      productsArray: [],
      totalFound: 0,
      hasInventory: false,
      message: "Error fetching products from database",
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/products - Add new product
export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: name, price, category"
      }, { status: 400 })
    }

    // Prepare product data for database
    const productToAdd = {
      name: productData.name,
      description: productData.description || '',
      price: parseFloat(productData.price),
      image: productData.image || '/placeholder.svg?height=200&width=200',
      category: productData.category,
      subcategory: productData.subcategory || '',
      rating: productData.rating || 4.0,
      reviews: productData.reviews || 0,
      occasion: productData.occasion || [],
      color: productData.color || [],
      size: productData.size || [],
      stock_count: parseInt(productData.stockCount) || 0,
      in_stock: (parseInt(productData.stockCount) || 0) > 0,
      tags: productData.tags || [
        productData.name?.toLowerCase(),
        productData.category?.toLowerCase(),
        productData.subcategory?.toLowerCase(),
        ...(productData.occasion || []).map((o: string) => o.toLowerCase()),
        ...(productData.color || []).map((c: string) => c.toLowerCase())
      ].filter(Boolean)
    }

    const newProduct = await DatabaseService.createProduct(productToAdd)
    
    console.log('✅ Product added to database:', newProduct.name)
    
    return NextResponse.json({
      success: true,
      message: "Product added successfully to database",
      product: newProduct
    })
  } catch (error) {
    console.error('❌ Error adding product to database:', error)
    return NextResponse.json({
      success: false,
      message: "Failed to add product to database",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
