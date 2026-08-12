import { useState } from 'react'
import { Html } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { DoubleSide } from 'three'

interface BuildingHotspotProps {
  position: [number, number, number]
  radius?: number
  markerHeight?: number
  icon: string
  label: string
  onSelect: () => void
}

/** An invisible ground-glow trigger + floating icon marker placed over a
 * building's footprint. Deliberately a separate proxy rather than wrapping
 * the building's own (multi-part, unlabeled) geometry directly — keeps the
 * large existing Scene1Village assembly untouched while still giving every
 * building a soft hover glow, a tooltip, and a click target. */
export function BuildingHotspot({ position, radius = 2.2, markerHeight = 2.6, icon, label, onSelect }: BuildingHotspotProps) {
  const [hovered, setHovered] = useState(false)

  const setHover = (v: boolean) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(v)
    document.body.style.cursor = v ? 'pointer' : 'auto'
  }

  return (
    <group position={position}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
        onPointerOver={setHover(true)}
        onPointerOut={setHover(false)}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        <circleGeometry args={[radius, 32]} />
        <meshBasicMaterial
          color="#FFE9B0"
          transparent
          opacity={hovered ? 0.45 : 0}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <Html position={[0, markerHeight, 0]} center sprite>
        <div
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onClick={onSelect}
          className="flex cursor-pointer flex-col items-center gap-1.5"
        >
          <div className="relative flex h-12 w-12 items-center justify-center">
            {!hovered && (
              <span className="absolute inset-0 animate-ping rounded-full bg-amber-300/30" style={{ animationDuration: '2.4s' }} />
            )}
            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-2xl backdrop-blur-md transition-all duration-300 ${
                hovered ? 'scale-125 bg-amber-400/40 shadow-[0_0_18px_rgba(255,214,130,0.8)]' : ''
              }`}
            >
              {icon}
            </div>
          </div>
          <div
            className={`whitespace-nowrap rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 ${
              hovered ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
            }`}
          >
            {label}
          </div>
        </div>
      </Html>
    </group>
  )
}
