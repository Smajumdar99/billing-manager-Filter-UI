import { cn } from "@/lib/utils"
import { forwardRef, InputHTMLAttributes } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2",
          "text-sm ring-offset-background",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-[#00AAEE]/20 focus:border-[#00AAEE]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input" 