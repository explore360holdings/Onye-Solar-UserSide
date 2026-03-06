"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, Facebook, Twitter, Mail, MessageCircle, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  productUrl: string
  productPrice: number
}

export function ShareDialog({ isOpen, onClose, productName, productUrl, productPrice }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const shareText = `Check out ${productName} - ₦${productPrice}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      color: "text-gray-700",
      action: handleCopyLink,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
          "_blank",
          "width=600,height=400"
        )
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-sky-500",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`,
          "_blank",
          "width=600,height=400"
        )
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "text-green-600",
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`,
          "_blank"
        )
      },
    },
    {
      name: "Email",
      icon: Mail,
      color: "text-red-600",
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(productName)}&body=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`
      },
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">{productName}</p>
            <p className="text-xs text-gray-600 break-all">{productUrl}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {shareOptions.map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.name}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-gray-50"
                  onClick={option.action}
                >
                  <Icon className={`w-6 h-6 ${option.color}`} />
                  <span className="text-xs">{option.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
