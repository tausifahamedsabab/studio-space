"use client"

import { Moon, Sun } from "lucide-react"

import { cn } from "cn"

export const THEME_STORAGE_KEY = "studiospace-theme"

/**
 * Challenge 3: light / dark theme toggle. The initial class is applied by the
 * inline script in the root layout, and the icon swap is handled purely with
 * Tailwind's dark variant, so this component stays stateless.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function toggleTheme() {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light")
    } catch {
      // Private browsing modes can reject localStorage; theme still applies.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark and light theme"
      title="Toggle theme"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-border/80 bg-card text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      <Sun className="hidden size-4.5 text-amber-400 dark:block" />
      <Moon className="block size-4.5 dark:hidden" />
    </button>
  )
}
