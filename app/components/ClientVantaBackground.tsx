"use client"

import dynamic from "next/dynamic"

// Dynamically import VantaBackground to prevent SSR hydration issues
const VantaBackground = dynamic(() => import("./VantaBackground"), {
  ssr: false,
  loading: () => null // No loading component to prevent hydration mismatch
})

export default function ClientVantaBackground() {
  return <VantaBackground />
}
