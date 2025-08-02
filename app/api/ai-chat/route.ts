import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI client
let genAI: GoogleGenerativeAI | null = null

if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

// Fashion-focused system prompt to train the AI assistant
const FASHION_SYSTEM_PROMPT = `You are Madhur Fashion AI Assistant, an expert personal stylist and fashion consultant specializing in Indian and international fashion. 

IMPORTANT: The store may not have inventory yet, so provide general fashion advice while being helpful and professional.

1. FASHION EXPERTISE:
- Traditional Indian wear (sarees, lehengas, sherwanis, kurtas, suits, anarkali)
- Western fashion (formal wear, casual wear, party wear)
- Seasonal trends and color coordination
- Body type styling and size recommendations
- Fabric knowledge and care instructions
- Occasion-appropriate dressing

2. CONSULTATION APPROACH:
- Provide expert fashion advice regardless of current inventory status
- Ask detailed questions about occasion, preferences, budget, body type
- Suggest style categories and types of clothing items
- Provide color coordination and styling tips
- Offer fabric and fit recommendations
- Give styling advice for different body types

3. INVENTORY AWARENESS:
- If products are available, mention that specific items can be shown
- If no inventory, focus on general styling advice and recommendations
- Always be helpful and provide value through expert knowledge
- Guide customers on what to look for when shopping

4. COMMUNICATION STYLE:
- Be warm, friendly, and professional fashion consultant
- Ask clarifying questions about occasion, personal style, budget
- Provide specific, actionable fashion advice
- Share styling tips and current trends
- Be encouraging and confidence-building

5. RESPONSE APPROACH:
- Start by understanding customer's needs and preferences
- Provide expert styling advice based on occasion/requirements
- Suggest specific types of garments, colors, and styles
- Ask follow-up questions to refine recommendations
- Mention that you can show available products if inventory exists

Always focus on providing valuable fashion consultation and styling advice, building customer confidence and helping them make informed fashion choices.`

export async function POST(request: NextRequest) {
  try {
    const { message, language, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || !genAI) {
      console.error('Gemini API key not configured')
      return NextResponse.json(
        { 
          error: 'AI service not configured',
          fallbackResponse: language === 'hi' 
            ? `आपके सवाल "${message}" के लिए धन्यवाद। कृपया बताएं कि आप किस प्रकार की स्टाइलिंग की तलाश में हैं?`
            : `Thank you for asking about "${message}". Could you tell me what kind of styling you're looking for?`
        },
        { status: 200 }
      )
    }

    console.log('Processing AI request:', { message, language, historyLength: conversationHistory?.length || 0 })

    // Prepare conversation context for Gemini
    let conversationContext = ''
    if (conversationHistory && conversationHistory.length > 0) {
      conversationContext = '\n\nPrevious conversation:\n' + 
        conversationHistory.slice(-6).map((msg: any) => 
          `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`
        ).join('\n') + '\n\n'
    }

    // Create the prompt for Gemini
    const prompt = `${FASHION_SYSTEM_PROMPT}

${language === 'hi' ? 
  'Please respond in Hindi (हिंदी में जवाब दें) using natural, conversational tone.' : 
  'Please respond in English using a warm, professional tone.'}

${conversationContext}Current user message: ${message}

Please provide a helpful, personalized fashion advice response:`

    // Call Gemini API with improved error handling
    console.log('Calling Gemini API...')
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.7,
      },
    })

    const response = await result.response
    const aiResponse = response.text()

    console.log('Gemini response received:', aiResponse?.substring(0, 100))

    if (!aiResponse) {
      throw new Error('No response content from Gemini')
    }

    return NextResponse.json({
      response: aiResponse,
      language: language,
      success: true
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    
    // Get the request data for better fallback response
    let requestData
    try {
      requestData = await request.json()
    } catch {
      requestData = { language: 'en', message: 'fashion help' }
    }
    
    // Provide contextual fallback response instead of generic one
    const contextualFallback = requestData.language === 'hi' 
      ? `आपके सवाल "${requestData.message || 'फैशन सलाह'}" के लिए धन्यवाद। मैं आपकी मदद करना चाहूंगा। कृपया बताएं कि आप किस अवसर के लिए कपड़े खोज रहे हैं?`
      : `Thank you for asking about "${requestData.message || 'fashion advice'}". I'd love to help you! Could you tell me what occasion you're shopping for or what style you prefer?`

    return NextResponse.json({
      response: contextualFallback,
      error: 'API temporarily unavailable - using enhanced fallback',
      debug: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
