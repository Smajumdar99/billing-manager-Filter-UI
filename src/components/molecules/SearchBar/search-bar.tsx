import { FC } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch?: (query: string) => void
  width?: string
  className?: string
}

export const SearchBar: FC<SearchBarProps> = ({ 
  onSearch,
  width = "w-full",
  className
}) => {
  return (
    <div className={cn(
      "relative bg-white rounded-full px-2 py-1",
      width,
      className
    )}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search..."
        className={cn(
          "h-8 w-full rounded-full bg-transparent pl-9 pr-4 text-sm",
          "placeholder:text-muted-foreground/60",
          "focus:outline-none focus:ring-2 focus:ring-primary/20",
          "transition-all duration-200"
        )}
        onChange={(e) => onSearch?.(e.target.value)}
      />
    </div>
  )
} 