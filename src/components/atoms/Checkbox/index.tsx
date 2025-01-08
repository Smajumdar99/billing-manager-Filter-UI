import { cn } from "@/lib/utils"
import { forwardRef, InputHTMLAttributes } from "react"
import { CheckIcon } from "@heroicons/react/24/outline"

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  indeterminate?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, checked, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative inline-flex">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-md border border-input bg-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "checked:bg-primary checked:border-primary",
            "indeterminate:bg-primary indeterminate:border-primary",
            "transition-colors duration-200",
            className
          )}
          {...props}
        />
        <CheckIcon 
          className={cn(
            "absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 stroke-[3] text-primary-foreground opacity-0",
            "peer-checked:opacity-100 peer-disabled:cursor-not-allowed",
            "transition-opacity duration-200"
          )}
          aria-hidden="true"
        />
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox" 