import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(req: NextRequest) {
  try {
    const { items, deliveryAddress } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart." }, { status: 400 })
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "inr", // Assuming Indian Rupees as per previous context
        product_data: {
          name: item.name,
          images: [item.image || "https://via.placeholder.com/150"], // Fallback image
        },
        unit_amount: Math.round(item.price * 100), // Convert to smallest currency unit (paise)
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.nextUrl.origin}/cart?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cart?status=cancel`,
      metadata: {
        deliveryAddress: deliveryAddress,
        userId: "mock_user_id", // Replace with actual user ID from your auth system
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
