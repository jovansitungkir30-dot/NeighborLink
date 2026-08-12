import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { footerLinks } from '../../data/content'
import { useJoinModal } from '../../context/JoinModalContext'

const socials = [
  { icon: FaInstagram, label: 'Instagram' },
  { icon: FaXTwitter, label: 'Twitter' },
  { icon: FaFacebookF, label: 'Facebook' },
  { icon: FaLinkedinIn, label: 'LinkedIn' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { openJoinModal } = useJoinModal()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <footer className="relative border-t border-slate-100 bg-white pt-16 dark:border-white/10 dark:bg-[#0B1223]">
      <div className="container-px mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 pb-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
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
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              An operating system for neighborhood kindness — connecting neighbors, building humanity.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex max-w-sm items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address for newsletter"
                className="w-full rounded-full border border-slate-200 bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-primary-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow transition-transform hover:scale-105"
              >
                <Send size={16} />
              </button>
            </form>
            {submitted && <p className="mt-2 text-xs font-medium text-accent-600 dark:text-accent-400">Thanks for subscribing! 🎉</p>}
          </div>

          <FooterColumn title="Product" links={footerLinks.product} />
          <FooterColumn title="Community" links={footerLinks.community} />
          <FooterColumn title="Company" links={footerLinks.company} />
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-slate-100 py-8 dark:border-white/10 sm:flex-row sm:justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} NeighborLink. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <button
                key={s.label}
                type="button"
                aria-label={`${s.label} (coming soon)`}
                title="Coming soon"
                onClick={() => openJoinModal('Join the Community')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-white/10 dark:text-slate-500 dark:hover:border-primary-400 dark:hover:text-primary-400"
              >
                <s.icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const { openJoinModal } = useJoinModal()

  return (
    <div>
      <h4 className="text-sm font-bold text-ink dark:text-white">{title}</h4>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith('/') ? (
              <Link
                to={link.href}
                className="text-sm text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                {link.label}
              </Link>
            ) : (
              <button
                onClick={() => openJoinModal(link.label)}
                className="text-sm text-slate-500 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
              >
                {link.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
