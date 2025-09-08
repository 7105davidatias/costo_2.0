
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'neon' | 'minimal'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "textarea-glass",
      neon: "textarea-glass border-cyan-500/50 focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(0,255,255,0.4)]",
      minimal: "bg-transparent border-2 border-slate-600 focus:border-cyan-400 focus:shadow-none"
    }

    return (
      <textarea
        className={cn(
          "flex w-full rounded-glass text-sm ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2",
          "glass-scrollbar",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
