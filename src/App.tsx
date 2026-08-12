import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { useLenis } from './hooks/useLenis'
import { Navbar } from './components/layout/Navbar'
import { HomeDestination } from './pages/HomeDestination'
import { AboutDestination } from './pages/AboutDestination'
import { ExploreDestination } from './pages/ExploreDestination'
import { ContactDestination } from './pages/ContactDestination'
import { Fitur } from './pages/Fitur'
import { Journey } from './pages/Journey'
import { Dashboard } from './pages/Dashboard'
import { VillageWorldProvider } from './context/VillageWorldContext'
import { Footer } from './components/sections/Footer'
import { FloatingActionButton } from './components/ui/FloatingActionButton'
import { Preloader } from './components/ui/Preloader'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { CursorGlow } from './components/ui/CursorGlow'
import { ScrollToTop } from './components/ui/ScrollToTop'

const VILLAGE_ROUTES = ['/', '/about', '/explore', '/contact']

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
          <Routes>
            <Route path="/" element={<HomeDestination />} />
            <Route path="/about" element={<AboutDestination />} />
            <Route path="/explore" element={<ExploreDestination />} />
            <Route path="/contact" element={<ContactDestination />} />
            <Route path="/fitur" element={<Fitur />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/journey" element={<Journey />} />
          </Routes>
        </main>
      </VillageWorldProvider>
      {!hideChrome && <Footer />}
      {!hideChrome && <FloatingActionButton />}
    </MotionConfig>
  )
}

export default App
