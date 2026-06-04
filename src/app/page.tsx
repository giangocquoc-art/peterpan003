'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  ArrowRight,
  BookOpen,
  FileText,
  Code,
  Mic,
  MessagesSquare,
  Facebook,
  ExternalLink,
  Hammer,
  Sparkles,
  PenLine,
  Layers,
  ShieldCheck,
  Check,
  Zap,
  Globe,
  Headphones,
  Route,
  Target,
  Mail,
  Map,
  MessageCircle,
  GraduationCap,
  Copy,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

// Lazy load heavy components
const ChatHabibi = dynamic(() => import('@/components/chat/ChatHabibi'), { ssr: false })

const StudyTool = dynamic(() => import('@/components/study/StudyTool'), { ssr: false })

type View = 'home' | 'study' | 'chat'

/* ─── Canvas Galaxy Background ─── */
function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = 0
    let height = 0

    interface Star { x: number; y: number; size: number; speed: number; opacity: number; twinkleSpeed: number; twinklePhase: number }
    interface ShootingStar { x: number; y: number; len: number; speed: number; opacity: number; angle: number; life: number; maxLife: number }
    interface Nebula { x: number; y: number; radius: number; color: string; opacity: number; drift: number; phase: number }

    let stars: Star[] = []
    let shootingStars: ShootingStar[] = []
    let nebulae: Nebula[] = []

    function resize() {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initStars()
      initNebulae()
    }

    function initStars() {
      const count = Math.floor((width * height) / 2500)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.3,
        speed: Math.random() * 0.15 + 0.02,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      }))
    }

    function initNebulae() {
      nebulae = [
        { x: width * 0.2, y: height * 0.3, radius: 300, color: 'rgba(100, 50, 180, 0.015)', opacity: 1, drift: 0.0003, phase: 0 },
        { x: width * 0.7, y: height * 0.6, radius: 250, color: 'rgba(30, 80, 160, 0.012)', opacity: 1, drift: 0.0002, phase: 2 },
        { x: width * 0.5, y: height * 0.8, radius: 350, color: 'rgba(60, 20, 120, 0.01)', opacity: 1, drift: 0.00025, phase: 4 },
      ]
    }

    function spawnShootingStar() {
      if (shootingStars.length > 3) return
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 4,
        opacity: 1,
        angle: (Math.PI / 6) + Math.random() * (Math.PI / 6),
        life: 0,
        maxLife: 60 + Math.random() * 40,
      })
    }

    let time = 0

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      time++

      for (const n of nebulae) {
        n.phase += n.drift
        const nx = n.x + Math.sin(n.phase) * 50
        const ny = n.y + Math.cos(n.phase * 0.7) * 30
        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.radius)
        gradient.addColorStop(0, n.color)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(nx - n.radius, ny - n.radius, n.radius * 2, n.radius * 2)
      }

      for (const star of stars) {
        star.twinklePhase += star.twinkleSpeed
        const twinkle = 0.5 + 0.5 * Math.sin(star.twinklePhase)
        const currentOpacity = star.opacity * twinkle

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
        ctx.fill()

        if (star.size > 1.2) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 220, 255, ${currentOpacity * 0.08})`
          ctx.fill()
        }

        star.y -= star.speed
        if (star.y < -5) {
          star.y = height + 5
          star.x = Math.random() * width
        }
      }

      if (Math.random() < 0.003) spawnShootingStar()

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.life++
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        const lifeRatio = s.life / s.maxLife
        s.opacity = 1 - lifeRatio

        const tailX = s.x - Math.cos(s.angle) * s.len
        const tailY = s.y - Math.sin(s.angle) * s.len
        const gradient = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        gradient.addColorStop(0, 'transparent')
        gradient.addColorStop(0.6, `rgba(180, 200, 255, ${s.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`
        ctx.fill()

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1)
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-screen w-full"
    />
  )
}

/* ─── ToolCard with progress ─── */
function ToolCard({
  title,
  description,
  url,
  icon: Icon,
  progress,
  devStatus,
  onClick,
}: {
  title: string
  description: string
  url?: string
  icon: React.ElementType
  progress?: number
  devStatus?: string
  onClick?: () => void
}) {
  const isLive = !progress && progress !== 0

  const Wrapper = onClick ? 'button' : url ? 'a' : 'div'
  const wrapperProps = onClick
    ? { onClick }
    : url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="liquid-glass group flex flex-col rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer text-left"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3
        className="mb-3 text-2xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {progress !== undefined && (
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-amber-400/80">
              <Hammer className="h-3 w-3" />
              {devStatus || 'Đang phát triển'}
            </span>
            <span className="font-medium text-white/70">{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400/80 transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {isLive && (url || onClick) && (
        <div className="mt-auto flex items-center text-sm font-medium text-white/70 transition-colors group-hover:text-white">
          Trải nghiệm <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      )}
    </Wrapper>
  )
}

/* ─── Feature Category Card ─── */
function FeatureCategory({
  icon: Icon,
  title,
  color,
  items,
}: {
  icon: React.ElementType
  title: string
  color: 'violet' | 'sky' | 'emerald' | 'amber' | 'rose'
  items: string[]
}) {
  const colorMap = {
    violet: { bg: 'bg-violet-500/10', icon: 'text-violet-400', check: 'text-violet-400/60' },
    sky: { bg: 'bg-sky-500/10', icon: 'text-sky-400', check: 'text-sky-400/60' },
    emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', check: 'text-emerald-400/60' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', check: 'text-amber-400/60' },
    rose: { bg: 'bg-rose-500/10', icon: 'text-rose-400', check: 'text-rose-400/60' },
  }
  const c = colorMap[color]

  return (
    <div className="liquid-glass rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]">
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg}`}>
          <Icon className={`h-4 w-4 ${c.icon}`} />
        </div>
        <span className="text-sm font-medium text-white/90">{title}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs text-white/50">
            <Check className={`h-3 w-3 ${c.check}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── About Section ─── */
function AboutSection({ onVietnamClick }: { onVietnamClick: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('giangocquoc@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="w-full border-y border-white/10 bg-white/[0.02]" id="about">
      <div className="mx-auto w-full max-w-5xl px-8 py-32">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-violet-500/10 via-white/5 to-transparent blur-2xl" />
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-blue-500/5 to-transparent blur-xl" />
            <div className="relative h-44 w-44 overflow-hidden rounded-full border border-white/15 shadow-[0_0_60px_rgba(139,92,246,0.08)] sm:h-56 sm:w-56">
              <img src="/profile.jpg" alt="P-ShareHub Creator" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          <div className="text-balance text-center lg:text-left">
            <h2
              className="mb-6 text-4xl leading-tight tracking-normal sm:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Tôi nghèo, bạn cũng thế.
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              P-ShareHub bắt đầu từ một ý tưởng đơn giản: những công cụ hữu ích
              không nên luôn bị khóa sau các khoản phí. Dự án này được xây dựng để
              sinh viên, người học và người sáng tạo có thể tiếp cận công cụ học
              tập và xử lý tài liệu dễ hơn.
            </p>
            <button
              onClick={onVietnamClick}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm uppercase tracking-widest text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              From Vietnam to the world 🇻🇳
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  const [copied, setCopied] = useState(false)

  const handleFeedback = () => {
    navigator.clipboard.writeText('giangocquoc@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="w-full px-8 py-24" id="contact">
      <div className="mx-auto w-full max-w-7xl">
        <h2
          className="mb-16 text-4xl tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Kết nối với chúng tôi
        </h2>

        <div className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-3">
          <a
            href="https://zalo.me/g/vbycrx997"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass flex flex-col rounded-2xl p-8 transition-transform hover:scale-[1.02]"
          >
            <MessagesSquare className="mb-6 h-8 w-8 text-white/80" />
            <h3 className="mb-2 text-xl">Zalo Community</h3>
            <p className="text-sm text-muted-foreground">Tham gia cộng đồng Zalo</p>
          </a>

          <a
            href="https://www.facebook.com/peterpan003"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass flex flex-col rounded-2xl p-8 transition-transform hover:scale-[1.02]"
          >
            <Facebook className="mb-6 h-8 w-8 text-white/80" />
            <h3 className="mb-2 text-xl">Facebook</h3>
            <p className="text-sm text-muted-foreground">Follow để cập nhật dự án</p>
          </a>

          <button
            onClick={handleFeedback}
            className="liquid-glass flex flex-col rounded-2xl p-8 text-left transition-transform hover:scale-[1.02]"
          >
            <div className="mb-6 flex items-center gap-2">
              <Mail className="h-8 w-8 text-white/80" />
              {copied && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                  <Check className="h-3 w-3" /> Đã copy!
                </span>
              )}
            </div>
            <h3 className="mb-2 text-xl">Góp ý công cụ mới</h3>
            <p className="text-sm text-muted-foreground">
              {copied ? '✓ Đã copy email vào bộ nhớ tạm!' : 'Nhấn để copy email, gửi đề xuất công cụ bạn cần'}
            </p>
          </button>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} P-ShareHub. Built with passion from Vietnam.</p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <a href="https://penglish.vercel.app" className="transition-colors hover:text-white">P-English</a>
            <a href="https://www.facebook.com/peterpan003" className="transition-colors hover:text-white">Facebook</a>
            <a href="https://zalo.me/g/vbycrx997" className="transition-colors hover:text-white">Zalo</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Main Page ─── */
export default function Home() {
  // Initialize view from URL hash synchronously
  const getInitialView = (): View => {
    if (typeof window === 'undefined') return 'home'
    const hash = window.location.hash.replace('#', '')
    if (hash === 'hoctap') return 'study'
    if (hash === 'chat') return 'chat'
    return 'home'
  }
  const [view, setView] = useState<View>(getInitialView)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Update hash when view changes
  const navigateTo = useCallback((newView: View) => {
    setView(newView)
    if (newView === 'home') {
      window.history.replaceState(null, '', window.location.pathname)
    } else {
      window.history.replaceState(null, '', `${window.location.pathname}#${newView}`)
    }
  }, [])

  const scrollToPEnglish = useCallback(() => {
    const el = document.getElementById('p-english')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const scrollToContact = useCallback(() => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const goToVietnam = useCallback(() => {
    window.location.href = '/vietnam'
  }, [])

  // If not home, render the selected view
  if (view === 'chat') return <ChatHabibi onBack={() => navigateTo('home')} />
  if (view === 'study') return <StudyTool onBack={() => navigateTo('home')} />

  // Home view
  return (
    <div className="relative w-full bg-black">
      <GalaxyBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Status Bar */}
        <div className="status-bar relative z-50 flex items-center justify-between px-6 py-1.5 text-[11px]">
          <div className="flex items-center gap-4">
            <span className="text-white/40">P-ShareHub v2.0</span>
            <span className="status-dot" />
            <span className="text-emerald-400/70">All systems operational</span>
          </div>
          <div className="flex items-center gap-4 text-white/40">
            <span>4 sản phẩm hoạt động</span>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="liquid-glass-nav sticky top-0 z-50 mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <img src="/p-logo.png" alt="P" className="h-8 w-8" />
            <div
              className="text-3xl tracking-tight text-foreground"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              P-ShareHub
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden items-center space-x-6 md:flex">
            <a href="#" className="text-sm text-foreground transition-colors">
              Home
            </a>
            <button onClick={goToVietnam} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Việt Nam 🇻🇳
            </button>
            <button onClick={() => navigateTo('study')} className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <GraduationCap className="h-3.5 w-3.5" />
              Học tập
            </button>
            <button onClick={() => navigateTo('chat')} className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <MessageCircle className="h-3.5 w-3.5" />
              Chat AI
            </button>
            <a
              href="#contact"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cộng đồng
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 pt-20 md:hidden">
            <div className="flex flex-col items-center gap-6 px-8">
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="text-lg text-white">Home</a>
              <button onClick={() => { goToVietnam(); setMobileMenuOpen(false) }} className="text-lg text-white/70">
                Việt Nam 🇻🇳
              </button>
              <button onClick={() => { navigateTo('study'); setMobileMenuOpen(false) }} className="flex items-center gap-2 text-lg text-white/70">
                <GraduationCap className="h-5 w-5" /> Học tập 📚
              </button>
              <button onClick={() => { navigateTo('chat'); setMobileMenuOpen(false) }} className="flex items-center gap-2 text-lg text-white/70">
                <MessageCircle className="h-5 w-5" /> Chat AI
              </button>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-lg text-white/70">
                Cộng đồng
              </a>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <main className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-6 pb-20 pt-16 text-center">
          <h1
            className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] sm:text-7xl md:text-8xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            P-ShareHub
          </h1>

          <p className="animate-fade-rise-delay mx-auto mt-8 max-w-2xl text-base italic leading-relaxed text-muted-foreground sm:text-lg">
            &quot;Có những người sinh ra vốn là ánh sáng, nhưng có những người phải
            tự bước ra khỏi bóng tối để biến bản thân thành ánh sáng&quot;
          </p>

          {/* Feature buttons */}
          <div className="animate-fade-rise-delay-2 mt-12 flex flex-wrap justify-center gap-3">
            <button
              onClick={goToVietnam}
              className="liquid-glass cursor-pointer rounded-full px-6 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]"
            >
              Việt Nam 🇻🇳
            </button>
            <button
              onClick={() => navigateTo('study')}
              className="liquid-glass cursor-pointer rounded-full px-6 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]"
            >
              Học tập 📚
            </button>
            <button
              onClick={() => navigateTo('chat')}
              className="liquid-glass cursor-pointer rounded-full px-6 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]"
            >
              Chat Habibi ✨
            </button>
          </div>
        </main>

        {/* Featured Tools */}
        <section className="mx-auto w-full max-w-7xl px-8 py-24 sm:py-32" id="tools">
          <div className="mb-16">
            <h2
              className="mb-4 text-4xl tracking-tight sm:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Công cụ nổi bật
            </h2>
            <div className="h-px w-24 bg-white/20" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <ToolCard
              title="Việt Nam 🇻🇳"
              description="Bản đồ tương tác 47 địa điểm — lịch sử, anh hùng, danh lam, ẩm thực, học nhanh mỗi vùng đất."
              icon={Map}
              onClick={goToVietnam}
            />
            <ToolCard
              title="Học tập 📚"
              description="Biến PDF, tài liệu thành bài học — không AI, chạy 100% trên trình duyệt, không lưu dữ liệu."
              icon={BookOpen}
              onClick={() => navigateTo('study')}
            />
            <ToolCard
              title="Chat Habibi"
              description="Trợ lý AI thông minh với 4 chế độ: Chat, Build Web, Học tập, Sáng tạo. Xem tiến độ tư duy AI."
              icon={MessageCircle}
              onClick={() => navigateTo('chat')}
            />
            <ToolCard
              title="P-English"
              description="Học tiếng Anh qua flashcards, shadowing, lộ trình cá nhân hóa — miễn phí, không cần đăng ký."
              icon={BookOpen}
              url="https://penglish.vercel.app"
            />
          </div>
        </section>

        {/* Product Highlights - Vietnam */}
        <section className="mx-auto w-full max-w-7xl px-8 py-24 sm:py-32">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
                <Map className="h-3.5 w-3.5" />
                Interactive Map
              </div>
              <h2
                className="text-5xl tracking-tight sm:text-6xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Việt Nam 🇻🇳
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Khám phá Việt Nam qua bản đồ tương tác — từ Hà Nội ngàn năm văn hiến đến Cần Thơ sông nước,
                từ Hoàng Sa đến Trường Sa. Lịch sử, anh hùng, danh lam, ẩm thực mỗi vùng đất đang chờ bạn.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FeatureCategory icon={Globe} title="Lịch sử" color="violet" items={['Sự kiện lịch sử nổi bật', 'Dòng thời gian tương tác', 'Câu chuyện mỗi vùng đất']} />
                <FeatureCategory icon={ShieldCheck} title="Anh hùng" color="emerald" items={['Danh nhân văn hóa', 'Anh hùng dân tộc', 'Câu chuyện truyền cảm hứng']} />
                <FeatureCategory icon={Target} title="Ẩm thực" color="amber" items={['Đặc sản mỗi vùng', 'Văn hóa ẩm thực', 'Khám phá hương vị']} />
              </div>
              <div className="pt-2">
                <button
                  onClick={goToVietnam}
                  className="liquid-glass inline-flex cursor-pointer items-center rounded-full px-8 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]"
                >
                  Khám phá Việt Nam qua bản đồ <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative w-full flex-1">
              <div className="galaxy-card aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 p-2">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/[0.02] text-6xl">
                  🇻🇳
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Study Tool Highlight */}
        <section className="mx-auto w-full max-w-7xl px-8 py-24 sm:py-32">
          <div className="flex flex-col items-center gap-16 lg:flex-row-reverse">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
                <GraduationCap className="h-3.5 w-3.5" />
                Học tập
              </div>
              <h2
                className="text-5xl tracking-tight sm:text-6xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Học tập 📚
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Biến mọi tài liệu thành bài học tương tác. Không dùng AI, thuật toán mã nguồn mở
                phân tích và tạo 5 loại bài học — chạy hoàn toàn trên trình duyệt.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FeatureCategory icon={Layers} title="5 loại bài học" color="sky" items={['Lật thẻ Flashcard', 'Điền chỗ trống', 'Trắc nghiệm A-B-C-D']} />
                <FeatureCategory icon={Zap} title="Không AI" color="emerald" items={['Thuật toán mã nguồn mở', 'Chạy trên trình duyệt', 'Không gửi dữ liệu']} />
                <FeatureCategory icon={PenLine} title="Đa nguồn" color="rose" items={['File PDF, TXT', 'Dán text trực tiếp', 'Kéo thả file']} />
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('study')}
                  className="liquid-glass inline-flex cursor-pointer items-center rounded-full px-8 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]"
                >
                  Tạo bài học <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative w-full flex-1">
              <div className="galaxy-card aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 p-2">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/[0.02] text-6xl">
                  📚
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Habibi Highlight */}
        <section className="mx-auto w-full max-w-7xl px-8 py-24 sm:py-32">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
                <MessageCircle className="h-3.5 w-3.5" />
                AI Assistant
              </div>
              <h2
                className="text-5xl tracking-tight sm:text-6xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Chat Habibi ✨
              </h2>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Trợ lý AI thông minh với 4 chế độ chuyên biệt. Xem trực tiếp
                tiến độ tư duy của AI, chọn chế độ phù hợp và Habibi sẽ chỉ
                trả lời trong lĩnh vực bạn cần.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FeatureCategory icon={MessageCircle} title="Chat" color="violet" items={['Trò chuyện tự do', 'Hỏi đáp mọi chủ đề', 'Giải thích dễ hiểu']} />
                <FeatureCategory icon={Code} title="Build Web" color="emerald" items={['Xây dựng website', 'Code mẫu cụ thể', 'Best practices']} />
                <FeatureCategory icon={GraduationCap} title="Học tập" color="amber" items={['Tạo bài tập', 'Soạn flashcard', 'Giải thích khái niệm']} />
                <FeatureCategory icon={Sparkles} title="Sáng tạo" color="rose" items={['Viết thơ, truyện', 'Nội dung marketing', 'Brainstorm ý tưởng']} />
              </div>
              <div className="pt-2">
                <button
                  onClick={() => navigateTo('chat')}
                  className="liquid-glass inline-flex cursor-pointer items-center rounded-full px-8 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]"
                >
                  Chat với Habibi <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative w-full flex-1">
              <div className="galaxy-card aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 p-2">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/[0.02] text-6xl">
                  ✨
                </div>
              </div>
            </div>
          </div>
        </section>

        <AboutSection onVietnamClick={goToVietnam} />
        <Footer />
      </div>
    </div>
  )
}
