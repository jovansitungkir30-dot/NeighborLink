import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getLenis } from '../hooks/useLenis'

interface JourneyIntroProps {
  onBegin?: () => void
}

export function JourneyIntro({ onBegin }: JourneyIntroProps) {
  const [begun, setBegun] = useState(false)

  useEffect(() => {
    const lenis = getLenis()
    lenis?.stop()
    return () => {
      getLenis()?.start()
    }
  }, [])

  const handleBegin = () => {
    setBegun(true)
    const lenis = getLenis()
    lenis?.start()
    lenis?.scrollTo(40, { duration: 1.6 })
    onBegin?.()
  }

  return (
    <AnimatePresence>
      {!begun && (
        <motion.div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* night to sunrise gradient */}
          <motion.div
            className="absolute inset-0"
            initial={{ background: 'linear-gradient(180deg, #05060F 0%, #0B1230 55%, #171334 100%)' }}
            animate={{
              background: [
                'linear-gradient(180deg, #05060F 0%, #0B1230 55%, #171334 100%)',
                'linear-gradient(180deg, #0B1230 0%, #3A2E63 45%, #C2694B 100%)',
                'linear-gradient(180deg, #6FA6D9 0%, #F3B27A 45%, #FCE1B8 100%)',
              ],
            }}
            transition={{ duration: 4.5, ease: 'easeInOut', times: [0, 0.55, 1] }}
          />

          {/* rising sun glow */}
          <motion.div
            className="absolute left-1/2 h-[46vh] w-[46vh] -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,232,186,0.95) 0%, rgba(255,200,130,0.25) 55%, transparent 75%)' }}
            initial={{ top: '92%', opacity: 0.2 }}
            animate={{ top: '38%', opacity: 1 }}
            transition={{ duration: 4.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* drifting clouds */}
          {[
            { top: '22%', size: 220, dur: 30, delay: 0 },
            { top: '32%', size: 160, dur: 38, delay: 3 },
            { top: '14%', size: 130, dur: 26, delay: 6 },
          ].map((c, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-2xl"
              style={{ top: c.top, width: c.size, height: c.size * 0.4, background: 'rgba(255,255,255,0.5)' }}
              initial={{ x: '-30vw', opacity: 0 }}
              animate={{ x: '130vw', opacity: [0, 0.7, 0.7, 0] }}
              transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
            />
          ))}

          {/* title */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 3.2 }}
              className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-white/70"
            >
              TECHSOFT 2026 · Humanity OS
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 3.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-5xl font-extrabold text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-7xl"
            >
              Harmony Village
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 3.9 }}
              className="mt-5 max-w-xl text-lg text-white/85 sm:text-xl"
            >
              Technology Connects. <span className="font-semibold">Humanity Lives Here.</span>
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 4.4 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBegin}
              className="mt-10 rounded-full bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-ink shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-colors hover:bg-white/90"
            >
              Begin Journey
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
