import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export interface MultiSelectOption {
  value: string
  label: string
  description?: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  maxHeight?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Search and select...",
  className,
  maxHeight = "200px"
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    !value.includes(option.value) && (
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  )

  // Get selected option details
  const selectedOptions = value.map(val => 
    options.find(opt => opt.value === val)
  ).filter(Boolean) as MultiSelectOption[]

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optionValue: string) => {
    if (!value.includes(optionValue)) {
      onChange([...value, optionValue])
    }
    setSearchTerm('')
    inputRef.current?.focus()
  }

  const handleRemove = (optionValue: string) => {
    onChange(value.filter(val => val !== optionValue))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && searchTerm === '' && value.length > 0) {
      // Remove last selected item on backspace when input is empty
      handleRemove(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchTerm('')
    } else if (e.key === 'Enter' && filteredOptions.length > 0) {
      e.preventDefault()
      handleSelect(filteredOptions[0].value)
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Main Input Container */}
      <div 
        className={cn(
          "min-h-[32px] w-full border border-gray-300 rounded-md bg-white px-3 py-1",
          "flex flex-wrap items-center gap-1 cursor-text",
          "focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
          isOpen && "ring-2 ring-blue-500 border-blue-500"
        )}
        onClick={() => {
          setIsOpen(true)
          inputRef.current?.focus()
        }}
      >
        {/* Selected Items as Chips */}
        {selectedOptions.map(option => (
          <div
            key={option.value}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium"
          >
            <span>{option.label}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleRemove(option.value)
              }}
              className="text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-sm py-1"
        />
        
        {/* Dropdown Arrow */}
        <ChevronDownIcon 
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            isOpen && "transform rotate-180"
          )} 
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
          style={{ maxHeight }}
        >
          {filteredOptions.length > 0 ? (
            <div className="overflow-auto" style={{ maxHeight }}>
              {filteredOptions.map(option => (
                <div
                  key={option.value}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelect(option.value)}
                >
                  <div className="font-medium text-sm text-gray-900">
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {option.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              {searchTerm ? `No results found for "${searchTerm}"` : 'No more options available'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MultiSelect