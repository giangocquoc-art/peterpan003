'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

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

    interface Star {
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      twinkleSpeed: number
      twinklePhase: number
    }

    interface ShootingStar {
      x: number
      y: number
      len: number
      speed: number
      opacity: number
      angle: number
      life: number
      maxLife: number
    }

    interface Nebula {
      x: number
      y: number
      radius: number
      color: string
      opacity: number
      drift: number
      phase: number
    }

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
        {
          x: width * 0.2,
          y: height * 0.3,
          radius: 300,
          color: 'rgba(100, 50, 180, 0.015)',
          opacity: 1,
          drift: 0.0003,
          phase: 0,
        },
        {
          x: width * 0.7,
          y: height * 0.6,
          radius: 250,
          color: 'rgba(30, 80, 160, 0.012)',
          opacity: 1,
          drift: 0.0002,
          phase: 2,
        },
        {
          x: width * 0.5,
          y: height * 0.8,
          radius: 350,
          color: 'rgba(60, 20, 120, 0.01)',
          opacity: 1,
          drift: 0.00025,
          phase: 4,
        },
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

      // Draw nebulae
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

      // Draw stars with twinkle
      for (const star of stars) {
        star.twinklePhase += star.twinkleSpeed
        const twinkle = 0.5 + 0.5 * Math.sin(star.twinklePhase)
        const currentOpacity = star.opacity * twinkle

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`
        ctx.fill()

        // Glow for larger stars
        if (star.size > 1.2) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 220, 255, ${currentOpacity * 0.08})`
          ctx.fill()
        }

        // Slow drift upward
        star.y -= star.speed
        if (star.y < -5) {
          star.y = height + 5
          star.x = Math.random() * width
        }
      }

      // Shooting stars
      if (Math.random() < 0.003) spawnShootingStar()

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.life++
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed

        const lifeRatio = s.life / s.maxLife
        s.opacity = 1 - lifeRatio

        // Draw shooting star trail
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

        // Head glow
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
}: {
  title: string
  description: string
  url: string
  icon: React.ElementType
  progress?: number
  devStatus?: string
}) {
  const isLive = !progress && progress !== 0

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass group flex flex-col rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
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

      {/* Progress bar for in-dev features */}
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

      {isLive && url && url !== '#' && (
        <div className="mt-auto flex items-center text-sm font-medium text-white/70 transition-colors group-hover:text-white">
          Trải nghiệm <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      )}

      {isLive && url === '#' && (
        <div className="mt-auto flex items-center gap-1.5 text-xs text-emerald-400/70">
          <Sparkles className="h-3 w-3" />
          Sẵn sàng
        </div>
      )}
    </a>
  )
}

/* ─── Featured Tools ─── */
function FeaturedTools() {
  return (
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
          title="P-English"
          description="Học tiếng Anh với flashcards, shadowing, lộ trình nền tảng và luyện tập tương tác."
          url="https://penglish.vercel.app"
          icon={BookOpen}
        />
        <ToolCard
          title="P-DF"
          description="Chỉnh sửa PDF trực tiếp, thêm chữ, sửa chữ, gộp, tách, xoay và xử lý tài liệu."
          url="https://www.sejda.com/pdf-editor"
          icon={FileText}
        />
        <ToolCard
          title="P-API"
          description="Lớp API tiện ích cho các công cụ trong hệ sinh thái P-ShareHub."
          url="#"
          icon={Code}
          progress={70}
          devStatus="Đang phát triển"
        />
        <ToolCard
          title="Vocodo"
          description="Ý tưởng chuyển đổi ngôn ngữ ký hiệu thành giọng nói bằng AI trong thời gian thực."
          url="#"
          icon={Mic}
          progress={30}
          devStatus="Giai đoạn ý tưởng"
        />
      </div>
    </section>
  )
}

/* ─── Product Highlights ─── */
function ProductHighlights() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-8 py-24 sm:py-32"
      id="products"
    >
      {/* P-English */}
      <div
        className="mb-32 flex flex-col items-center gap-16 lg:flex-row"
        id="p-english"
      >
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
            Sản phẩm nổi bật
          </div>
          <h2
            className="text-5xl tracking-tight sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            P-English
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Học tiếng Anh thông minh với flashcards, shadowing, lộ trình nền
            tảng và luyện tập tương tác. Được thiết kế cho người Việt học tiếng
            Anh hiệu quả hơn.
          </p>
          <div className="pt-4">
            <a
              href="https://penglish.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass inline-flex items-center rounded-full px-8 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]"
            >
              Mở P-English <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="relative w-full flex-1">
          <div className="galaxy-card aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 p-2">
            <img
              src="/penglish-preview.png"
              alt="P-English Preview"
              className="h-full w-full rounded-xl object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* P-DF */}
      <div
        className="flex flex-col items-center gap-16 lg:flex-row-reverse"
        id="p-df"
      >
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
            PDF Editor
          </div>
          <h2
            className="text-5xl tracking-tight sm:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
        >
            P-DF
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Chỉnh sửa PDF trực tiếp trên trình duyệt — thêm chữ, sửa chữ, gộp,
            tách, xoay và xử lý tài liệu. Không cần cài đặt, không cần tải phần
            mềm.
            <br />
            <br />
            Tất cả xử lý locally trên browser. Tài liệu của bạn không rời khỏi
            máy.
          </p>
          <div className="pt-4">
            <a
              href="https://www.sejda.com/pdf-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass inline-flex items-center rounded-full px-8 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]"
            >
              Mở P-DF <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="relative w-full flex-1">
          <div className="galaxy-card aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 p-2">
            <img
              src="/pdf-preview.png"
              alt="P-DF Preview"
              className="h-full w-full rounded-xl object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── About Section ─── */
