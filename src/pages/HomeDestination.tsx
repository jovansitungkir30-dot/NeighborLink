import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { useVillageWorld } from '../context/VillageWorldContext'
import { useJoinModal } from '../context/JoinModalContext'
import { features } from '../data/content'
import type { CameraStop } from '../three/FreeRoamCamera'

const HOME_STOP: CameraStop = { position: [0, 3.2, 19], lookAt: [0, 1.8, 13] }

const VALUE_POINTS = [
  {
    icon: '🤝',
    title: 'Terhubung Nyata',
    body: 'Bukan sekadar aplikasi — setiap permintaan bantuan berakhir dengan tetangga bertemu tetangga.',
  },
  {
    icon: '🕒',
    title: 'Respons Cepat',
    body: 'AI mencocokkan kebutuhan dengan relawan terdekat dalam hitungan menit, bukan hari.',
  },
  {
    icon: '🌱',
    title: 'Tumbuh Bersama',
    body: 'Semakin banyak yang saling bantu, semakin kuat ikatan satu kampung — bukan cuma satu rumah.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'Sejak pakai NeighborLink, aku jadi kenal tetangga yang dulu cuma lewat doang. Sekarang malah sering bantu-bantuan.',
    name: 'Bu Ratna',
    role: 'Warga RT 05',
  },
  {
    quote: 'Butuh bantuan angkut galon pas lagi sakit, eh 10 menit kemudian ada yang datang. Cepat banget.',
    name: 'Pak Yoga',
    role: 'Warga RT 02',
  },
  {
    quote: 'Jadi relawan di sini bikin aku merasa hidup lebih berarti. Sekarang tiap minggu pasti ada saja yang bisa aku bantu.',
    name: 'Sinta',
    role: 'Relawan Aktif',
  },
]

/** The village entrance at sunrise — the cinematic front door of the site,
 * followed by scrollable sections (value prop, feature preview, testimoni)
 * riding on top of the fixed 3D background behind it. */
export function HomeDestination() {
  const navigate = useNavigate()
  const { flyTo, setInteractive, setTimeMode } = useVillageWorld()
  const { openJoinModal } = useJoinModal()

  useEffect(() => {
    setInteractive(false)
    setTimeMode(0.05)
    flyTo(HOME_STOP)
  }, [flyTo, setInteractive, setTimeMode])

  return (
    <div className="relative z-30">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-white/80"
        >
          Selamat Datang di
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-5xl font-extrabold text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)] sm:text-6xl lg:text-7xl"
        >
          Harmony Village
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-5 max-w-xl text-lg text-white/90 sm:text-xl"
        >
          Teknologi Menghubungkan. <span className="font-semibold">Kemanusiaan Hidup di Sini.</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-3 max-w-lg text-sm text-white/70 sm:text-base"
        >
          Desa digital interaktif tempat setiap rumah punya cerita tentang kebaikan, kolaborasi, dan kemanusiaan.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Button onClick={() => navigate('/explore')} size="lg">
            Mulai Jelajahi
          </Button>
          <Button onClick={() => navigate('/about')} size="lg" variant="outline">
            Selengkapnya
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ opacity: { delay: 1.6, duration: 0.6 }, y: { delay: 2, duration: 1.8, repeat: Infinity } }}
          className="absolute bottom-8 text-xs uppercase tracking-[0.3em] text-white/50"
        >
          Scroll ↓
        </motion.div>
      </div>

      <section className="bg-black/45 px-6 py-20 backdrop-blur-md">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/90">Kenapa NeighborLink</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            Kota yang padat sering bikin tetangga jadi orang asing.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 sm:text-base">
            NeighborLink hadir buat menyalakan lagi rasa gotong royong itu — teknologi jadi jembatan, bukan
            pengganti, hubungan manusia yang sesungguhnya.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {VALUE_POINTS.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-3 font-heading text-lg font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-white/70">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black/55 px-6 py-20 backdrop-blur-md">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/90">Bukan Cuma Peta Desa</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">Fitur di Balik Desa Ini</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 sm:text-base">
            Peta 3D ini cuma pintu masuk — di baliknya ada forum warga, sistem relawan, dan AI pencocokan bantuan
            yang bikin tetangga beneran saling terhubung.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white`}>
                  <f.icon size={20} />
                </span>
                <h3 className="font-heading text-base font-bold text-white">{f.title}</h3>
                <p className="text-sm text-white/70">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black/45 px-6 py-20 backdrop-blur-md">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/90">Kata Warga</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">Cerita dari Kampung Ini</h2>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
                <p className="font-heading text-base italic leading-snug text-white">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-amber-200">
                  {t.name} <span className="font-normal text-white/50">· {t.role}</span>
                </p>
              </div>
            ))}
          </div>

          <Button onClick={() => openJoinModal('Gabung Komunitas')} size="lg" className="mt-12">
            Gabung Sekarang
          </Button>
        </div>
      </section>
    </div>
  )
}
