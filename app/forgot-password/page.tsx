"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useForgotPassword } from "@/hooks/useAuth" // ⬅️ Import the custom hook

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [localError, setLocalError] = useState("") // ⬅️ Renamed for clarity

  // ⬅️ Consume the useForgotPassword hook
  const { mutate, isPending, isSuccess, isError, error } = useForgotPassword()

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setLocalError("")

    // ⬅️ Client-side validation
    if (!email) {
      setLocalError("Email is required.")
      return
    }

    // ⬅️ Call the mutation function with the form data
    mutate({ email })
  }

  // ⬅️ Determine the error message to display
  const displayError = localError || (isError && error.message)

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold mt-4 text-green-700">Forgot Password</h1>
          <p className="text-gray-500 mt-2 text-center">Enter your email to receive a password reset link.</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full space-y-6">
          <form onSubmit={handleForgot} className="space-y-6">
            {isSuccess ? (
              // ⬅️ Display success message based on hook state
              <div className="text-green-600 text-sm mb-4">If an account exists for {email}, a reset link has been sent.</div>
            ) : (
              <>
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                </div>
                {displayError && <div className="text-red-600 text-sm">{displayError}</div>}
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Sending..." : "Send Reset Link"}
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

// "use client"
// import { useState } from "react"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")
//   const [sent, setSent] = useState(false)

//   async function handleForgot(e: React.FormEvent) {
//     e.preventDefault()
//     setError("")
//     if (!email) {
//       setError("Email is required.")
//       return
//     }
//     setLoading(true)
//     try {
//       // TODO: Replace with real API call
//       await new Promise((res) => setTimeout(res, 1000))
//       setSent(true)
//     } catch (err) {
//       setError("Failed to send reset email. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-green-50">
//       <div className="w-full max-w-md">
//         <div className="flex flex-col items-center mb-8">
//           <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
//             <span className="text-white font-bold text-2xl">S</span>
//           </div>
//           <h1 className="text-2xl font-bold mt-4 text-green-700">Forgot Password</h1>
//           <p className="text-gray-500 mt-2 text-center">Enter your email to receive a password reset link.</p>
//         </div>
//         <div className="bg-white p-8 rounded-lg shadow-md w-full space-y-6">
//           <form onSubmit={handleForgot} className="space-y-6">
//             {sent ? (
//               <div className="text-green-600 text-sm mb-4">If an account exists for {email}, a reset link has been sent.</div>
//             ) : (
//               <>
//                 <div>
//                   <label className="block mb-1 font-medium">Email</label>
//                   <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
//                 </div>
//                 {error && <div className="text-red-600 text-sm">{error}</div>}
//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? "Sending..." : "Send Reset Link"}
//                 </Button>
//               </>
//             )}
//             <div className="flex justify-between text-sm mt-2">
//               <Link href="/login" className="text-green-700 hover:underline">Back to login</Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// } 