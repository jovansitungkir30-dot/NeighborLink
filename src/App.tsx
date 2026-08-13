import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { useLenis } from './hooks/useLenis'
import { Navbar } from './components/layout/Navbar'
import { VillageWorldProvider } from './context/VillageWorldContext'
import { Footer } from './components/sections/Footer'
import { FloatingActionButton } from './components/ui/FloatingActionButton'
import { Preloader } from './components/ui/Preloader'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { CursorGlow } from './components/ui/CursorGlow'
import { ScrollToTop } from './components/ui/ScrollToTop'

const VILLAGE_ROUTES = ['/', '/about', '/explore', '/contact']

// Lazy-loaded per route so a visit to a lightweight page (e.g. /dashboard,
// /fitur) doesn't have to download the village-route or /journey chunks —
// each pulls in the full three.js/@react-three/fiber/drei scene graph.
const HomeDestination = lazy(() => import('./pages/HomeDestination').then((m) => ({ default: m.HomeDestination })))
const AboutDestination = lazy(() => import('./pages/AboutDestination').then((m) => ({ default: m.AboutDestination })))
const ExploreDestination = lazy(() => import('./pages/ExploreDestination').then((m) => ({ default: m.ExploreDestination })))
const ContactDestination = lazy(() => import('./pages/ContactDestination').then((m) => ({ default: m.ContactDestination })))
const Fitur = lazy(() => import('./pages/Fitur').then((m) => ({ default: m.Fitur })))
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Journey = lazy(() => import('./pages/Journey').then((m) => ({ default: m.Journey })))

function App() {
  useLenis()
  const location = useLocation()
  const isJourney = location.pathname === '/journey'
  const isVillageRoute = VILLAGE_ROUTES.includes(location.pathname)
  const hideChrome = isJourney || isVillageRoute

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('neighborlink-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <MotionConfig reducedMotion="user">
      <Preloader show={loading} />
      {!hideChrome && <ScrollProgress />}
      <CursorGlow />
      <ScrollToTop />
      {!isJourney && <Navbar isDark={isDark} onToggleDark={() => setIsDark((d) => !d)} />}
      <VillageWorldProvider active={isVillageRoute}>
        <main className={hideChrome ? '' : 'overflow-x-clip'}>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<HomeDestination />} />
              <Route path="/about" element={<AboutDestination />} />
              <Route path="/explore" element={<ExploreDestination />} />
              <Route path="/contact" element={<ContactDestination />} />
              <Route path="/fitur" element={<Fitur />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/journey" element={<Journey />} />
            </Routes>
          </Suspense>
        </main>
      </VillageWorldProvider>
      {!hideChrome && <Footer />}
      {!hideChrome && <FloatingActionButton />}
    </MotionConfig>
  )
}

export default App
