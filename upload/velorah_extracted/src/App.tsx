import { Canvas } from '@react-three/fiber';
import { Starfield } from './components/Starfield';
import { FeaturedTools, ProductHighlights, AboutSection, Footer } from './components/Sections';

export default function App() {
  return (
    <div className="relative w-full bg-black">
      {/* 3D Starfield Background */}
      <div className="fixed inset-0 z-0 h-screen w-full opacity-60 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Starfield />
        </Canvas>
      </div>

      {/* Attached user image layered subtly in the background */}
      <img 
        src="/bg-image.jpg" 
        alt="Background" 
        className="fixed inset-0 z-0 h-screen w-full object-cover opacity-50 grayscale mix-blend-screen pointer-events-none"
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

          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm text-foreground transition-colors">
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

          <button className="liquid-glass cursor-pointer rounded-full px-6 py-2.5 text-sm text-foreground transition-transform hover:scale-[1.03]">
            Tìm hiểu thêm về P-Share
          </button>
        </nav>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center px-6 pt-32 pb-40 text-center md:py-[120px] min-h-[80vh]">
          <h1
            className="animate-fade-rise max-w-7xl text-5xl font-normal tracking-[-2.46px] leading-[0.95] sm:text-7xl md:text-8xl"
            style={{ fontFamily: '"Instrument Serif", serif' }}
          >
            P-ShareHub
          </h1>

          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg mx-auto italic">
            "Có những người sinh ra vốn là ánh sáng, nhưng có những người phải tự bước đi ra khỏi bóng tối để biến bản thân thành ánh sáng"
          </p>

          <button className="liquid-glass animate-fade-rise-delay-2 mt-12 cursor-pointer rounded-full px-14 py-5 text-base text-foreground transition-transform hover:scale-[1.03]">
            Work with me
          </button>
        </main>

        <FeaturedTools />
        <ProductHighlights />
        <AboutSection />
        <Footer />
      </div>
    </div>
  );
}
