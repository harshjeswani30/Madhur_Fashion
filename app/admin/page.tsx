"use client"

import AdminDashboard from "../components/AdminDashboard" // Corrected import path
import { useAuth } from "../components/AuthProvider" // Corrected import path

export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()

  // Render AdminDashboard only if authenticated and user role is owner or staff
  if (isAuthenticated && (user?.role === "owner" || user?.role === "staff")) {
    return <AdminDashboard />
  }

  // Optionally, redirect to login or show an access denied message
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <p>Access Denied. Please log in with appropriate credentials.</p>
    </div>
  )
}
