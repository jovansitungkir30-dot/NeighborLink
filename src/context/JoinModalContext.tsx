import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { JoinModal } from '../components/ui/JoinModal'

export interface JoinContext {
  title: string
  /** set when responding to one specific character's need — makes the
   * modal show a task card + time-slot picker instead of a generic
   * interest picker */
  characterName?: string
  need?: string
  buildingName?: string
}

interface JoinModalContextValue {
  openJoinModal: (context?: string | JoinContext) => void
}

const JoinModalContext = createContext<JoinModalContextValue | null>(null)

export function JoinModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState<JoinContext | undefined>(undefined)

  const openJoinModal = useCallback((next?: string | JoinContext) => {
    setContext(typeof next === 'string' ? { title: next } : next)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ openJoinModal }), [openJoinModal])

  return (
    <JoinModalContext.Provider value={value}>
      {children}
      <JoinModal isOpen={isOpen} context={context} onClose={close} />
    </JoinModalContext.Provider>
  )
}

export function useJoinModal() {
  const ctx = useContext(JoinModalContext)
  if (!ctx) throw new Error('useJoinModal must be used within JoinModalProvider')
  return ctx
}
