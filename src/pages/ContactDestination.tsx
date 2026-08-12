import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, Map, ChevronDown } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { contactInfo } from '../data/content'
import { useVillageWorld } from '../context/VillageWorldContext'
import { VILLAGE_STORIES } from '../data/villageStories'

const CONTACT_STOP = VILLAGE_STORIES.find((s) => s.id === 'village-hall')!.cameraStop

const FAQ = [
  {
    q: 'Apakah NeighborLink gratis digunakan?',
    a: 'Ya, seluruhnya gratis untuk warga dan relawan — tidak ada biaya tersembunyi.',
  },
  {
    q: 'Bagaimana cara jadi relawan?',
    a: "Klik \"Gabung Komunitas\" di navigasi, isi data singkat, dan mulai terima notifikasi kebutuhan di sekitarmu.",
  },
  {
    q: 'Apakah data pribadi saya aman?',
    a: 'Kami hanya membagikan info yang diperlukan untuk mencocokkan bantuan, tidak pernah dijual ke pihak ketiga.',
  },
  {
    q: 'Bisa dipakai di RT/RW mana saja?',
    a: 'Bisa — platform ini dirancang untuk diadopsi komunitas mana pun, bukan cuma Harmony Village.',
  },
]

/** Village Hall at sunset — a warm gathering place instead of a plain
 * contact form. Same submit-only-locally behavior as the old Contact page. */
export function ContactDestination() {
  const { flyTo, setInteractive, setTimeMode } = useVillageWorld()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    setInteractive(false)
    setTimeMode(0.9)
    flyTo(CONTACT_STOP)
  }, [flyTo, setInteractive, setTimeMode])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitted(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex max-h-[88vh] w-full max-w-3xl flex-col gap-6 overflow-y-auto rounded-3xl border border-white/15 bg-black/40 p-6 backdrop-blur-2xl sm:p-8"
      >
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/90">
            Balai Desa · Senja
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            Mari Bangun Komunitas yang Lebih Erat Bersama.
          </h1>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white">
              <CheckCircle2 size={26} />
            </span>
            <p className="font-heading text-xl font-bold text-white">Pesan terkirim!</p>
            <p className="max-w-sm text-sm text-white/70">
              Terima kasih sudah menghubungi kami — tetangga dari tim kami akan segera membalas.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-1 text-sm font-semibold text-amber-200 hover:underline"
            >
              Kirim pesan lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-white">Nama</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nama kamu"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-amber-300 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-white">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="kamu@email.com"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-amber-300 focus:outline-none"
                />
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-white">Pesan</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Ceritakan apa yang ada di pikiranmu..."
                className="resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-amber-300 focus:outline-none"
              />
            </label>
            <Button type="submit" size="lg" icon={<Send size={16} />} className="self-start">
              Kirim Pesan
            </Button>
          </form>
        )}

        <div className="grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
          {contactInfo.map((info) => (
            <div key={info.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5">
              <info.icon size={18} className="shrink-0 text-amber-200" />
              <div>
                <p className="text-[11px] uppercase tracking-wide text-white/50">{info.label}</p>
                <p className="text-sm font-semibold text-white">{info.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/90">
            Pertanyaan Umum
          </span>
          <div className="mt-3 flex flex-col gap-2">
            {FAQ.map((item, i) => (
              <div key={item.q} className="rounded-2xl border border-white/10 bg-white/5">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-white"
                >
                  {item.q}
                  <ChevronDown size={16} className={`shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-3.5 text-sm text-white/65">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/explore"
          className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-sm font-semibold text-amber-200 transition-colors hover:bg-white/10"
        >
          <Map size={16} />
          Lihat Peta Desa Interaktif
        </Link>

        <div className="border-t border-white/10 pt-4 text-center">
          <p className="text-sm italic text-white/70">&ldquo;Setiap Komunitas Hebat Dimulai Dari Satu Tetangga.&rdquo;</p>
          <p className="mt-2 text-xs text-white/40">Dibuat dengan ❤️ untuk Humanity OS</p>
        </div>
      </motion.div>
    </div>
  )
}
