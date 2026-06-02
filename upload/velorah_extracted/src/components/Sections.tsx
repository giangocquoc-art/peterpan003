import React from 'react';
import { ArrowRight, BookOpen, FileText, Code, Mic, MessagesSquare, Facebook, ExternalLink } from 'lucide-react';

const ToolCard = ({ title, description, url, icon: Icon }: any) => (
  <a 
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="liquid-glass group flex flex-col p-8 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer"
  >
    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="mb-3 text-2xl" style={{ fontFamily: '"Instrument Serif", serif' }}>
      {title}
    </h3>
    <p className="text-muted-foreground leading-relaxed text-sm">
      {description}
    </p>
    {url && (
      <div className="mt-6 flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
        Trải nghiệm <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    )}
  </a>
);

export function FeaturedTools() {
  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-24 sm:py-32" id="tools">
      <div className="mb-16">
        <h2 className="text-4xl sm:text-5xl tracking-tight mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>
          Công cụ nổi bật
        </h2>
        <div className="h-px w-24 bg-white/20"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  );
}

export function ProductHighlights() {
  return (
    <section className="mx-auto w-full max-w-7xl px-8 py-24 sm:py-32" id="products">
      {/* P-English */}
      <div className="mb-32 flex flex-col lg:flex-row items-center gap-16" id="p-english">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
            Sản phẩm nổi bật
          </div>
          <h2 className="text-5xl sm:text-6xl tracking-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>
            P-English
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Học tiếng Anh thông minh với flashcards, shadowing, lộ trình nền tảng và luyện tập tương tác. Được thiết kế cho người Việt học tiếng Anh hiệu quả hơn.
          </p>
          <div className="pt-4">
            <a href="https://penglish.vercel.app" target="_blank" rel="noopener noreferrer" className="liquid-glass inline-flex items-center rounded-full px-8 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]">
              Mở P-English <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center p-8 overflow-hidden backdrop-blur-sm">
             {/* Mock UI for Visual representation */}
             <div className="liquid-glass w-full max-w-md p-6 rounded-xl space-y-4">
                <div className="h-40 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                   <BookOpen className="h-10 w-10 text-white/20" />
                </div>
                <div className="space-y-2">
                   <div className="h-4 w-3/4 bg-white/10 rounded"></div>
                   <div className="h-4 w-1/2 bg-white/10 rounded"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* P-DF */}
      <div className="flex flex-col lg:flex-row-reverse items-center gap-16" id="p-df">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
            PDF Editor
          </div>
          <h2 className="text-5xl sm:text-6xl tracking-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>
            P-DF
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
            Chỉnh sửa PDF trực tiếp trên trình duyệt — thêm chữ, sửa chữ, gộp, tách, xoay và xử lý tài liệu. Không cần cài đặt, không cần tải phần mềm.
            <br/><br/>
            Tất cả xử lý locally trên browser. Tài liệu của bạn không rời khỏi máy.
          </p>
          <div className="pt-4">
            <a href="https://www.sejda.com/pdf-editor" target="_blank" rel="noopener noreferrer" className="liquid-glass inline-flex items-center rounded-full px-8 py-3 text-sm text-foreground transition-transform hover:scale-[1.03]">
              Mở P-DF <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-bl from-white/10 to-transparent border border-white/10 flex items-center justify-center p-8 overflow-hidden backdrop-blur-sm">
             <div className="liquid-glass w-full h-full p-4 rounded-xl flex flex-col gap-4">
                <div className="flex gap-2 border-b border-white/10 pb-4">
                   <div className="h-8 w-8 bg-white/10 rounded flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                   <div className="h-8 w-24 bg-white/5 rounded"></div>
                   <div className="h-8 w-24 bg-white/5 rounded"></div>
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 rounded flex items-center justify-center">
                  <div className="text-white/20 font-mono text-sm">PDF Viewer Workspace</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section className="w-full border-y border-white/10 bg-white/[0.02]" id="about">
      <div className="mx-auto w-full max-w-3xl px-8 py-32 text-center text-balance">
        <h2 className="text-4xl sm:text-5xl tracking-normal mb-8 leading-tight" style={{ fontFamily: '"Instrument Serif", serif' }}>
          Công cụ hữu ích không nên luôn bị khoá sau phí.
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12">
          P-ShareHub bắt đầu từ một ý tưởng đơn giản: những công cụ hữu ích không nên luôn bị khóa sau các khoản phí. Dự án này được xây dựng để sinh viên, người học và người sáng tạo có thể tiếp cận công cụ học tập và xử lý tài liệu dễ hơn.
        </p>
        <div className="inline-block px-6 py-2 rounded-full border border-white/10 bg-white/5 text-sm uppercase tracking-widest text-white/60">
          From Vietnam to the world 🇻🇳
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="w-full py-24 px-8" id="contact">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="text-4xl tracking-tight mb-16" style={{ fontFamily: '"Instrument Serif", serif' }}>
          Kết nối với chúng tôi
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <a href="https://zalo.me/g/vbycrx997" target="_blank" rel="noopener noreferrer" className="liquid-glass p-8 rounded-2xl flex flex-col hover:scale-[1.02] transition-transform">
            <MessagesSquare className="h-8 w-8 mb-6 text-white/80" />
            <h3 className="text-xl mb-2">Zalo Community</h3>
            <p className="text-sm text-muted-foreground">Tham gia cộng đồng Zalo</p>
          </a>
          
          <a href="https://www.facebook.com/peterpan003" target="_blank" rel="noopener noreferrer" className="liquid-glass p-8 rounded-2xl flex flex-col hover:scale-[1.02] transition-transform">
            <Facebook className="h-8 w-8 mb-6 text-white/80" />
            <h3 className="text-xl mb-2">Facebook</h3>
            <p className="text-sm text-muted-foreground">Follow để cập nhật dự án</p>
          </a>

          <a href="https://zalo.me/g/vbycrx997" target="_blank" rel="noopener noreferrer" className="liquid-glass p-8 rounded-2xl flex flex-col hover:scale-[1.02] transition-transform">
            <div className="h-8 w-8 mb-6 rounded-full border border-white/30 flex items-center justify-center text-xl pb-1">+</div>
            <h3 className="text-xl mb-2">Góp ý công cụ mới</h3>
            <p className="text-sm text-muted-foreground">Đề xuất công cụ bạn cần</p>
          </a>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} P-ShareHub. Built with passion from Vietnam.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://penglish.vercel.app" className="hover:text-white transition-colors">P-English</a>
            <a href="https://www.facebook.com/peterpan003" className="hover:text-white transition-colors">Facebook</a>
            <a href="https://zalo.me/g/vbycrx997" className="hover:text-white transition-colors">Zalo</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
