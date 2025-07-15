import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

// Checkbox component for better visual control
const Checkbox: React.FC<{ checked: boolean; onChange: () => void; className?: string }> = ({ 
  checked, 
  onChange, 
  className 
}) => (
  <div 
    className={cn(
      "w-5 h-5 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200",
      checked 
        ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
        : "border-gray-300 hover:border-blue-400 bg-white hover:bg-blue-50",
      className
    )}
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
  >
    {checked && <CheckIcon className="w-3.5 h-3.5" />}
  </div>
);

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  type?: 'staff' | 'group' | 'department' | 'team';
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  renderOption?: (option: ComboboxOption) => React.ReactNode;
  // NEW: Optionally hide filter tabs (All/Staff/Groups)
  hideFilters?: boolean;
  keepOpenOnSelect?: boolean; // NEW: keep dropdown open after select
  dropdownDirection?: 'down' | 'up'; // NEW: control dropdown direction
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  multiple = true,
  renderOption,
  hideFilters = false,
  keepOpenOnSelect = false, // NEW: default false
  dropdownDirection = 'down', // NEW: default to down
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<'all' | 'staff' | 'group'>('all');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Filtered options based on filter and search
  const filtered = React.useMemo(() => {
    let opts = options;
    if (!hideFilters) {
      if (filter === 'staff') {
        opts = opts.filter(opt => opt.type === 'staff');
      } else if (filter === 'group') {
        opts = opts.filter(opt => opt.type === 'group' || opt.type === 'department' || opt.type === 'team');
      }
    }
    return opts.filter(
      (opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        (opt.description && opt.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [options, search, filter, hideFilters]);

  const handleSelect = (val: string) => {
    if (multiple) {
      if (value.includes(val)) {
        onChange(value.filter((v) => v !== val));
      } else {
        onChange([...value, val]);
      }
      if (!keepOpenOnSelect) setOpen(false); // Only close if not keeping open
    } else {
      onChange([val]);
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-sm text-left shadow-sm",
          open ? "ring-2 ring-primary" : ""
        )}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center">
          {value.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : multiple && value.length > 1 ? (
            // Simple count display for multiple selections
            <span className="text-sm text-gray-900">
              {value.length} selected
            </span>
          ) : (
            // Show single selection
            <span className="text-sm text-gray-900 truncate">
              {options.find(opt => value.includes(opt.value))?.label}
            </span>
          )}
        </span>
        <ChevronDownIcon className="h-4 w-4 ml-2 opacity-50" />
      </button>
      {open && (
        <div className={cn(
          "absolute z-50 w-full min-w-[320px] rounded-md border bg-white shadow-lg max-h-96 overflow-auto",
          dropdownDirection === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'
        )}>
          <div className="p-3 bg-white">
            {/* Filter toggle for staff/groups */}
            <div className="flex flex-col gap-1">
              {/* Filter Tabs (conditionally render) */}
              {!hideFilters && (
                <div className="flex gap-1 mb-1">
                  <button
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      filter === 'all' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700'
                    )}
                    onClick={() => setFilter('all')}
                  >All</button>
                  <button
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      filter === 'staff' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700'
                    )}
                    onClick={() => setFilter('staff')}
                  >Staff</button>
                  <button
                    type="button"
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      filter === 'group' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-700'
                    )}
                    onClick={() => setFilter('group')}
                  >Groups</button>
                </div>
              )}
              <input
                ref={inputRef}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm mb-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.stopPropagation()}
              />
              {filtered.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No options found.
                  {search && (
                    <div className="text-xs text-gray-400 mt-1">
                      Try adjusting your search terms
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Select All / Clear All controls for multiple selection */}
                  {multiple && filtered.length > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                      <span className="text-sm font-medium text-gray-700">
                        {value.length} of {filtered.length} selected
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          onClick={() => {
                            const allFilteredValues = filtered.map(opt => opt.value);
                            const newSelection = [...new Set([...value, ...allFilteredValues])];
                            onChange(newSelection);
                          }}
                        >
                          Select All
                        </button>
                        <span className="text-gray-300 text-sm">|</span>
                        <button
                          type="button"
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
                          onClick={() => {
                            const filteredValues = filtered.map(opt => opt.value);
                            const newSelection = value.filter(v => !filteredValues.includes(v));
                            onChange(newSelection);
                          }}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <ul className="max-h-80 overflow-auto bg-white" role="listbox">
                  {filtered.map((opt) => (
                    <li
                      key={opt.value}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md mx-1 mb-1 transition-colors",
                        value.includes(opt.value) 
                          ? "bg-blue-50 border border-blue-200" 
                          : "hover:bg-gray-50 border border-transparent"
                      )}
                      onClick={() => handleSelect(opt.value)}
                      role="option"
                      aria-selected={value.includes(opt.value)}
                    >
                      {/* Checkbox for better visual control */}
                      {multiple && (
                        <Checkbox
                          checked={value.includes(opt.value)}
                          onChange={() => handleSelect(opt.value)}
                          className="flex-shrink-0"
                        />
                      )}
                      
                      {/* Option content */}
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          "font-medium text-sm block truncate",
                          value.includes(opt.value) ? "text-blue-900" : "text-gray-900"
                        )}>
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className={cn(
                            "text-xs block truncate mt-0.5",
                            value.includes(opt.value) ? "text-blue-700" : "text-gray-500"
                          )}>
                            {opt.description}
                          </span>
                        )}
                      </div>
                      
                      {/* Check icon for single select */}
                      {!multiple && value.includes(opt.value) && (
                        <CheckIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      )}
                    </li>
                  ))}
                </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