function AboutSection() {
  return (
    <section
      className="w-full border-y border-white/10 bg-white/[0.02]"
      id="about"
    >
      <div className="mx-auto w-full max-w-5xl px-8 py-32">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Profile Photo - Elegant & Subtle */}
          <div className="relative flex-shrink-0">
            {/* Glow effect behind avatar */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-violet-500/10 via-white/5 to-transparent blur-2xl" />
            <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-blue-500/5 to-transparent blur-xl" />
            <div className="relative h-44 w-44 overflow-hidden rounded-full border border-white/15 shadow-[0_0_60px_rgba(139,92,246,0.08)] sm:h-56 sm:w-56">
              <img
                src="/profile.jpg"
                alt="P-ShareHub Creator"
                className="h-full w-full object-cover"
              />
              {/* Subtle gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          {/* Text Content */}
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
            <div className="inline-block rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm uppercase tracking-widest text-white/60">
              From Vietnam to the world 🇻🇳
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
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
            <p className="text-sm text-muted-foreground">
              Tham gia cộng đồng Zalo
            </p>
          </a>

          <a
            href="https://www.facebook.com/peterpan003"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass flex flex-col rounded-2xl p-8 transition-transform hover:scale-[1.02]"
          >
            <Facebook className="mb-6 h-8 w-8 text-white/80" />
            <h3 className="mb-2 text-xl">Facebook</h3>
            <p className="text-sm text-muted-foreground">
              Follow để cập nhật dự án
            </p>
          </a>

          <a
            href="https://zalo.me/g/vbycrx997"
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass flex flex-col rounded-2xl p-8 transition-transform hover:scale-[1.02]"
          >
            <div className="mb-6 flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-xl pb-1">
              +
            </div>
            <h3 className="mb-2 text-xl">Góp ý công cụ mới</h3>
            <p className="text-sm text-muted-foreground">
              Đề xuất công cụ bạn cần
            </p>
          </a>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} P-ShareHub. Built with passion from
            Vietnam.
          </p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <a
              href="https://penglish.vercel.app"
              className="transition-colors hover:text-white"
            >
              P-English
            </a>
            <a
              href="https://www.facebook.com/peterpan003"
              className="transition-colors hover:text-white"
            >
              Facebook
            </a>
            <a
              href="https://zalo.me/g/vbycrx997"
              className="transition-colors hover:text-white"
            >
              Zalo
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ─── Main Page ─── */
export default function Home() {
  const scrollToPEnglish = useCallback(() => {
    const el = document.getElementById('p-english')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const scrollToContact = useCallback(() => {
    const el = document.getElementById('contact')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div className="relative w-full bg-black">
      {/* Galaxy Canvas Background */}
      <GalaxyBackground />

      {/* Main Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Status Bar */}
        <div className="status-bar relative z-50 flex items-center justify-between px-6 py-1.5 text-[11px]">
          <div className="flex items-center gap-4">
            <span className="text-white/40">P-ShareHub v1.0</span>
            <span className="status-dot" />
            <span className="text-emerald-400/70">All systems operational</span>
          </div>
          <div className="flex items-center gap-4 text-white/40">
            <span>2 sản phẩm hoạt động</span>
            <span>•</span>
            <span>2 đang phát triển</span>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="liquid-glass-nav sticky top-0 z-50 mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-8 py-4">
          <div
            className="text-3xl tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            P-ShareHub
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#"
              className="text-sm text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="#p-english"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              P-English
            </a>
            <a
              href="#p-df"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              P-DF
            </a>
            <a
              href="#tools"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              P-API
            </a>
            <a
              href="#contact"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cộng đồng
            </a>
          </div>

          <button
            onClick={scrollToContact}
            className="liquid-glass cursor-pointer rounded-full px-6 py-2.5 text-sm text-foreground transition-transform hover:scale-[1.03]"
          >
            Tìm hiểu thêm về P-Share
          </button>
        </nav>

        {/* Hero Section */}
        <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-32 pb-40 text-center md:py-[120px]">
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

          <button
            onClick={scrollToPEnglish}
            className="liquid-glass animate-fade-rise-delay-2 mt-12 cursor-pointer rounded-full px-14 py-5 text-base text-foreground transition-transform hover:scale-[1.03]"
          >
            P-English?
          </button>
        </main>

        <FeaturedTools />
        <ProductHighlights />
        <AboutSection />
        <Footer />
      </div>
    </div>
  )
}
