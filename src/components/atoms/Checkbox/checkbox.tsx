import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@heroicons/react/24/outline";

export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, ...props }, ref) => {
  const checkboxRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current && typeof indeterminate === 'boolean') {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <CheckboxPrimitive.Root
      ref={(node) => {
        // Handle both refs
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        if (checkboxRef) checkboxRef.current = node;
      }}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded border border-gray-300 dark:border-gray-600",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
        "dark:data-[state=checked]:bg-blue-400 dark:data-[state=checked]:border-blue-400",
        "data-[state=indeterminate]:bg-blue-500 data-[state=indeterminate]:border-blue-500",
        "dark:data-[state=indeterminate]:bg-blue-400 dark:data-[state=indeterminate]:border-blue-400",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-white")}>
        {indeterminate ? (
          <div className="h-[2px] w-[8px] bg-current" />
        ) : (
          <CheckIcon className="h-3 w-3" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox }; 