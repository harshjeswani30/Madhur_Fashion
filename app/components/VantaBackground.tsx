"use client"

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    VANTA: any & {
      NET: any
      WAVES: any
    }
    THREE: any
  }
}

export default function VantaBackground() {
  const { theme, resolvedTheme } = useTheme()
  const pathname = usePathname()
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Use resolvedTheme to avoid hydration mismatch
    const currentTheme = resolvedTheme || theme
    
    // Don't initialize Vanta on admin pages
    const isAdminPage = pathname.startsWith('/admin')
    
    // Only initialize after component is mounted and not on admin pages
    if (mounted && !isAdminPage && vantaRef.current && typeof window !== 'undefined') {
      // Clean up any existing effect
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
        vantaEffect.current = null
      }

      // Initialize based on theme
      const initVanta = () => {
        if (!vantaRef.current) return

        try {
          if (currentTheme === 'dark' && window.VANTA && window.VANTA.NET) {
            // Dark theme - NET effect
            vantaEffect.current = window.VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: 0x8b5cf6, // Purple color for the net
              backgroundColor: 0x000000 // Black background
            })
          } else if (currentTheme === 'light' && window.VANTA && window.VANTA.WAVES) {
            // Light theme - WAVES effect
            vantaEffect.current = window.VANTA.WAVES({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00
            })
          }
        } catch (error) {
          console.warn('Failed to initialize Vanta:', error)
        }
      }

      // Check if required scripts are loaded based on theme
      const requiredEffect = currentTheme === 'dark' ? 'NET' : 'WAVES'
      
      if (window.VANTA && window.VANTA[requiredEffect]) {
        initVanta()
      } else {
        // Wait for scripts to load
        const checkVanta = setInterval(() => {
          if (window.VANTA && window.VANTA[requiredEffect]) {
            clearInterval(checkVanta)
            initVanta()
          }
        }, 100)

        // Cleanup interval after 10 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkVanta), 10000)
      }
    } else if (vantaEffect.current) {
      // Destroy effect if on admin page
      vantaEffect.current.destroy()
      vantaEffect.current = null
    }

    // Cleanup function
    return () => {
      if (vantaEffect.current) {
        try {
          vantaEffect.current.destroy()
        } catch (error) {
          console.warn('Error destroying Vanta effect:', error)
        }
        vantaEffect.current = null
      }
    }
  }, [theme, resolvedTheme, mounted, pathname])

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Don't render on admin pages
  const isAdminPage = pathname.startsWith('/admin')
  
  if (isAdminPage) {
    return null
  }

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 z-0"
      style={{ 
        width: '100vw', 
        height: '100vh',
        pointerEvents: 'none' // Allow clicks to pass through
      }}
    />
  )
}
