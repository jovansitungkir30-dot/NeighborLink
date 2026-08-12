import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { aboutValues, villageAboutStats } from '../data/content'
import { useVillageWorld } from '../context/VillageWorldContext'
import type { CameraStop } from '../three/FreeRoamCamera'

const ABOUT_STOP: CameraStop = { position: [9, 3.5, -0.5], lookAt: [7.5, 2, -3.8] }

/** The heart of the village — the Tree of Hope beside Village Hall — telling
 * Harmony Village's philosophy and values instead of a normal About page. */
export function AboutDestination() {
  const { flyTo, setInteractive, setTimeMode } = useVillageWorld()

  useEffect(() => {
    setInteractive(false)
    setTimeMode(0.4)
    flyTo(ABOUT_STOP)
  }, [flyTo, setInteractive, setTimeMode])

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-end justify-center px-4 pb-8 sm:items-center sm:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex max-h-[85vh] w-full max-w-3xl flex-col gap-6 overflow-y-auto rounded-3xl border border-white/15 bg-black/35 p-6 backdrop-blur-2xl sm:p-8"
      >
        <div className="text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-200/90">
            Di Bawah Pohon Harapan
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            Manusia Diutamakan. Teknologi Menyusul. Komunitas Selalu Ada.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/75 sm:text-base">
            NeighborLink membantu mempererat hubungan antar tetangga lewat dukungan komunitas berbasis AI — Harmony
            Village adalah gambaran nyata dari itu, bukan sekadar dibangun, tapi benar-benar dijalani.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            Banyak warga kota tinggal berdampingan bertahun-tahun tanpa saling kenal. Isolasi sosial dan minimnya
            partisipasi warga bikin gotong royong perlahan hilang — padahal itu yang bikin sebuah lingkungan
            terasa seperti rumah.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
          {[
            { icon: '📢', title: 'Ceritakan Kebutuhanmu', body: 'Posting kebutuhan bantuan, sekecil apa pun.' },
            { icon: '🤖', title: 'AI Mencocokkan', body: 'Sistem mencari relawan terdekat dalam hitungan menit.' },
            { icon: '🤝', title: 'Bertemu & Terbantu', body: 'Tetangga datang, masalah selesai, hubungan baru terjalin.' },
          ].map((step, i) => (
            <div key={step.title} className="relative rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="absolute -top-2.5 -left-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-ink">
                {i + 1}
              </span>
              <span className="text-2xl">{step.icon}</span>
              <h3 className="mt-2 text-sm font-bold text-white">{step.title}</h3>
              <p className="mt-1 text-xs text-white/65">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {aboutValues.map((v) => (
            <div
              key={v.title}
              className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
            >
              <v.icon size={20} className="text-amber-200" />
              <span className="text-xs font-semibold text-white">{v.title}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:grid-cols-4">
          {villageAboutStats.map((s) => (
            <div key={s.label} className="text-center">
              <AnimatedCounter value={s.value} suffix={s.suffix} className="font-heading text-2xl font-bold text-white" />
              <p className="mt-1 text-[11px] uppercase tracking-wide text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <p className="border-t border-white/10 pt-4 text-center text-xs text-white/40">
          Sebuah eksperimen menghubungkan teknologi dan kemanusiaan.
        </p>
      </motion.div>
    </div>
  )
}
