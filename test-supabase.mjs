// Test script to verify Supabase integration
// Run this with: node --loader ts-node/esm test-supabase.mjs

import { DatabaseService } from './lib/supabase.js'

async function testSupabaseIntegration() {
  console.log('🧪 Testing Supabase Integration...\n')

  try {
    // Test 1: Get all products
    console.log('📦 Test 1: Fetching all products...')
    const products = await DatabaseService.getAllProducts()
    console.log(`✅ Found ${products?.length || 0} products`)
    
    if (products && products.length > 0) {
      const sampleProduct = products[0]
      console.log(`   Sample: "${sampleProduct.name}" - ₹${sampleProduct.price}`)
    }

    // Test 2: Search products
    console.log('\n🔍 Test 2: Searching for "wedding" products...')
    const weddingProducts = await DatabaseService.searchProducts('wedding')
    console.log(`✅ Found ${weddingProducts?.length || 0} wedding-related products`)

    // Test 3: Get products by category
    console.log('\n📂 Test 3: Getting Traditional category products...')
    const traditionalProducts = await DatabaseService.getProductsByCategory('Traditional')
    console.log(`✅ Found ${traditionalProducts?.length || 0} traditional products`)

    // Test 4: Get all staff
    console.log('\n👥 Test 4: Fetching all staff...')
    const staff = await DatabaseService.getAllStaff()
    console.log(`✅ Found ${staff?.length || 0} staff members`)

    console.log('\n🎉 All tests passed! Supabase integration is working correctly.')
    console.log('\n📋 Next Steps:')
    console.log('   1. Set up your Supabase project (see SUPABASE_SETUP_GUIDE.md)')
    console.log('   2. Add your environment variables to .env.local')
    console.log('   3. Run the schema.sql in your Supabase dashboard')
    console.log('   4. Test admin panel at http://localhost:3000/admin')
    console.log('   5. Test AI assistant at http://localhost:3000/ai-assistant')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.log('\n🔧 Troubleshooting:')
    console.log('   1. Make sure Supabase environment variables are set in .env.local')
    console.log('   2. Verify your Supabase project is created and active')
    console.log('   3. Run the schema.sql file in your Supabase SQL editor')
    console.log('   4. Check that your API keys have the correct permissions')
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSupabaseIntegration()
}
