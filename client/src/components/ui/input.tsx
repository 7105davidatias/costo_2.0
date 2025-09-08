
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'neon' | 'minimal'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "input-glass",
      neon: "input-glass border-cyan-500/50 focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(0,255,255,0.4)]",
      minimal: "bg-transparent border-b-2 border-slate-600 focus:border-cyan-400 rounded-none px-0 focus:shadow-none"
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-glass px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
