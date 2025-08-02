"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface User {
  id: string
  email: string
  name?: string
  role: "customer" | "staff" | "owner"
  avatar?: string
  profileComplete?: boolean
  measurements?: {
    size: string
    height: string
    weight: string
  }
  preferences?: {
    style: string
    colors: string[]
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUserProfile: (updates: Partial<User>) => Promise<void>
  adminLogin: (email: string, password: string) => Promise<void>
  addStaffCredentials: (email: string, password: string, name: string) => void
  removeStaffCredentials: (email: string) => void
  getStaffList: () => Array<{email: string, name: string}>
}

// Staff credentials management (owner can modify through admin panel)
let staffCredentials: Record<string, string> = {
  "staff1@madhurfashion.com": "Staff123!",
  "staff2@madhurfashion.com": "Staff456!",
  "manager@madhurfashion.com": "Manager789!",
}

// Staff names management
let staffNames: Record<string, string> = {
  "staff1@madhurfashion.com": "Staff Member 1",
  "staff2@madhurfashion.com": "Staff Member 2", 
  "manager@madhurfashion.com": "Store Manager",
}

// Helper function to get staff names
const getStaffName = (email: string): string => {
  return staffNames[email] || "Staff Member"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Load user from session/localStorage
    const storedUser = localStorage.getItem("madhurFashionUser")
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsAuthenticated(true)
    }

    // Load staff credentials from localStorage
    const storedStaffCredentials = localStorage.getItem("madhurFashionStaffCredentials")
    const storedStaffNames = localStorage.getItem("madhurFashionStaffNames")
    
    if (storedStaffCredentials) {
      Object.assign(staffCredentials, JSON.parse(storedStaffCredentials))
    }
    
    if (storedStaffNames) {
      Object.assign(staffNames, JSON.parse(storedStaffNames))
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call for login
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === "user@example.com" && password === "password") {
          const loggedInUser: User = {
            id: "user123",
            email: "user@example.com",
            name: "Guest User",
            role: "customer",
            profileComplete: false, // Simulate incomplete profile for new users
            measurements: { size: "M", height: "", weight: "" },
            preferences: { style: "classic", colors: [] },
          }
          localStorage.setItem("madhurFashionUser", JSON.stringify(loggedInUser))
          setUser(loggedInUser)
          setIsAuthenticated(true)
          resolve()
        } else {
          reject(new Error("Invalid email or password."))
        }
      }, 1000)
    })
  }, [])

  const adminLogin = useCallback(async (email: string, password: string) => {
    // Enhanced admin/staff login with multiple staff members
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Admin/Owner credentials
        if (email === "kailashjeswani@madhurfashion.com" && password === "Kailash8895") {
          const adminUser: User = {
            id: "admin1",
            email: "kailashjeswani@madhurfashion.com",
            name: "Kailash Jeswani",
            role: "owner",
            profileComplete: true,
          }
          localStorage.setItem("madhurFashionUser", JSON.stringify(adminUser))
          setUser(adminUser)
          setIsAuthenticated(true)
          resolve()
        }
        // Staff members - can be expanded by owner
        else if (staffCredentials[email] && staffCredentials[email] === password) {
          const staffUser: User = {
            id: `staff_${Date.now()}`,
            email: email,
            name: getStaffName(email),
            role: "staff",
            profileComplete: true,
          }
          localStorage.setItem("madhurFashionUser", JSON.stringify(staffUser))
          setUser(staffUser)
          setIsAuthenticated(true)
          resolve()
        } else {
          reject(new Error("Invalid admin credentials."))
        }
      }, 1000)
    })
  }, [])

  const register = useCallback(async (username: string, email: string, password: string) => {
    // Simulate API call for registration
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password && username) {
          const newUser: User = {
            id: `user${Date.now()}`,
            email,
            name: username,
            role: "customer",
            profileComplete: false, // New users start with incomplete profile
            measurements: { size: "M", height: "", weight: "" },
            preferences: { style: "classic", colors: [] },
          }
          localStorage.setItem("madhurFashionUser", JSON.stringify(newUser))
          setUser(newUser)
          setIsAuthenticated(true)
          resolve()
        } else {
          reject(new Error("Please provide username, email, and password."))
        }
      }, 1000)
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("madhurFashionUser")
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const updateUserProfile = useCallback(async (updates: Partial<User>) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser((prevUser) => {
          if (!prevUser) return null
          const updatedUser = { ...prevUser, ...updates }
          localStorage.setItem("madhurFashionUser", JSON.stringify(updatedUser))
          return updatedUser
        })
        resolve()
      }, 500)
    })
  }, [])

  // Staff management functions (only for owners)
  const addStaffCredentials = useCallback((email: string, password: string, name: string) => {
    if (user?.role === "owner") {
      staffCredentials[email] = password
      staffNames[email] = name
      // Persist to localStorage for demo purposes
      localStorage.setItem("madhurFashionStaffCredentials", JSON.stringify(staffCredentials))
      localStorage.setItem("madhurFashionStaffNames", JSON.stringify(staffNames))
    }
  }, [user])

  const removeStaffCredentials = useCallback((email: string) => {
    if (user?.role === "owner") {
      delete staffCredentials[email]
      delete staffNames[email]
      // Persist to localStorage for demo purposes
      localStorage.setItem("madhurFashionStaffCredentials", JSON.stringify(staffCredentials))
      localStorage.setItem("madhurFashionStaffNames", JSON.stringify(staffNames))
    }
  }, [user])

  const getStaffList = useCallback(() => {
    return Object.keys(staffCredentials).map(email => ({
      email,
      name: staffNames[email] || "Staff Member"
    }))
  }, [])

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUserProfile,
    adminLogin,
    addStaffCredentials,
    removeStaffCredentials,
    getStaffList,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
