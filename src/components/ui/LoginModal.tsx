import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, KeyRound, LogIn, Wand2, X } from 'lucide-react'
import { Button } from './Button'
import { DEMO_ACCOUNT } from '../../context/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => boolean
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

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
      setEmail('')
      setPassword('')
      setError(false)
    }
  }, [isOpen])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = onLogin(email, password)
    if (ok) {
      onClose()
    } else {
      setError(true)
    }
  }

  function fillDemo() {
    setEmail(DEMO_ACCOUNT.email)
    setPassword(DEMO_ACCOUNT.password)
    setError(false)
  }

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
            aria-labelledby="login-modal-title"
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

            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow">
              <KeyRound size={22} />
            </span>
            <h3 id="login-modal-title" className="mt-5 font-heading text-2xl font-bold text-ink dark:text-white">
              Selamat Datang Kembali
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
              Masuk supaya nama & emailmu terisi otomatis setiap kali ingin membantu tetangga — tidak perlu ketik
              ulang setiap saat.
            </p>

            <button
              type="button"
              onClick={fillDemo}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 bg-primary-50 px-4 py-2.5 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/15"
            >
              <Wand2 size={14} />
              Pakai akun demo ({DEMO_ACCOUNT.email})
            </button>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <div>
                <label htmlFor="login-email" className="sr-only">
                  Alamat email
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(false)
                  }}
                  placeholder="kamu@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-primary-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="sr-only">
                  Kata sandi
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError(false)
                  }}
                  placeholder="Kata sandi"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-primary-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-rose-500"
                >
                  <AlertCircle size={14} />
                  Email atau kata sandi salah. Coba akun demo di atas.
                </motion.p>
              )}

              <Button type="submit" size="lg" icon={<LogIn size={16} />} className="mt-2 w-full justify-center">
                Masuk
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
