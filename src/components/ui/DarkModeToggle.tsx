import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'

interface DarkModeToggleProps {
  isDark: boolean
  onToggle: () => void
  className?: string
}

export function DarkModeToggle({ isDark, onToggle, className }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={`relative flex h-9 w-16 items-center rounded-full border border-slate-200/70 bg-white/70 px-1 backdrop-blur-md transition-colors dark:border-white/15 dark:bg-white/10 ${className ?? ''}`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-soft"
        style={{ marginLeft: isDark ? '28px' : '0px' }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.span>
    </button>
  )
}
