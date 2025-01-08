import React, { CSSProperties } from "react"
import { cn } from "@/lib/utils"

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.09em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      size = 'md',
      disabled,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-6 py-3 text-md",
      lg: "px-8 py-4 text-base"
    }

    return (
      <button
        disabled={disabled}
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 text-white [background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-all duration-200",
          "hover:scale-[1.02] active:scale-[0.98]",
          "hover:brightness-110 dark:hover:brightness-125",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100",
          "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      >
        <div className="-z-30 blur-[2px] absolute inset-0 overflow-visible [container-type:size]">
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1]">
            <div className="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}
        <div className="absolute size-full rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
        <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"

export { ShimmerButton } 