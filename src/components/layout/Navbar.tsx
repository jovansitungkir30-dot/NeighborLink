import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react'
import { DarkModeToggle } from '../ui/DarkModeToggle'
import { Button } from '../ui/Button'
import { useJoinModal } from '../../context/JoinModalContext'
import { useAuth } from '../../context/AuthContext'

const links = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/about' },
  { label: 'Jelajahi Desa', href: '/explore' },
  { label: 'Kontak', href: '/contact' },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
}

interface NavbarProps {
  isDark: boolean
  onToggleDark: () => void
}

const VILLAGE_ROUTES = ['/', '/about', '/explore', '/contact']

export function Navbar({ isDark, onToggleDark }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { openJoinModal } = useJoinModal()
  const { user, logout, openLoginModal } = useAuth()
  const location = useLocation()
  // The village routes are a fixed 3D viewport with nothing to scroll, so
  // `scrolled` (which drives the glass backdrop) never turns on there —
  // that left nav text sitting directly on a variable-brightness 3D scene
  // with no backdrop, reading as "faded" against a bright sky. Force the
  // glass backdrop on for those routes instead of relying on scroll.
  const alwaysGlass = VILLAGE_ROUTES.includes(location.pathname)
  const showGlass = scrolled || alwaysGlass

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [menuOpen])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="container-px">
        <div
          className={`mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
            showGlass ? 'glass-strong shadow-soft' : 'bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 11.5 12 4l9 7.5M5.5 10v9a1 1 0 0 0 1 1H10v-5a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2v5h3.5a1 1 0 0 0 1-1v-9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-heading text-lg font-bold text-ink dark:text-white">NeighborLink</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-white/10 dark:text-white'
                      : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
            {user ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-ink transition-colors hover:border-primary-300 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white">
                    {initials(user.name)}
                  </span>
                  {user.name.split(' ')[0]}
                  <ChevronDown size={14} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="glass-strong absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-2xl p-1.5 shadow-soft"
                    >
                      <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-ink hover:bg-primary-50 dark:text-white dark:hover:bg-white/10"
                      >
                        <LayoutDashboard size={14} />
                        Dashboard Warga
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false)
                          logout()
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      >
                        <LogOut size={14} />
                        Keluar
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <User size={15} />
                  Masuk
                </button>
                <Button size="md" onClick={() => openJoinModal('Gabung Komunitas')}>
                  Gabung Komunitas
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
            <button
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-ink dark:text-white"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="container-px overflow-hidden lg:hidden"
          >
            <div className="glass-strong mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl p-4 shadow-soft">
              {links.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-left text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-white/10 dark:text-white'
                        : 'text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-white/10'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 dark:border-white/10">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-xs font-bold text-white">
                      {initials(user.name)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-ink hover:bg-primary-50 dark:text-white dark:hover:bg-white/10"
                  >
                    <LayoutDashboard size={15} />
                    Dashboard Warga
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      logout()
                    }}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                  >
                    <LogOut size={15} />
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      openLoginModal()
                    }}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    <User size={15} />
                    Masuk
                  </button>
                  <Button
                    size="md"
                    className="mt-2"
                    onClick={() => {
                      setMobileOpen(false)
                      openJoinModal('Gabung Komunitas')
                    }}
                  >
                    Gabung Komunitas
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
