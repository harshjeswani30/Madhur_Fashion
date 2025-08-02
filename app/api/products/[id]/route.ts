import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService, Product } from '@/lib/supabase'

// PUT /api/products/[id] - Update specific product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const productData = await request.json()

    console.log('🔄 Updating product in database:', id)

    // Prepare update data
    const updateData: Partial<Product> = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      image: productData.image,
      category: productData.category,
      subcategory: productData.subcategory,
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

    const updatedProduct = await DatabaseService.updateProduct(id, updateData)

    console.log('✅ Product updated successfully in database:', updatedProduct.name)

    return NextResponse.json({
      success: true,
      message: "Product updated successfully in database",
      product: updatedProduct
    })
  } catch (error) {
    console.error('❌ Error updating product in database:', error)
    return NextResponse.json({
      success: false,
      message: "Failed to update product in database",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete specific product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    console.log('🗑️ Deleting product from database:', id)

    await DatabaseService.deleteProduct(id)

    console.log('✅ Product deleted successfully from database')

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully from database"
    })
  } catch (error) {
    console.error('❌ Error deleting product from database:', error)
    return NextResponse.json({
      success: false,
      message: "Failed to delete product from database",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET /api/products/[id] - Get specific product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    console.log('🔍 Fetching product from database:', id)

    // Get all products and find the specific one
    const products = await DatabaseService.getAllProducts()
    const product = products.find(p => p.id === id)

    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found in database"
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product: product
    })
  } catch (error) {
    console.error('❌ Error fetching product from database:', error)
    return NextResponse.json({
      success: false,
      message: "Failed to fetch product from database",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
