
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 badge-glass",
  {
    variants: {
      variant: {
        default:
          "border-cyan-500/40 text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]",
        secondary:
          "border-green-500/40 text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:border-green-400 hover:shadow-[0_0_15px_rgba(0,255,136,0.4)] badge-success-glass",
        destructive:
          "border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]",
        outline: 
          "border-cyan-500/30 text-cyan-400 bg-transparent hover:bg-cyan-500/10 hover:border-cyan-400",
        neon:
          "border-pink-500/40 text-pink-400 bg-pink-500/10 hover:bg-pink-500/20 hover:border-pink-400 hover:shadow-[0_0_15px_rgba(255,0,128,0.4)] badge-error-glass",
        warning:
          "border-yellow-500/40 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(255,170,0,0.4)] badge-warning-glass",
        success:
          "border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      glow: {
        none: "",
        pulse: "animate-pulse-glow",
        steady: "shadow-[0_0_10px_rgba(0,255,255,0.3)]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, glow, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant, size, glow }), className)} 
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
