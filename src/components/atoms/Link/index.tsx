import { cn } from "@/lib/utils"
import { AnchorHTMLAttributes, forwardRef } from "react"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'muted'
  size?: 'sm' | 'base'
  external?: boolean
  /** Additional description for screen readers */
  srText?: string
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ 
    className, 
    variant = "default", 
    size = "sm", 
    children, 
    external,
    href,
    srText,
    ...props 
  }, ref) => {
    const ariaLabel = srText || (external ? `${children} (opens in new tab)` : undefined)

    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "font-manrope transition-colors inline-flex items-center gap-1",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "underline-offset-4 hover:underline",
          "motion-reduce:transition-none",
          {
            "text-primary hover:text-primary/90": variant === "default",
            "text-muted-foreground hover:text-foreground": variant === "muted",
          },
          {
            "text-sm leading-5": size === "sm",
            "text-base leading-6": size === "base",
          },
          className
        )}
        {...(external ? {
          target: "_blank",
          rel: "noopener noreferrer",
        } : {})}
        aria-label={ariaLabel}
        {...props}
      >
        <span className="break-words">{children}</span>
        {external && (
          <ArrowTopRightOnSquareIcon 
            className="h-4 w-4 shrink-0" 
            aria-hidden="true"
          />
        )}
      </a>
    )
  }
)

Link.displayName = "Link" 