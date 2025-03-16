import * as React from "react"
import { cn } from "../../lib/utils"

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}

export function Tooltip({
  children,
  content,
  side = "bottom",
  align = "center",
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [actualSide, setActualSide] = React.useState(side)
  const tooltipRef = React.useRef<HTMLDivElement>(null)
  const childRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Reset actual side when requested side changes
  React.useEffect(() => {
    setActualSide(side)
  }, [side])

  // Calculate position based on side and align
  React.useEffect(() => {
    if (isVisible && childRef.current && tooltipRef.current && containerRef.current) {
      const childRect = childRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()
      
      // Determine if we need to flip the tooltip
      let finalSide = actualSide
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const margin = 10 // Minimum margin from viewport edge
      
      // Check if tooltip would go off screen and flip if needed
      if (finalSide === "top" && containerRect.top - tooltipRect.height - margin < 0) {
        finalSide = "bottom"
        setActualSide("bottom")
      } else if (finalSide === "bottom" && containerRect.bottom + tooltipRect.height + margin > viewportHeight) {
        finalSide = "top"
        setActualSide("top")
      } else if (finalSide === "left" && containerRect.left - tooltipRect.width - margin < 0) {
        finalSide = "right"
        setActualSide("right")
      } else if (finalSide === "right" && containerRect.right + tooltipRect.width + margin > viewportWidth) {
        finalSide = "left"
        setActualSide("left")
      }
      
      let x = 0
      let y = 0
      
      // Calculate position based on final side
      switch (finalSide) {
        case "top":
          y = -tooltipRect.height - 8
          x = (childRect.width - tooltipRect.width) / 2
          break
        case "bottom":
          y = childRect.height + 8
          x = (childRect.width - tooltipRect.width) / 2
          break
        case "left":
          x = -tooltipRect.width - 8
          y = (childRect.height - tooltipRect.height) / 2
          break
        case "right":
          x = childRect.width + 8
          y = (childRect.height - tooltipRect.height) / 2
          break
      }
      
      // Adjust for alignment
      if ((finalSide === "top" || finalSide === "bottom") && align !== "center") {
        if (align === "start") {
          x = 0
        } else if (align === "end") {
          x = childRect.width - tooltipRect.width
        }
      } else if ((finalSide === "left" || finalSide === "right") && align !== "center") {
        if (align === "start") {
          y = 0
        } else if (align === "end") {
          y = childRect.height - tooltipRect.height
        }
      }
      
      // Calculate absolute position of tooltip in viewport
      const absoluteLeft = containerRect.left + x
      const absoluteRight = absoluteLeft + tooltipRect.width
      const absoluteTop = containerRect.top + y
      const absoluteBottom = absoluteTop + tooltipRect.height
      
      // Adjust horizontal position if needed
      if (absoluteRight > viewportWidth - margin) {
        x -= (absoluteRight - (viewportWidth - margin))
      }
      if (absoluteLeft < margin) {
        x += (margin - absoluteLeft)
      }
      
      // Adjust vertical position if needed
      if (absoluteBottom > viewportHeight - margin) {
        y -= (absoluteBottom - (viewportHeight - margin))
      }
      if (absoluteTop < margin) {
        y += (margin - absoluteTop)
      }
      
      tooltipRef.current.style.left = `${x}px`
      tooltipRef.current.style.top = `${y}px`
    }
  }, [isVisible, side, align, actualSide])

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      ref={containerRef}
    >
      <div ref={childRef}>
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md shadow-sm",
            "animate-in fade-in-0 zoom-in-95 pointer-events-none",
            className
          )}
        >
          {content}
          <div
            className={cn(
              "absolute w-2 h-2 bg-gray-900 rotate-45",
              actualSide === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
              actualSide === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
              actualSide === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
              actualSide === "right" && "left-[-4px] top-1/2 -translate-y-1/2"
            )}
          />
        </div>
      )}
    </div>
  )
} 