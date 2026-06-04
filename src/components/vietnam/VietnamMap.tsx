'use client'

import { useState } from 'react'
import { ArrowLeft, MapPin, Swords, UtensilsCrossed, Landmark, BookOpen, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RegionData {
  id: string
  name: string
  vietnameseName: string
  color: string
  path: string
  center: { x: number; y: number }
  description: string
  heroes: string[]
  landmarks: string[]
  foods: string[]
  history: string
  emoji: string
}

const VIETNAM_REGIONS: RegionData[] = [
  {
    id: 'ha-noi',
    name: 'Hà Nội',
    vietnameseName: 'Hà Nội',
    color: '#e74c3c',
    path: 'M310,52 L320,48 L328,55 L325,65 L315,68 L308,60 Z',
    center: { x: 316, y: 57 },
    description: 'Thủ đô ngàn năm văn hiến, trái tim của Việt Nam',
    heroes: ['Lý Thái Tổ', 'Trần Hưng Đạo', 'Nguyễn Trãi', 'Hồ Chí Minh'],
    landmarks: ['Văn Miếu - Quốc Tử Giám', 'Hồ Gươm', 'Chùa Một Cột', 'Hoàng thành Thăng Long', 'Phố cổ Hà Nội'],
    foods: ['Phở Hà Nội', 'Bún chả', 'Chả cá Lã Vọng', 'Bánh cuốn', 'Cà phê trứng'],
    history: 'Hà Nội có lịch sử hơn 1000 năm, là thủ đô của Việt Nam từ thời Lý Trần. Năm 1010, Lý Thái Tổ dời đô về Thăng Long, mở đầu cho một kỷ nguyên văn minh rực rỡ.',
    emoji: '🏛️',
  },
  {
    id: 'hai-phong',
    name: 'Hải Phòng',
    vietnameseName: 'Hải Phòng',
    color: '#3498db',
    path: 'M332,58 L345,55 L350,62 L345,72 L335,70 L330,65 Z',
    center: { x: 340, y: 63 },
    description: 'Thành phố cảng lớn nhất miền Bắc',
    heroes: ['Nguyễn Bỉnh Khiêm', 'Lê Chân'],
    landmarks: ['Đền Nguyễn Bỉnh Khiêm', 'Bãi biển Đồ Sơn', 'Cát Bà', 'Chùa Dư Hàng'],
    foods: ['Bánh đa cua', 'Cà phê Hải Phòng', 'Nem chua', 'Ốc hấp'],
    history: 'Hải Phòng là thành phố cảng quan trọng nhất phía Bắc, được người Pháp phát triển từ cuối thế kỷ 19.',
    emoji: '⚓',
  },
  {
    id: 'quang-ninh',
    name: 'Quảng Ninh',
    vietnameseName: 'Quảng Ninh',
    color: '#2ecc71',
    path: 'M350,45 L370,40 L380,50 L375,65 L355,68 L348,58 Z',
    center: { x: 363, y: 53 },
    description: 'Vịnh Hạ Long - Di sản thiên nhiên thế giới',
    heroes: ['Trần Hưng Đạo', 'Phạm Tu'],
    landmarks: ['Vịnh Hạ Long', 'Đền Trần', 'Yên Tử', 'Bãi Cháy'],
    foods: ['Hải sản Quảng Ninh', 'Chả mực', 'Sá sùng', 'Bún bành đác'],
    history: 'Quảng Ninh nơi diễn ra 3 lần chiến thắng giặc Mông - Nguyên trên sông Bạch Đằng, đặc biệt năm 1288.',
    emoji: '⛰️',
  },
  {
    id: 'sa-pa',
    name: 'Sa Pa - Lào Cai',
    vietnameseName: 'Sa Pa',
    color: '#9b59b6',
    path: 'M265,65 L290,58 L305,62 L300,80 L275,85 L262,75 Z',
    center: { x: 282, y: 72 },
    description: 'Vùng đất sương mù, ruộng bậc thang tuyệt đẹp',
    heroes: ['Các anh hùng dân tộc thiểu số', 'Hoàng Văn Thụ'],
    landmarks: ['Fansipan', 'Ruộng bậc thang', 'Bản Cát Cát', 'Chợ tình Sa Pa'],
    foods: ['Thắng cố', 'Cơm lam', 'Thịt trâu gác bếp', 'Rượu ngô'],
    history: 'Sa Pa được người Pháp khám phá và phát triển thành khu nghỉ dưỡng từ đầu thế kỷ 20. Nơi đây là quê hương của nhiều dân tộc thiểu số.',
    emoji: '🏔️',
  },
  {
    id: 'hue',
    name: 'Huế',
    vietnameseName: 'Huế',
    color: '#8e44ad',
    path: 'M260,195 L280,188 L295,195 L290,210 L265,215 L255,205 Z',
    center: { x: 275, y: 200 },
    description: 'Cố đô Huế - Di sản văn hóa thế giới',
    heroes: ['Vua Hàm Nghi', 'Phan Đình Phùng', 'Ngô Đình Diệm', 'Phan Bội Châu'],
    landmarks: ['Đại Nội', 'Chùa Thiên Mụ', 'Lăng Tự Đức', 'Sông Hương', 'Cầu Trường Tiền'],
    foods: ['Bún bò Huế', 'Cơm hến', 'Bánh ép', 'Nem lụi', 'Chè Huế'],
    history: 'Huế là cố đô của triều Nguyễn (1802-1945), trung tâm văn hóa và chính trị Việt Nam suốt 143 năm. Kinh thành Huế là di sản văn hóa thế giới UNESCO.',
    emoji: '🏯',
  },
  {
    id: 'da-nang',
    name: 'Đà Nẵng',
    vietnameseName: 'Đà Nẵng',
    color: '#1abc9c',
    path: 'M295,210 L310,205 L318,215 L312,228 L298,230 L292,220 Z',
    center: { x: 305, y: 218 },
    description: 'Thành phố đáng sống nhất Việt Nam',
    heroes: ['Nguyễn Tri Phương', 'Hoàng Diệu'],
    landmarks: ['Bà Nà Hills', 'Cầu Rồng', 'Marble Mountains', 'Bán đảo Sơn Trà'],
    foods: ['Mì Quảng', 'Bánh tráng cuốn thịt heo', 'Bánh xèo', 'Seafood'],
    history: 'Đà Nẵng từng là cảng quan trọng dưới thời Chăm Pa, sau đó trở thành thương cảng sầm uất thời Pháp thuộc.',
    emoji: '🌉',
  },
  {
    id: 'hoi-an',
    name: 'Hội An',
    vietnameseName: 'Hội An',
    color: '#f39c12',
    path: 'M282,230 L298,225 L305,235 L295,245 L280,242 Z',
    center: { x: 292, y: 235 },
    description: 'Phố cổ Hội An - Di sản thế giới',
    heroes: ['Các thương nhân xưa', 'Nguyễn Duy Hiệu'],
    landmarks: ['Chùa Cầu', 'Phố cổ Hội An', 'Biển An Bàng', 'Làng gốm Thanh Hà'],
    foods: ['Cao lầu', 'Mì Quảng', 'Bánh bao vạc', 'Cơm gà Hội An', 'Nước mót'],
    history: 'Hội An là thương cảng quốc tế sầm uất từ thế kỷ 15-19, nơi giao thương giữa Nhật Bản, Trung Quốc và phương Tây.',
    emoji: '🏮',
  },
  {
    id: 'nha-trang',
    name: 'Nha Trang',
    vietnameseName: 'Nha Trang',
    color: '#e67e22',
    path: 'M278,275 L295,268 L305,278 L298,292 L280,290 L275,282 Z',
    center: { x: 290, y: 280 },
    description: 'Vịnh biển tuyệt đẹp, thủ phủ du lịch biển',
    heroes: ['Yersin (Alexandre Yersin)', 'Bà Nguyễn Thị Định'],
    landmarks: ['Tháp Bà Ponagar', 'Vinpearl', 'Hòn Chồng', 'Đảo Hòn Mun'],
    foods: ['Bún cá sứa', 'Nem nướng', 'Chả cá', 'Yến sào'],
    history: 'Nha Trang từng là trung tâm vương quốc Chăm Pa với tháp Ponagar từ thế kỷ 7. Nhà vi trùng học Yersin đã chọn nơi đây làm nơi nghiên cứu.',
    emoji: '🏖️',
  },
  {
    id: 'da-lat',
    name: 'Đà Lạt',
    vietnameseName: 'Đà Lạt',
    color: '#e91e63',
    path: 'M255,272 L272,265 L280,275 L270,290 L252,288 L248,280 Z',
    center: { x: 263, y: 278 },
    description: 'Thành phố ngàn hoa, xứ sở sương mù',
    heroes: ['Nguyễn Hữu Hành', 'Yersin'],
    landmarks: ['Hồ Xuân Hương', 'Thung lũng Tình Yêu', 'Ga xe lửa Đà Lạt', 'Chợ Đà Lạt'],
    foods: ['Bánh căn', 'Bánh tráng nướng', 'Lẩu bò ba toa', 'Cà phê Đà Lạt', 'Dâu tây'],
    history: 'Đà Lạt được Yersin phát hiện năm 1893, người Pháp xây dựng thành khu nghỉ dưỡng với kiến trúc Pháp đặc trưng.',
    emoji: '🌸',
  },
  {
    id: 'ho-chi-minh',
    name: 'TP. Hồ Chí Minh',
    vietnameseName: 'TP.HCM',
    color: '#f1c40f',
    path: 'M238,370 L258,365 L270,378 L262,395 L240,398 L232,385 Z',
    center: { x: 252, y: 381 },
    description: 'Thành phố không ngủ, trung tâm kinh tế Việt Nam',
    heroes: ['Nguyễn Thị Định', 'Trần Văn Trà', 'Huỳnh Tấn Phát', 'Lê Duẩn'],
    landmarks: ['Dinh Độc Lập', 'Nhà thờ Đức Bà', 'Chợ Bến Thành', 'Bảo tàng Chứng tích chiến tranh', 'Đường Nguyễn Huệ'],
    foods: ['Bánh mì', 'Cơm tấm', 'Hủ tiếu', 'Gỏi cuốn', 'Cà phê sữa đá'],
    history: 'Sài Gòn từng là thủ phủ miền Nam từ thế kỷ 18. Sau 1975, thành phố được đổi tên thành TP. Hồ Chí Minh, trở thành trung tâm kinh tế lớn nhất Việt Nam.',
    emoji: '🏙️',
  },
  {
    id: 'can-tho',
    name: 'Cần Thơ',
    vietnameseName: 'Cần Thơ',
    color: '#27ae60',
    path: 'M205,395 L225,388 L235,400 L228,415 L208,418 L200,405 Z',
    center: { x: 218, y: 402 },
    description: 'Tây Đô - Thủ phủ miền Tây sông nước',
    heroes: ['Nguyễn Trung Trực', 'Phan Văn Đáng'],
    landmarks: ['Chợ nổi Cái Răng', 'Chợ nổi Phong Điền', 'Nhà cổ Bình Thủy', 'Vườn trái cây'],
    foods: ['Bánh xèo', 'Cơm cháy', 'Lẩu mắm', 'Bún riêu', 'Cá kho tộ'],
    history: 'Cần Thơ là trung tâm Đồng bằng sông Cửu Long, nổi tiếng với văn hóa sông nước và chợ nổi độc đáo.',
    emoji: '🛶',
  },
  {
    id: 'phu-quoc',
    name: 'Phú Quốc',
    vietnameseName: 'Phú Quốc',
    color: '#00bcd4',
    path: 'M170,415 L192,408 L200,420 L190,435 L172,432 Z',
    center: { x: 185, y: 422 },
    description: 'Đảo Ngọc - Thiên đường biển đảo Việt Nam',
    heroes: ['Nguyễn Trung Trực', 'Lê Văn Duyệt'],
    landmarks: ['Bãi Sao', 'Hòn Thơm', 'Nhà tù Phú Quốc', 'Suối Tranh', 'Làng chài Hàm Ninh'],
    foods: ['Nước mắm Phú Quốc', 'Bún quậy', 'Hải sản tươi', 'Gỏi cá trích', 'Bánh mì Phương'],
    history: 'Phú Quốc từng là nhà tù lớn nhất Việt Nam thời chiến. Nay là đảo du lịch nổi tiếng với nước mắm truyền thống.',
    emoji: '🏝️',
  },
]

type TabType = 'history' | 'heroes' | 'landmarks' | 'foods'

export default function VietnamMap({ onBack }: { onBack: () => void }) {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('history')

  const handleRegionClick = (region: RegionData) => {
    setSelectedRegion(region)
    setActiveTab('history')
  }

  if (selectedRegion) {
    return <RegionDetail region={selectedRegion} onBack={() => setSelectedRegion(null)} activeTab={activeTab} setActiveTab={setActiveTab} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <div className="h-5 w-px bg-white/10" />
            <img src="/p-logo.png" alt="P" className="h-7 w-7" />
            <h1 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
              Việt Nam 🇻🇳
            </h1>
          </div>
          <p className="text-xs text-white/30">Nhấn vào vùng để khám phá</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="relative mx-auto" style={{ maxWidth: '500px' }}>
          <svg viewBox="0 0 440 480" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Vietnam outline - simplified S-shape */}
            <defs>
              <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Main Vietnam shape */}
            <path
              d="M310,20 L325,15 L340,22 L355,18 L370,25 L378,40 L375,55 L365,68 L355,72 L340,75 L325,82 L318,90 L310,95 L300,100 L288,108 L278,118 L268,130 L260,142 L255,155 L250,168 L248,180 L252,192 L258,200 L265,210 L270,222 L275,235 L278,248 L280,260 L278,272 L272,285 L265,295 L258,305 L252,318 L248,330 L245,342 L240,355 L238,368 L240,380 L245,390 L250,400 L242,410 L230,418 L218,425 L200,430 L185,432 L172,428 L165,420 L170,410 L178,405 L188,400 L198,395 L208,388 L218,378 L225,365 L228,352 L232,340 L238,328 L242,315 L240,302 L235,290 L228,278 L222,265 L218,252 L215,240 L218,228 L222,215 L228,202 L235,190 L240,178 L245,165 L248,152 L250,140 L252,128 L258,115 L265,102 L272,92 L280,82 L288,72 L295,62 L300,52 L305,42 L308,32 Z"
              fill="url(#mapGrad)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
            />

            {/* Region markers */}
            {VIETNAM_REGIONS.map((region) => {
              const isHovered = hoveredRegion === region.id
              return (
                <g
                  key={region.id}
                  onClick={() => handleRegionClick(region)}
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="cursor-pointer"
                >
                  {/* Glow effect */}
                  <circle
                    cx={region.center.x}
                    cy={region.center.y}
                    r={isHovered ? 18 : 12}
                    fill={region.color}
                    opacity={isHovered ? 0.3 : 0.15}
                    filter="url(#glow)"
                    className="transition-all duration-300"
                  />
                  {/* Main dot */}
                  <circle
                    cx={region.center.x}
                    cy={region.center.y}
                    r={isHovered ? 7 : 5}
                    fill={region.color}
                    className="transition-all duration-300"
                  />
                  {/* Inner dot */}
                  <circle
                    cx={region.center.x}
                    cy={region.center.y}
                    r={2}
                    fill="white"
                    opacity={0.8}
                  />
                  {/* Label */}
                  <text
                    x={region.center.x}
                    y={region.center.y - (isHovered ? 18 : 14)}
                    textAnchor="middle"
                    fill="white"
                    fontSize={isHovered ? 10 : 8}
                    fontWeight={isHovered ? 600 : 400}
                    className="transition-all duration-300 pointer-events-none"
                  >
                    {region.emoji} {region.vietnameseName}
                  </text>
                </g>
              )
            })}

            {/* East Sea label */}
            <text x="380" y="250" fill="rgba(255,255,255,0.15)" fontSize="11" fontStyle="italic" textAnchor="middle">
              Biển Đông
            </text>

            {/* Paracel & Spratly Islands */}
            <g opacity="0.5">
              <rect x="380" y="150" width="50" height="30" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              <text x="405" y="162" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6">Hoàng Sa</text>
              <text x="405" y="174" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="5">Trường Sa</text>
            </g>
          </svg>
        </div>

        {/* Region Cards Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {VIETNAM_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => handleRegionClick(region)}
              className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left transition-all hover:scale-[1.02] hover:border-white/10 hover:bg-white/[0.05]"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: region.color }} />
                <span className="text-xs text-white/40">{region.emoji}</span>
              </div>
              <h3 className="text-sm font-medium">{region.vietnameseName}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-white/30 line-clamp-2">{region.description}</p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-white/20 group-hover:text-white/40">
                <ChevronRight className="h-3 w-3" />
                Khám phá
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RegionDetail({
  region,
  onBack,
  activeTab,
  setActiveTab,
}: {
  region: RegionData
  onBack: () => void
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}) {
  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'history', label: 'Lịch sử', icon: BookOpen },
    { id: 'heroes', label: 'Anh hùng', icon: Swords },
    { id: 'landmarks', label: 'Danh lam', icon: Landmark },
    { id: 'foods', label: 'Ẩm thực', icon: UtensilsCrossed },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          <div
            className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full blur-3xl"
            style={{ backgroundColor: region.color, opacity: 0.1 }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 pt-8 pb-16">
          <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Quay lại bản đồ
          </button>

          <div className="flex items-center gap-4">
            <span className="text-5xl">{region.emoji}</span>
            <div>
              <h1 className="text-4xl sm:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
                {region.name}
              </h1>
              <p className="mt-2 text-white/50">{region.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="h-5 w-5 text-amber-400" />
                Lịch sử {region.name}
              </h2>
              <p className="leading-relaxed text-white/70">{region.history}</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="mb-3 text-sm font-medium text-white/50">Dòng thời gian nổi bật</h3>
              <div className="space-y-3">
                {region.landmarks.slice(0, 3).map((lm, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: region.color }} />
                    <div>
                      <p className="text-sm text-white/70">{lm}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'heroes' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {region.heroes.map((hero, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg">
                    ⚔️
                  </div>
                  <h3 className="font-medium">{hero}</h3>
                </div>
                <p className="text-sm text-white/40">
                  Anh hùng lịch sử gắn liền với {region.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'landmarks' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {region.landmarks.map((lm, i) => (
              <div key={i} className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04]">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                    <MapPin className="h-5 w-5" style={{ color: region.color }} />
                  </div>
                  <h3 className="font-medium">{lm}</h3>
                </div>
                <p className="text-sm text-white/40">
                  Danh lam thắng cảnh tại {region.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'foods' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {region.foods.map((food, i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04]">
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-2xl">🍜</span>
                  <h3 className="font-medium">{food}</h3>
                </div>
                <p className="text-sm text-white/40">
                  Đặc sản {region.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
