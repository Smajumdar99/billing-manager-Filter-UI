import { FC } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gray-100 text-gray-700 hover:bg-gray-200",
        secondary:
          "bg-gray-50 text-gray-600 hover:bg-gray-100",
        destructive:
          "bg-red-50 text-red-700 hover:bg-red-100",
        success:
          "bg-green-50 text-green-700 hover:bg-green-100",
        outline:
          "text-gray-500 border border-gray-200 hover:bg-gray-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: FC<BadgeProps> = ({
  className,
  variant,
  ...props
}) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
} 