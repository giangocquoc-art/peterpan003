'use client'

import { useCallback } from 'react'
import {
  ArrowRight,
  BookOpen,
  FileText,
  Code,
  Mic,
  MessagesSquare,
  Facebook,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

/* ─── Starfield (CSS-only) ─── */
function Starfield() {
  return (
    <div className="starfield pointer-events-none fixed inset-0 z-0 h-screen w-full opacity-60">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={`stars stars-${i + 1}`} />
      ))}
    </div>
  )
}

/* ─── ToolCard ─── */
function ToolCard({
  title,
  description,
  url,
  icon: Icon,
}: {
  title: string
  description: string
  url: string
  icon: React.ElementType
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass group flex flex-col rounded-2xl p-8 transition-all hover:scale-[1.02] cursor-pointer"
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3
        className="mb-3 text-2xl"
        style={{ fontFamily: '"Instrument Serif", serif' }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {url && (
        <div className="mt-6 flex items-center text-sm font-medium text-white/70 transition-colors group-hover:text-white">
          Trải nghiệm <ArrowRight className="ml-2 h-4 w-4" />
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
          style={{ fontFamily: '"Instrument Serif", serif' }}
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
        />
        <ToolCard
          title="Vocodo"
          description="Ý tưởng chuyển đổi ngôn ngữ ký hiệu thành giọng nói bằng AI trong thời gian thực."
          url="#"
          icon={Mic}
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
            style={{ fontFamily: '"Instrument Serif", serif' }}
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
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-8 backdrop-blur-sm flex items-center justify-center">
            <div className="liquid-glass w-full max-w-md space-y-4 rounded-xl p-6">
              <div className="flex h-40 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                <BookOpen className="h-10 w-10 text-white/20" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-white/10" />
                <div className="h-4 w-1/2 rounded bg-white/10" />
              </div>
            </div>
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
            style={{ fontFamily: '"Instrument Serif", serif' }}
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
          <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-bl from-white/10 to-transparent p-8 backdrop-blur-sm flex items-center justify-center">
            <div className="liquid-glass flex h-full w-full flex-col gap-4 rounded-xl p-4">
              <div className="flex gap-2 border-b border-white/10 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="h-8 w-24 rounded bg-white/5" />
                <div className="h-8 w-24 rounded bg-white/5" />
              </div>
              <div className="flex flex-1 items-center justify-center rounded border border-white/5 bg-white/5">
                <div className="font-mono text-sm text-white/20">
                  PDF Viewer Workspace
                </div>
              </div>
            </div>
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
      <div className="mx-auto w-full max-w-3xl px-8 py-32 text-center text-balance">
        <h2
          className="mb-8 text-4xl leading-tight tracking-normal sm:text-5xl"
          style={{ fontFamily: '"Instrument Serif", serif' }}
        >
          Công cụ hữu ích không nên luôn bị khoá sau phí.
        </h2>
        <p className="mb-12 text-lg leading-relaxed text-muted-foreground">
          P-ShareHub bắt đầu từ một ý tưởng đơn giản: những công cụ hữu ích
          không nên luôn bị khóa sau các khoản phí. Dự án này được xây dựng để
          sinh viên, người học và người sáng tạo có thể tiếp cận công cụ học
          tập và xử lý tài liệu dễ hơn.
        </p>
        <div className="inline-block rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm uppercase tracking-widest text-white/60">
          From Vietnam to the world 🇻🇳
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
          style={{ fontFamily: '"Instrument Serif", serif' }}
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

  return (
    <div className="relative w-full bg-black">
      {/* Starfield Background */}
      <Starfield />

      {/* User image layered in the background */}
      <img
        src="/profile.jpg"
        alt="Background"
        className="pointer-events-none fixed inset-0 z-0 h-screen w-full object-cover opacity-50 grayscale mix-blend-screen"
      />

      {/* Main Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navigation Bar */}
        <nav className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-8 py-6">
          <div
            className="text-3xl tracking-tight text-foreground"
            style={{ fontFamily: '"Instrument Serif", serif' }}
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

          <Button
            variant="ghost"
            className="liquid-glass cursor-pointer rounded-full px-6 py-2.5 text-sm text-foreground transition-transform hover:scale-[1.03]"
          >
            Tìm hiểu thêm về P-Share
          </Button>
        </nav>

        {/* Hero Section */}
        <main className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-32 pb-40 text-center md:py-[120px]">
          <h1
            className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] sm:text-7xl md:text-8xl"
            style={{ fontFamily: '"Instrument Serif", serif' }}
          >
            P-ShareHub
          </h1>

          <p className="animate-fade-rise-delay mx-auto mt-8 max-w-2xl text-base italic leading-relaxed text-muted-foreground sm:text-lg">
            &quot;Có những người sinh ra vốn là ánh sáng, nhưng có những người phải
            tự bước đi ra khỏi bóng tối để biến bản thân thành ánh sáng&quot;
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
