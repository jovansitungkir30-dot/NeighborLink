import { cn } from '../../lib/utils'

interface AuroraBackgroundProps {
  className?: string
  variant?: 'light' | 'dark'
}

export function AuroraBackground({ className, variant = 'light' }: AuroraBackgroundProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div
        className={cn(
          'absolute -top-1/4 left-[-10%] h-[60vw] w-[60vw] rounded-full blur-3xl animate-aurora-drift',
          variant === 'light' ? 'bg-primary-400/30' : 'bg-primary-500/25'
        )}
      />
      <div
        className={cn(
          'absolute top-1/4 right-[-15%] h-[55vw] w-[55vw] rounded-full blur-3xl animate-aurora-drift',
          variant === 'light' ? 'bg-secondary-400/25' : 'bg-secondary-500/20'
        )}
        style={{ animationDelay: '-6s' }}
      />
      <div
        className={cn(
          'absolute bottom-[-20%] left-1/4 h-[50vw] w-[50vw] rounded-full blur-3xl animate-aurora-drift',
          variant === 'light' ? 'bg-accent-400/20' : 'bg-accent-500/20'
        )}
        style={{ animationDelay: '-12s' }}
      />
      <div className="noise-overlay" />
    </div>
  )
}
