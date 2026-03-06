"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!password || !confirm) {
      setError("All fields are required.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setLoading(true)
    try {
      // TODO: Replace with real API call
      await new Promise((res) => setTimeout(res, 1000))
      setSuccess(true)
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold mt-4 text-green-700">Reset Password</h1>
          <p className="text-gray-500 mt-2 text-center">Enter your new password below.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full space-y-6">
          <form onSubmit={handleReset} className="space-y-6">
            {success ? (
              <div className="text-green-600 text-sm mb-4">Your password has been reset. <Link href="/login" className="underline">Sign in</Link></div>
            ) : (
              <>
                <div>
                  <label className="block mb-1 font-medium">New Password</label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Confirm Password</label>
                  <Input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                </div>
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </>
            )}
            <div className="flex justify-between text-sm mt-2">
              <Link href="/login" className="text-green-700 hover:underline">Back to login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 