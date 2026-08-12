import { Reveal } from './Reveal'
import { cn } from '../../lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  light?: boolean
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]',
              light
                ? 'bg-white/10 text-white/90 border border-white/20'
                : 'bg-primary-50 text-primary-600 border border-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:border-primary-500/20'
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft" />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2
          className={cn(
            'font-heading font-bold leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl max-w-3xl',
            light ? 'text-white' : 'text-ink dark:text-white'
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              'max-w-2xl text-base sm:text-lg leading-relaxed',
              light ? 'text-white/75' : 'text-slate-500 dark:text-slate-400'
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
