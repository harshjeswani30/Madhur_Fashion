import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'wedding'
  
  try {
    const products = await DatabaseService.getAllProducts()
    return NextResponse.json({
      success: true,
      message: `API working! Found ${products.length} products for query: ${query}`,
      products: products.slice(0, 3),
      totalFound: products.length
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userQuery, query, language = 'en' } = body
    const searchQuery = userQuery || query

    if (!searchQuery) {
      return NextResponse.json({
        success: false,
        message: "Query is required"
      }, { status: 400 })
    }

    console.log('🔍 Analyzing query for product recommendations:', searchQuery)
    
    const allProducts = await DatabaseService.getAllProducts()
    const inStockProducts = allProducts.filter(product => 
      product.in_stock && product.stock_count > 0
    )
    
    if (inStockProducts.length === 0) {
      return NextResponse.json({
        success: true,
        products: [],
        totalFound: 0,
        hasRecommendations: false,
        hasInventory: false,
        message: 'No products available in inventory. Please add products through admin panel.',
        analysis: {
          query: searchQuery,
          reason: "No inventory available"
        }
      })
    }
    
    // Simple text matching for now
    const matchingProducts = inStockProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    
    const finalProducts = matchingProducts.length > 0 
      ? matchingProducts.slice(0, 6)
      : inStockProducts.slice(0, 6)
    
    console.log(`✅ Found ${finalProducts.length} product recommendations from database`)
    
    return NextResponse.json({
      success: true,
      products: finalProducts,
      totalFound: finalProducts.length,
      hasRecommendations: true,
      hasInventory: true,
      message: `Found ${finalProducts.length} recommendations for: ${searchQuery}`,
      analysis: {
        query: searchQuery,
        reason: matchingProducts.length > 0 ? "Text matching" : "Showing all products"
      }
    })
    
  } catch (error) {
    console.error('❌ Error getting product recommendations:', error)
    return NextResponse.json({
      success: false,
      products: [],
      totalFound: 0,
      hasRecommendations: false,
      hasInventory: false,
      message: "Error getting recommendations from database",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
