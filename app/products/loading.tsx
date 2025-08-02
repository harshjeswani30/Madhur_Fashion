import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="flex flex-col items-center">
        <Loader2 className="h-16 w-16 animate-spin text-purple-400" />
        <p className="mt-4 text-lg text-gray-300">Loading products...</p>
      </div>
    </div>
  )
}
