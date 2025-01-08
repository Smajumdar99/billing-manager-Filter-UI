import { FC, ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/atoms/Input'

interface SearchBarProps {
  placeholder?: string
  className?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const SearchBar: FC<SearchBarProps> = ({
  placeholder = "Search anything...",
  className,
  value,
  onChange
}) => {
  return (
    <div className={cn("relative max-w-2xl w-full", className)}>
      <MagnifyingGlassIcon 
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" 
      />
      <Input 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full pl-9",
          "bg-white/90 dark:bg-white/10",
          "focus:bg-white dark:focus:bg-background",
          "transition-colors"
        )}
      />
    </div>
  )
} 