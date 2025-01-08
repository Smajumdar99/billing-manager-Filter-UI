import { FC } from "react"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/atoms/Button"
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
  iconClassName?: string
}

export const ThemeToggle: FC<ThemeToggleProps> = ({ className, iconClassName }) => {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("group", className)}
    >
      <SunIcon className={cn("h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0", iconClassName)} />
      <MoonIcon className={cn("absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100", iconClassName)} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 