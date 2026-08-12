import { ArrowRight } from 'lucide-react'
import { AuroraBackground } from '../components/ui/AuroraBackground'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { Features } from '../components/sections/Features'
import { useJoinModal } from '../context/JoinModalContext'

export function Fitur() {
  const { openJoinModal } = useJoinModal()

  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <AuroraBackground />
        <div className="container-px relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse-soft" />
              Konten &amp; Fitur Utama
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-ink dark:text-white sm:text-5xl lg:text-6xl">
              Everything you need to <span className="text-gradient">show up</span> for your block.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
              Six focused tools, beautifully unified — asking for help, offering it, and everything that keeps a
              neighborhood connected in between.
            </p>
          </Reveal>
        </div>
      </section>

      <Features />

      <section className="relative section-padding bg-white dark:bg-[#0B1223]">
        <div className="container-px mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Reveal>
            <p className="font-heading text-2xl font-bold text-ink dark:text-white sm:text-3xl">
              Ready to try it in your own neighborhood?
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Button size="lg" icon={<ArrowRight size={18} />} onClick={() => openJoinModal('Join the Community')}>
              Join the Community
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
