import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, HeartHandshake, LayoutDashboard, X } from 'lucide-react'
import { Button } from './Button'
import { useAuth } from '../../context/AuthContext'
import type { JoinContext } from '../../context/JoinModalContext'
import { CATEGORY_META, type StoryCategory } from '../../data/villageStories'

interface JoinModalProps {
  isOpen: boolean
  context?: JoinContext
  onClose: () => void
}

const TIME_SLOTS = ['Sekarang', 'Nanti sore', 'Besok pagi'] as const
const INTERESTS = Object.keys(CATEGORY_META) as StoryCategory[]

/** The volunteer signup/match flow. Two modes: responding to one specific
 * character's need (shows the task + a time-slot pick, matching the
 * "X relawan di dekat sini, ETA Y menit" promise each story panel makes),
 * or joining generally (picks interest areas instead). Either way it ends
 * by pointing at the Dashboard instead of just "we emailed you" — the
 * match should lead somewhere, not dead-end at a confirmation screen. */
export function JoinModal({ isOpen, context, onClose }: JoinModalProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [timeSlot, setTimeSlot] = useState<(typeof TIME_SLOTS)[number]>('Sekarang')
  const [interests, setInterests] = useState<StoryCategory[]>([])
  const [submitted, setSubmitted] = useState(false)

  const isTask = Boolean(context?.characterName)

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false)
      setName(user?.name ?? '')
      setEmail(user?.email ?? '')
      setTimeSlot('Sekarang')
      setInterests([])
    }
  }, [isOpen, context, user])

  function toggleInterest(c: StoryCategory) {
    setInterests((prev) => (prev.includes(c) ? prev.filter((i) => i !== c) : [...prev, c]))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name || !email) return
    setSubmitted(true)
  }

  function goToDashboard() {
    onClose()
    navigate('/dashboard')
  }

  const title = context?.title ?? 'Gabung NeighborLink'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="join-modal-title"
            initial={{ opacity: 0, y: 32, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="glass-strong relative w-full max-w-md overflow-hidden rounded-3xl p-8 shadow-soft"
          >
            <button
              onClick={onClose}
              aria-label="Tutup dialog"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X size={16} />
            </button>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow">
                    <HeartHandshake size={22} />
                  </span>
                  <h3 id="join-modal-title" className="mt-5 font-heading text-2xl font-bold text-ink dark:text-white">
                    {title}
                  </h3>

                  {isTask ? (
                    <div className="mt-3 rounded-xl border border-primary-100 bg-primary-50 p-3.5 dark:border-primary-500/20 dark:bg-primary-500/10">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
                        {context?.buildingName}
                      </p>
                      <p className="mt-1 text-sm text-ink dark:text-white">{context?.need}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
                      Ceritakan sedikit tentang dirimu, dan kami akan menghubungkanmu dengan tetangga terdekat —
                      tanpa spam, selamanya.
                    </p>
                  )}
                  {user && (
                    <p className="mt-2 text-xs font-medium text-primary-600 dark:text-primary-400">
                      ✓ Terisi otomatis karena kamu sudah masuk sebagai {user.name}
                    </p>
                  )}

                  {isTask ? (
                    <div className="mt-4">
                      <span className="text-xs font-semibold text-ink dark:text-white">Kapan kamu bisa bantu?</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTimeSlot(slot)}
                            className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                              timeSlot === slot
                                ? 'border-primary-500 bg-primary-600 text-white'
                                : 'border-slate-200 text-slate-600 hover:border-primary-300 dark:border-white/15 dark:text-slate-300'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <span className="text-xs font-semibold text-ink dark:text-white">Minat kamu di bidang apa?</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {INTERESTS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleInterest(c)}
                            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                              interests.includes(c)
                                ? 'border-primary-500 bg-primary-600 text-white'
                                : 'border-slate-200 text-slate-600 hover:border-primary-300 dark:border-white/15 dark:text-slate-300'
                            }`}
                          >
                            <span>{CATEGORY_META[c].icon}</span>
                            {CATEGORY_META[c].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
                    <div>
                      <label htmlFor="join-name" className="sr-only">
                        Nama lengkap
                      </label>
                      <input
                        id="join-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nama lengkap"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-primary-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="join-email" className="sr-only">
                        Alamat email
                      </label>
                      <input
                        id="join-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="kamu@email.com"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-primary-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                    </div>
                    <Button type="submit" size="lg" className="mt-2 w-full justify-center">
                      {isTask ? 'Konfirmasi Bantuan' : 'Mulai'}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="flex flex-col items-center py-6 text-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 text-accent-600 dark:bg-accent-500/15"
                  >
                    <CheckCircle2 size={32} />
                  </motion.span>

                  {isTask ? (
                    <>
                      <h3 className="mt-5 font-heading text-xl font-bold text-ink dark:text-white">
                        Kamu terhubung dengan {context?.characterName}!
                      </h3>
                      <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-300">
                        Waktu bantuanmu: <span className="font-semibold text-ink dark:text-white">{timeSlot}</span>.
                        Chat sudah dibuka di Dashboard supaya kalian bisa koordinasi langsung.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-5 font-heading text-xl font-bold text-ink dark:text-white">
                        Profil relawanmu aktif, {name.split(' ')[0]}!
                      </h3>
                      <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-300">
                        {interests.length > 0
                          ? `Kami akan mencocokkanmu dengan kebutuhan seputar ${interests.map((c) => CATEGORY_META[c].label).join(', ')}.`
                          : 'Kami akan mencocokkanmu dengan tetangga terdekat yang butuh bantuan.'}
                      </p>
                    </>
                  )}

                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Button icon={<LayoutDashboard size={16} />} onClick={goToDashboard}>
                      Buka Dashboard
                    </Button>
                    <button onClick={onClose} className="text-sm font-semibold text-slate-500 hover:underline dark:text-slate-400">
                      Nanti saja
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
