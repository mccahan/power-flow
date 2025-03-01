import type React from "react"
import { cn } from "@/lib/utils"

interface OverlayProps {
  show: boolean
  children: React.ReactNode
}

export default function Overlay({ show, children }: OverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300",
        show ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {children}
    </div>
  )
}

