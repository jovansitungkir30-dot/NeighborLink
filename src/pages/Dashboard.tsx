import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, MessageCircle, Megaphone, AlertTriangle, LogIn } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const FEED = [
  {
    name: 'Bu Ratna',
    time: '10 menit lalu',
    body: 'Ada yang mau titip beli galon ke minimarket? Aku otw ke sana 🚗',
    color: 'from-primary-500 to-primary-700',
  },
  {
    name: 'Pak Yoga',
    time: '1 jam lalu',
    body: 'Terima kasih banyak buat yang kemarin bantu benerin genteng bocor rumahku 🙏',
    color: 'from-secondary-500 to-secondary-700',
  },
  {
    name: 'Panitia RT',
    time: '3 jam lalu',
    body: 'Kerja bakti bersih got hari Minggu jam 7 pagi, yuk ikutan!',
    color: 'from-accent-500 to-accent-700',
  },
  {
    name: 'Sinta · Relawan',
    time: '5 jam lalu',
    body: 'Baru selesai anter obat buat Pak Budi. Sehat selalu ya Pak! ❤️',
    color: 'from-warning-400 to-warning-600',
  },
  {
    name: 'Bu Wati',
    time: 'Kemarin',
    body: 'Stok sayur di lapak masih banyak, mampir yuk sebelum kehabisan 🥬',
    color: 'from-secondary-400 to-primary-500',
  },
]

const CONTACTS = [
  { name: 'Pak Budi', last: 'Makasih ya sudah dianter obatnya 🙏' },
  { name: 'Bu Sari', last: 'Besok jadwal cek kesehatan gratis jam 9' },
  { name: 'Pak Slamet', last: 'Rapat RT malam ini jangan lupa' },
  { name: 'Rina', last: 'Aku di jalan, 4 menit lagi sampai' },
]

const ISSUE_CATEGORIES = ['Sampah Menumpuk', 'Jalan Rusak', 'Lampu Jalan Mati', 'Saluran Air Tersumbat', 'Lainnya']

/** A lean but functional resident dashboard — activity feed, neighbor chat,
 * and an environmental issue report, all UI-only (no backend) but wired
 * with real local state so the "Hubungan Sosial" subtheme has somewhere to
 * actually demonstrate connection, not just the 3D map. */
export function Dashboard() {
  const { user, openLoginModal } = useAuth()
  const [activeContact, setActiveContact] = useState(0)
  const [messages, setMessages] = useState<{ from: 'me' | 'them'; text: string }[]>([
    { from: 'them', text: CONTACTS[0].last },
  ])
  const [draft, setDraft] = useState('')
  const [issue, setIssue] = useState({ category: ISSUE_CATEGORIES[0], location: '', description: '' })
  const [issueSubmitted, setIssueSubmitted] = useState(false)

  function selectContact(i: number) {
    setActiveContact(i)
    setMessages([{ from: 'them', text: CONTACTS[i].last }])
  }

  function sendMessage(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    setMessages((m) => [...m, { from: 'me', text: draft }])
    setDraft('')
  }

  function submitIssue(e: FormEvent) {
    e.preventDefault()
    if (!issue.location || !issue.description) return
    setIssueSubmitted(true)
  }

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center px-6 pt-24">
        <GlassCard strong className="flex max-w-sm flex-col items-center gap-4 p-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white">
            <LogIn size={22} />
          </span>
          <p className="font-heading text-xl font-bold text-ink dark:text-white">Masuk dulu, yuk</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dashboard warga cuma bisa diakses setelah masuk — di sini kamu bisa lihat kegiatan tetangga, chat, dan
            lapor masalah lingkungan.
          </p>
          <Button onClick={openLoginModal}>Masuk</Button>
        </GlassCard>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-bg pt-28 pb-20 dark:bg-bg-dark">
      <div className="container-px mx-auto max-w-6xl">
        <Reveal>
          <h1 className="font-heading text-3xl font-extrabold text-ink dark:text-white sm:text-4xl">
            Halo, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Ini yang lagi terjadi di sekitar rumahmu.</p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal delay={0.1}>
            <GlassCard strong className="flex flex-col gap-4 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink dark:text-white">
                <Megaphone size={16} className="text-primary-500" />
                Feed Kegiatan
              </div>
              <div className="flex flex-col gap-3">
                {FEED.map((post) => (
                  <div key={post.name + post.time} className="flex gap-3 rounded-2xl border border-slate-100 p-3.5 dark:border-white/10">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${post.color} text-xs font-bold text-white`}
                    >
                      {post.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink dark:text-white">
                        {post.name} <span className="font-normal text-slate-400">· {post.time}</span>
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{post.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.2}>
            <GlassCard strong className="flex h-full flex-col overflow-hidden p-0">
              <div className="flex items-center gap-2 border-b border-slate-100 p-4 text-sm font-semibold text-ink dark:border-white/10 dark:text-white">
                <MessageCircle size={16} className="text-primary-500" />
                Obrolan Tetangga
              </div>
              <div className="flex flex-1 overflow-hidden">
                <div className="w-28 shrink-0 border-r border-slate-100 dark:border-white/10">
                  {CONTACTS.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => selectContact(i)}
                      className={`block w-full px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                        activeContact === i
                          ? 'bg-primary-50 text-primary-700 dark:bg-white/10 dark:text-white'
                          : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex-1 space-y-2 overflow-y-auto p-3">
                    {messages.map((m, i) => (
                      <div
                        key={i}
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                          m.from === 'me'
                            ? 'ml-auto bg-primary-600 text-white'
                            : 'bg-slate-100 text-ink dark:bg-white/10 dark:text-white'
                        }`}
                      >
                        {m.text}
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-100 p-2.5 dark:border-white/10">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Tulis pesan..."
                      className="flex-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-ink placeholder:text-slate-400 focus:border-primary-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                    <button type="submit" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
                      <Send size={13} />
                    </button>
                  </form>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <GlassCard strong className="mt-6 p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink dark:text-white">
              <AlertTriangle size={16} className="text-warning-500" />
              Lapor Masalah Lingkungan
            </div>

            <AnimatePresence mode="wait">
              {issueSubmitted ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 flex flex-col items-center gap-2 py-6 text-center"
                >
                  <CheckCircle2 size={28} className="text-accent-600" />
                  <p className="font-semibold text-ink dark:text-white">Laporan terkirim!</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Petugas kebersihan/keamanan akan ditugaskan untuk menindaklanjuti.</p>
                  <button
                    onClick={() => {
                      setIssueSubmitted(false)
                      setIssue({ category: ISSUE_CATEGORIES[0], location: '', description: '' })
                    }}
                    className="mt-1 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400"
                  >
                    Buat laporan lain
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submitIssue} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-ink dark:text-white">Kategori</span>
                    <select
                      value={issue.category}
                      onChange={(e) => setIssue((f) => ({ ...f, category: e.target.value }))}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink focus:border-primary-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                      {ISSUE_CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-ink dark:text-white">Lokasi</span>
                    <input
                      required
                      value={issue.location}
                      onChange={(e) => setIssue((f) => ({ ...f, location: e.target.value }))}
                      placeholder="Misal: Gang Melati No. 4"
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:border-primary-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className="text-sm font-semibold text-ink dark:text-white">Deskripsi</span>
                    <textarea
                      required
                      rows={3}
                      value={issue.description}
                      onChange={(e) => setIssue((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Jelaskan masalahnya sedikit lebih detail..."
                      className="resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-primary-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </label>
                  <Button type="submit" className="self-start sm:col-span-2">
                    Kirim Laporan
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}
