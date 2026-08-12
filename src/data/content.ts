import type { LucideIcon } from 'lucide-react'
import {
  HeartHandshake,
  Users,
  MessageCircle,
  HelpCircle,
  Calendar,
  Brain,
  ScanSearch,
  Sparkles,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Clock,
  Home,
  Smile,
} from 'lucide-react'

export interface Stat {
  label: string
  value: number
  suffix: string
  icon: LucideIcon
}

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
  size: 'lg' | 'sm'
  gradient: string
}

export const features: Feature[] = [
  {
    title: 'Minta Bantuan',
    description: 'Ajukan kebutuhanmu dan langsung dicocokkan dengan tetangga terdekat dalam hitungan menit.',
    icon: HelpCircle,
    size: 'sm',
    gradient: 'from-primary-500 to-primary-700',
  },
  {
    title: 'Jadi Relawan',
    description: 'Jelajahi kesempatan terverifikasi yang sesuai waktu dan kemampuanmu.',
    icon: HeartHandshake,
    size: 'sm',
    gradient: 'from-secondary-500 to-secondary-700',
  },
  {
    title: 'Kegiatan Warga',
    description: 'Temukan dan selenggarakan acara yang mempererat warga sekitar.',
    icon: Calendar,
    size: 'sm',
    gradient: 'from-accent-500 to-accent-700',
  },
  {
    title: 'Saran AI',
    description: 'Pencocokan cerdas yang menghubungkan relawan yang tepat dengan kebutuhan yang tepat.',
    icon: Brain,
    size: 'lg',
    gradient: 'from-primary-500 via-secondary-500 to-accent-500',
  },
  {
    title: 'Barang Hilang',
    description: 'Pertemukan kembali warga dengan hewan peliharaan, kunci, dan barang berharga, dengan cepat.',
    icon: ScanSearch,
    size: 'sm',
    gradient: 'from-warning-400 to-warning-600',
  },
  {
    title: 'Obrolan Warga',
    description: 'Percakapan langsung dengan orang-orang di sekitar tempat tinggalmu.',
    icon: MessageCircle,
    size: 'sm',
    gradient: 'from-secondary-400 to-primary-500',
  },
]

export interface ValueCard {
  title: string
  description: string
  icon: LucideIcon
}

export const aboutValues: ValueCard[] = [
  {
    title: 'Kebaikan',
    description: 'Setiap fitur dimulai dari satu pertanyaan: apakah ini membuat tetangga merasa tidak sendirian?',
    icon: Heart,
  },
  {
    title: 'Kolaborasi',
    description: 'Bantuan dicocokkan, bukan dicari sendiri — tetangga dan relawan bertemu di tengah jalan.',
    icon: HeartHandshake,
  },
  {
    title: 'Empati',
    description: 'Setiap cerita di balik sebuah permintaan didengar dulu, sebelum jadi sekadar daftar tugas.',
    icon: Sparkles,
  },
  {
    title: 'Keberlanjutan',
    description: 'Dari sawah hingga atap rumah, desa ini tumbuh dengan cara yang bertahan untuk generasi berikutnya.',
    icon: Leaf,
  },
  {
    title: 'Inklusi',
    description: 'Tanpa ribet, tanpa gaduh — jalan tersingkat dari sebuah kebutuhan menuju uluran tangan, untuk semua orang.',
    icon: Users,
  },
]

export const villageAboutStats: Stat[] = [
  { label: 'Keluarga', value: 248, suffix: '', icon: Home },
  { label: 'Kebahagiaan Warga', value: 94, suffix: '%', icon: Smile },
  { label: 'Relawan Aktif', value: 43, suffix: '', icon: HeartHandshake },
  { label: 'Kegiatan Warga per Bulan', value: 12, suffix: '', icon: Calendar },
]

export interface ContactInfo {
  label: string
  value: string
  icon: LucideIcon
}

export const contactInfo: ContactInfo[] = [
  { label: 'Email Kami', value: 'hello@neighborlink.id', icon: Mail },
  { label: 'Lokasi Kami', value: 'Jakarta, Indonesia', icon: MapPin },
  { label: 'Waktu Respons', value: '1–2 hari kerja', icon: Clock },
]

export const footerLinks = {
  product: [
    { label: 'Beranda', href: '/' },
    { label: 'Fitur Utama', href: '/fitur' },
  ],
  community: [
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Kontak', href: '/contact' },
    { label: 'Jadi Relawan', href: '#join' },
  ],
  company: [
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Karier', href: '/contact' },
    { label: 'Press Kit', href: '/contact' },
    { label: 'Kontak', href: '/contact' },
  ],
}
