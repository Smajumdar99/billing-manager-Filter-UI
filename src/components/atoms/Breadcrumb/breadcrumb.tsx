import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export const Breadcrumb: FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}
    >
      <Link
        to="/"
        className="overflow-hidden text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
      >
        <HomeIcon className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRightIcon className="h-4 w-4" />
          {item.href ? (
            <Link
              to={item.href}
              className="overflow-hidden text-sm font-medium text-muted-foreground hover:text-foreground ml-1"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium ml-1">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
} 