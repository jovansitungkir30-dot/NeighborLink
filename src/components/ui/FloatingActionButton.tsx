import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, HeartHandshake, X } from 'lucide-react'
import { scrollToTarget } from '../../hooks/useLenis'
import { useJoinModal } from '../../context/JoinModalContext'

export function FloatingActionButton() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const { openJoinModal } = useJoinModal()

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="glass-strong flex flex-col gap-2 rounded-2xl p-3 shadow-soft"
          >
            <button
              onClick={() => {
                setOpen(false)
                openJoinModal('Ask For Help')
              }}
              className="whitespace-nowrap rounded-xl bg-gradient-to-r from-primary-600 to-secondary-500 px-4 py-2.5 text-left text-sm font-semibold text-white shadow-glow"
            >
              Ask For Help
            </button>
            <button
              onClick={() => {
                setOpen(false)
                openJoinModal('Become a Volunteer')
              }}
              className="whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm font-semibold text-ink dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              Become Volunteer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {visible && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => scrollToTarget('body')}
              aria-label="Back to top"
              className="glass flex h-11 w-11 items-center justify-center rounded-full text-primary-600 shadow-soft dark:text-primary-300"
            >
              <ArrowUp size={18} />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={open ? 'Close quick actions' : 'Open quick actions'}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 via-secondary-500 to-accent-500 text-white shadow-glow"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {open ? <X size={22} /> : <HeartHandshake size={22} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  )
}
