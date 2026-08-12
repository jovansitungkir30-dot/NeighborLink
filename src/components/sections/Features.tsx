import type { MouseEvent } from 'react'
import { useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { StaggerGroup } from '../ui/Reveal'
import { features, type Feature } from '../../data/content'
import { cn } from '../../lib/utils'
import { useJoinModal } from '../../context/JoinModalContext'

const sizeClasses: Record<Feature['size'], string> = {
  lg: 'sm:col-span-2 lg:col-span-2',
  sm: 'sm:col-span-1 lg:col-span-1',
}

// cards "coalesce" into place — scattered, blurred, and small, then settle
const coalesce: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 22, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

function FeatureCard({ feature, onOpen }: { feature: Feature; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const [transform, setTransform] = useState('perspective(900px) rotateX(0deg) rotateY(0deg)')

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(
      `perspective(900px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg) scale3d(1.03,1.03,1.03)`
    )
  }

  function handleLeave() {
    setTransform('perspective(900px) rotateX(0deg) rotateY(0deg)')
  }

  const isLarge = feature.size === 'lg'

  return (
    <button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onOpen}
      style={{ transform, transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' }}
      className={cn(
        'group relative flex h-full min-h-[180px] w-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-soft transition-shadow duration-500 hover:shadow-glow will-change-transform dark:border-white/10 dark:bg-white/[0.04]',
        isLarge && 'justify-center'
      )}
    >
      <div
        className={cn(
          'absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30',
          feature.gradient
        )}
      />
      <ArrowUpRight
        size={16}
        className="absolute right-5 top-5 -translate-y-1 text-slate-300 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-ink dark:text-white/20 dark:group-hover:text-white"
      />
      <div className="relative">
        <span
          className={cn(
            'inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-glow transition-transform duration-500 group-hover:scale-110',
            feature.gradient,
            isLarge && 'h-16 w-16'
          )}
        >
          <feature.icon size={isLarge ? 26 : 20} />
        </span>
        <h3 className={cn('relative mt-5 font-heading font-bold text-ink dark:text-white', isLarge ? 'text-2xl' : 'text-lg')}>
          {feature.title}
        </h3>
        <p className="relative mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">{feature.description}</p>
      </div>
    </button>
  )
}

export function Features() {
  const { openJoinModal } = useJoinModal()

  return (
    <section id="features" className="relative section-padding bg-bg dark:bg-bg-dark">
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Everything In One Place"
          title="Six Ways To Show Up For Your Block"
          description="Every tool a connected community needs, beautifully unified — nothing more, nothing less."
        />

        <StaggerGroup
          className="mt-16 grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={coalesce} className={cn('h-full', sizeClasses[feature.size])}>
              <FeatureCard feature={feature} onOpen={() => openJoinModal(feature.title)} />
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
