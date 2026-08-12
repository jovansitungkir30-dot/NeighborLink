import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { LoginModal } from '../components/ui/LoginModal'

export interface AuthUser {
  name: string
  email: string
}

export const DEMO_ACCOUNT = {
  email: 'demo@neighborlink.id',
  password: 'neighbor123',
  name: 'Demo Neighbor',
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => boolean
  logout: () => void
  openLoginModal: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'neighborlink-auth'

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [isOpen, setIsOpen] = useState(false)

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase()
    if (normalized !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) {
      return false
    }
    const nextUser: AuthUser = { name: DEMO_ACCOUNT.name, email: DEMO_ACCOUNT.email }
    setUser(nextUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const openLoginModal = useCallback(() => setIsOpen(true), [])
  const closeLoginModal = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ user, login, logout, openLoginModal }), [user, login, logout, openLoginModal])

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal isOpen={isOpen} onClose={closeLoginModal} onLogin={login} />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
