
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-glass text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn-glass",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/40 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] hover:text-cyan-300",
        destructive:
          "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/40 hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]",
        outline:
          "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:text-cyan-300",
        secondary:
          "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/40 hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-400 hover:shadow-[0_0_25px_rgba(0,255,136,0.4)]",
        ghost: 
          "text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 border-transparent hover:border-cyan-500/30",
        link: 
          "text-cyan-400 underline-offset-4 hover:underline hover:text-cyan-300 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)] border-transparent",
        neon: 
          "bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-white border-cyan-500/50 hover:from-cyan-500/40 hover:to-purple-500/40 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] relative overflow-hidden",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      glow: {
        none: "",
        cyan: "shadow-[0_0_15px_rgba(0,255,255,0.3)]",
        green: "shadow-[0_0_15px_rgba(0,255,136,0.3)]",
        pink: "shadow-[0_0_15px_rgba(255,0,128,0.3)]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, glow, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, glow, className }))}
        ref={ref}
        {...props}
      >
        {variant === "neon" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
