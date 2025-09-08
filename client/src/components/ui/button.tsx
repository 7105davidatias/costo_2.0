
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-glass text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "glass-button hover:shadow-neon-strong active:transform active:scale-95",
        destructive:
          "glass-panel bg-red-900/30 text-red-400 border-red-500/40 hover:bg-red-900/50 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        outline:
          "glass-panel border-procurement-border-glass hover:border-procurement-primary-neon hover:shadow-neon text-procurement-text-primary",
        secondary:
          "glass-panel bg-procurement-secondary-neon/10 text-procurement-secondary-neon border-procurement-secondary-neon/40 hover:bg-procurement-secondary-neon/20 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]",
        ghost: "hover:bg-procurement-background-glass hover:text-procurement-primary-neon transition-all duration-300",
        link: "text-procurement-primary-neon underline-offset-4 hover:underline hover:shadow-neon",
        neon: "glass-panel bg-gradient-to-r from-procurement-primary-neon/20 to-procurement-secondary-neon/20 text-white border-procurement-primary-neon/50 hover:from-procurement-primary-neon/30 hover:to-procurement-secondary-neon/30 hover:border-procurement-primary-neon hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
