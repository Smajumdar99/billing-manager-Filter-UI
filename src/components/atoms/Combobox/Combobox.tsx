import * as React from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

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
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<'all' | 'staff' | 'group'>('all');
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-left shadow-sm",
          open ? "ring-2 ring-primary" : ""
        )}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex flex-wrap gap-1">
          {value.length === 0
            ? <span className="text-muted-foreground">{placeholder}</span>
            : options.filter((opt) => value.includes(opt.value)).map((opt) => (
                <span key={opt.value} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {opt.label}
                  {multiple && (
                    <button
                      type="button"
                      tabIndex={-1}
                      className="text-primary/70 hover:text-primary"
                      onClick={e => {
                        e.stopPropagation();
                        handleSelect(opt.value);
                      }}
                    >
                      <CheckIcon className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
        </span>
        <ChevronDownIcon className="h-4 w-4 ml-2 opacity-50" />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-96 overflow-auto">
          <div className="p-2">
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
                className="w-full rounded border px-2 py-1 text-sm mb-2"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.stopPropagation()}
              />
              {filtered.length === 0 ? (
                <div className="p-2 text-sm text-gray-500">No options found.</div>
              ) : (
                <ul className="max-h-80 overflow-auto" role="listbox">
                  {filtered.map((opt) => (
                    <li
                      key={opt.value}
                      className={cn(
                        "flex items-center justify-between px-2 py-1.5 cursor-pointer rounded hover:bg-primary/10",
                        value.includes(opt.value) ? "bg-primary/10" : ""
                      )}
                      onClick={() => handleSelect(opt.value)}
                      role="option"
                      aria-selected={value.includes(opt.value)}
                    >
                      {/* Compact: name and role on one line */}
                      <span className="text-black font-medium text-sm">
                        {opt.label}
                        {opt.description && (
                          <span className="text-gray-700 text-xs font-normal ml-2">· {opt.description}</span>
                        )}
                      </span>
                      {multiple && value.includes(opt.value) && (
                        <CheckIcon className="h-4 w-4 text-primary ml-2" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
