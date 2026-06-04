'use client'

/**
 * /vietnam/[slug] — Detail page for each Vietnam province/city/archipelago
 *
 * For Hoàng Sa and Trường Sa, uses special educational sections:
 * 1. Vị trí địa lý
 * 2. Dấu mốc lịch sử
 * 3. Tư liệu và bằng chứng lịch sử - pháp lý
 * 4. Vai trò trong nhận thức biển đảo Việt Nam
 * 5. Câu hỏi học nhanh
 *
 * Sources: Bộ Ngoại giao (mofa.gov.vn), Chính phủ (chinhphu.vn), vietnam.vn
 */

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useMemo } from 'react'
import {
  ArrowLeft,
  ChevronRight,
} from 'lucide-react'
import {
  vietnamAtlas,
  getPlaceBySlug,
  type VietnamPlace,
  type RegionType,
  type UnitType,
} from '@/data/vietnamAtlas'

// ─── Special content for Hoàng Sa and Trường Sa ──────────────────────────────

interface ArchipelagoDetail {
  viTriDiaLy: string[]
  dauMocLichSu: string[]
  tuLieuBangChung: string[]
  vaiTroNhanThuc: string[]
  cauHoiHocNhanh: string[]
  sourceNotes: string[]
}

const ARCHIPELAGO_DETAILS: Record<string, ArchipelagoDetail> = {
  'hoang-sa': {
    viTriDiaLy: [
      'Quần đảo Hoàng Sa nằm ở phía đông Việt Nam, trên Biển Đông, cách đất liền khoảng 250 hải lý về phía đông Đà Nẵng.',
      'Quần đảo bao gồm hơn 30 đảo, đá, rạn san hô, trải rộng trên diện tích khoảng 15.000 km² vùng biển.',
      'Đảo lớn nhất là đảo Hoàng Sa (Pattle Island), có diện tích khoảng 0,15 km².',
      'Quần đảo Hoàng Sa nằm trên tuyến hàng hải quan trọng nối liền Thái Bình Dương và Ấn Độ Dương.',
    ],
    dauMocLichSu: [
      'Từ ít nhất thế kỷ XVII, các chúa Nguyễn đã tổ chức khai thác và quản lý Hoàng Sa. Đội Hoàng Sa được lập ra để ra đảo khai thác sản vật và đo đạc hải trình.',
      'Năm 1816, vua Gia Long chính thức xác lập chủ quyền Việt Nam đối với Hoàng Sa bằng cờ hiệu.',
      'Năm 1835, vua Minh Mạng cho xây dựng đền, đặt mốc và trồng cây trên đảo Hoàng Sa.',
      'Các bản đồ cổ của Việt Nam (thế kỷ XVII-XIX) đều ghi Hoàng Sa là lãnh thổ Việt Nam, bao gồm: Đại Nam nhất thống toàn đồ, An Nam đại quốc họa đồ.',
      'Năm 1909, Trung Quốc bắt đầu đưa tàu đến khu vực Hoàng Sa, khởi đầu tranh chấp.',
      'Năm 1956, Trung Quốc dùng vũ lực chiếm đóng phần đông quần đảo Hoàng Sa.',
      'Năm 1974, Trung Quốc chiếm toàn bộ quần đảo Hoàng Sa bằng vũ lực.',
    ],
    tuLieuBangChung: [
      'Sách "Phủ biên tạp lục" (Lê Quý Đôn, 1776) ghi chép chi tiết về việc đội Hoàng Sa khai thác hải sản.',
      'Sách "Đại Nam thực lục chính biên" ghi chép các hoạt động quản lý Hoàng Sa của triều Nguyễn.',
      'Bản đồ "An Nam đại quốc họa đồ" (giữa thế kỷ XVIII) của giáo sĩ Jean-Louis Taberd ghi rõ Paracel thuộc Việt Nam.',
      'Nhiều bản đồ phương Tây thế kỷ XVIII-XIX ghi Paracel/Hoàng Sa là lãnh thổ Việt Nam hoặc An Nam.',
      'Bộ Ngoại giao Việt Nam đã nhiều lần công bố các bằng chứng lịch sử và cơ sở pháp lý khẳng định chủ quyền Việt Nam đối với Hoàng Sa.',
    ],
    vaiTroNhanThuc: [
      'Hoàng Sa và Trường Sa là hai quần đảo quan trọng trên Biển Đông, có ý nghĩa chiến lược về an ninh, kinh tế và môi trường.',
      'Nhận thức về chủ quyền biển đảo là trách nhiệm của mọi công dân Việt Nam, đặc biệt là thế hệ trẻ.',
      'Việc tìm hiểu lịch sử, địa lý Hoàng Sa góp phần củng cố tinh thần yêu nước và ý thức bảo vệ lãnh thổ.',
      'Các hoạt động giáo dục về biển đảo được đưa vào chương trình học phổ thông và đại học tại Việt Nam.',
    ],
    cauHoiHocNhanh: [
      'Đội Hoàng Sa được lập ra từ thời nào và có nhiệm vụ gì?',
      'Vì sao vua Gia Long năm 1816 có hành động khẳng định chủ quyền tại Hoàng Sa?',
      'Những bản đồ nào của Việt Nam ghi Hoàng Sa là lãnh thổ Việt Nam?',
      'Sách "Phủ biên tạp lục" của Lê Quý Đôn viết gì về Hoàng Sa?',
      'Vì sao nhận thức về chủ quyền biển đảo quan trọng với mỗi công dân Việt Nam?',
    ],
    sourceNotes: [
      'Nguồn: Bộ Ngoại giao Việt Nam - mofa.gov.vn',
      'Nguồn: Cổng thông tin Chính phủ - chinhphu.vn',
      'Nguồn: Đại sứ quán Việt Nam tại Sri Lanka - vnembassy-colombo.mofa.gov.vn',
      'Nguồn: Viện nghiên cứu Biển Đông',
    ],
  },
  'truong-sa': {
    viTriDiaLy: [
      'Quần đảo Trường Sa nằm ở phía đông nam Việt Nam, trên Biển Đông, cách đất liền khoảng 250 hải lý.',
      'Quần đảo bao gồm hơn 100 đảo, đá, rạn san hô, trải rộng trên diện tích khoảng 160.000 km² vùng biển.',
      'Việt Nam duy trì hiện diện trên nhiều thực thể thuộc quần đảo Trường Sa, bao gồm các đảo, đá và nhà giàn.',
      'Trường Sa nằm trên tuyến hàng hải quốc tế quan trọng bậc nhất thế giới, kết nối châu Á với châu Âu và Trung Đông.',
    ],
    dauMocLichSu: [
      'Từ thời các chúa Nguyễn, đội Hoàng Sa kiêm quản cả quần đảo Trường Sa (còn gọi là Hoàng Sa ngoài và Hoàng Sa trong).',
      'Các bản đồ cổ Việt Nam thế kỷ XVII-XIX đều ghi Trường Sa cùng với Hoàng Sa là lãnh thổ Việt Nam.',
      'Năm 1933, Pháp thay mặt Việt Nam chính thức khẳng định chủ quyền đối với Trường Sa trước cộng đồng quốc tế.',
      'Năm 1956, Việt Nam Cộng hòa cắm cờ và dựng bia chủ quyền trên các đảo thuộc Trường Sa.',
      'Từ năm 1975, Việt Nam tiếp quản và duy trì hiện diện trên quần đảo Trường Sa cho đến nay.',
      'Nhiều quốc gia cũng tuyên bố chủ quyền một phần Trường Sa, tạo thành tình hình tranh chấp phức tạp trên Biển Đông.',
    ],
    tuLieuBangChung: [
      'Bản đồ "Đại Nam nhất thống toàn đồ" (1838) ghi Trường Sa thuộc lãnh thổ Việt Nam.',
      'Sách "Đại Nam thực lục" ghi chép các hoạt động quản lý của triều Nguyễn đối với Hoàng Sa và Trường Sa.',
      'Bản đồ "An Nam đại quốc họa đồ" của giáo sĩ Taberd (1838) ghi cả Paracel và Spratly thuộc Việt Nam.',
      'Bộ Ngoại giao Việt Nam đã công bố nhiều sách trắng và tài liệu pháp lý khẳng định chủ quyền đối với Trường Sa.',
      'Việt Nam luôn khẳng định chủ quyền đối với Trường Sa dựa trên cơ sở lịch sử và pháp lý vững chắc, phù hợp luật pháp quốc tế.',
    ],
    vaiTroNhanThuc: [
      'Trường Sa có vị trí chiến lược đặc biệt quan trọng đối với an ninh quốc phòng và phát triển kinh tế Việt Nam.',
      'Khu vực quanh Trường Sa giàu tài nguyên thiên nhiên, đặc biệt là hải sản và tiềm năng dầu khí.',
      'Bảo vệ chủ quyền biển đảo là trách nhiệm thiêng liêng của mọi thế hệ người Việt Nam.',
      'Giáo dục nhận thức về Trường Sa trong trường học giúp học sinh hiểu và trân trọng lịch sử dân tộc.',
    ],
    cauHoiHocNhanh: [
      'Quần đảo Trường Sa nằm ở vị trí nào trên Biển Đông?',
      'Đội Hoàng Sa thời chúa Nguyễn có nhiệm vụ gì liên quan đến Trường Sa?',
      'Bản đồ "Đại Nam nhất thống toàn đồ" ghi gì về Trường Sa?',
      'Vì sao Pháp năm 1933 chính thức khẳng định chủ quyền đối với Trường Sa?',
      'Vai trò của quần đảo Trường Sa đối với an ninh và kinh tế Việt Nam?',
    ],
    sourceNotes: [
      'Nguồn: Bộ Ngoại giao Việt Nam - mofa.gov.vn',
      'Nguồn: Cổng thông tin Chính phủ - chinhphu.vn',
      'Nguồn: Đại sứ quán Việt Nam tại Sri Lanka - vnembassy-colombo.mofa.gov.vn',
      'Nguồn: Viện nghiên cứu Biển Đông',
    ],
  },
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const regionLabels: Record<RegionType, string> = {
  north: 'Bắc Bộ',
  central: 'Trung Bộ',
  south: 'Nam Bộ',
  highlands: 'Tây Nguyên',
  islands: 'Biển Đảo',
}

const typeLabels: Record<UnitType, string> = {
  city: 'Thành phố',
  province: 'Tỉnh',
  archipelago: 'Quần đảo',
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function VietnamDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const place = useMemo(() => getPlaceBySlug(slug), [slug])

  if (!place) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-800">
            Không tìm thấy
          </h1>
          <p className="mb-4 text-sm text-slate-500">
            Địa điểm &quot;{slug}&quot; không tồn tại.
          </p>
          <Link
            href="/vietnam"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại bản đồ
          </Link>
        </div>
      </div>
    )
  }

  const isArchipelago = place.type === 'archipelago'
  const archipelagoDetail = isArchipelago
    ? ARCHIPELAGO_DETAILS[place.slug]
    : null

  // Resolve related places
  const relatedPlaces = place.relatedPlaces
    .map((s) => getPlaceBySlug(s))
    .filter((p): p is VietnamPlace => p !== undefined)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/vietnam"
            className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Bản đồ
          </Link>
          <div className="h-5 w-px bg-slate-200" />
          <span className="text-sm font-medium text-slate-700">
            {place.icon} {place.name}
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 30% 40%, ${place.accentColor}, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-5xl sm:text-6xl leading-none">
              {place.icon}
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                {isArchipelago && '🇻🇳 '}{place.name}
              </h1>
              {isArchipelago && (
                <p className="mt-1 text-sm font-semibold text-red-600">
                  Thuộc chủ quyền Việt Nam theo lập trường và tài liệu lịch sử
                  - pháp lý của Việt Nam
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
                  {typeLabels[place.type]}
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">
                  {regionLabels[place.region]}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
            {place.shortDescription}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
        {isArchipelago && archipelagoDetail ? (
          /* ── Special Archipelago Sections ── */
          <>
            {/* 1. Vị trí địa lý */}
            <section>
              <SectionTitle
                icon="📍"
                title="Vị trí địa lý"
                color={place.accentColor}
              />
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="space-y-3">
                  {archipelagoDetail.viTriDiaLy.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div
                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: place.accentColor }}
                      />
                      <p className="text-sm leading-relaxed text-slate-600">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Dấu mốc lịch sử */}
            <section>
              <SectionTitle
                icon="📖"
                title="Dấu mốc lịch sử"
                color={place.accentColor}
              />
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="relative space-y-4 pl-6">
                  <div
                    className="absolute left-[7px] top-2 bottom-2 w-px opacity-20"
                    style={{ backgroundColor: place.accentColor }}
                  />
                  {archipelagoDetail.dauMocLichSu.map((item, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <div
                        className="absolute -left-6 top-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-white"
                        style={{ backgroundColor: place.accentColor }}
                      />
                      <p className="text-sm leading-relaxed text-slate-600">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. Tư liệu và bằng chứng lịch sử - pháp lý */}
            <section>
              <SectionTitle
                icon="⚖️"
                title="Tư liệu và bằng chứng lịch sử - pháp lý"
                color={place.accentColor}
              />
              <div className="rounded-xl border border-red-100 bg-red-50/30 p-5 shadow-sm">
                <div className="space-y-3">
                  {archipelagoDetail.tuLieuBangChung.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-lg bg-white p-3"
                    >
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-red-100 text-[10px] font-bold text-red-600">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 4. Vai trò trong nhận thức biển đảo Việt Nam */}
            <section>
              <SectionTitle
                icon="🎓"
                title="Vai trò trong nhận thức biển đảo Việt Nam"
                color={place.accentColor}
              />
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="space-y-3">
                  {archipelagoDetail.vaiTroNhanThuc.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                      <p className="text-sm leading-relaxed text-slate-600">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Câu hỏi học nhanh */}
            <section>
              <SectionTitle
                icon="🧠"
                title="Câu hỏi học nhanh"
                color={place.accentColor}
              />
              <div className="space-y-2">
                {archipelagoDetail.cauHoiHocNhanh.map((question, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-xs font-bold text-red-600">
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {question}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Source notes */}
            <section className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="mb-2 text-xs font-semibold text-slate-500">
                Nguồn tham khảo
              </h3>
              <ul className="space-y-1">
                {archipelagoDetail.sourceNotes.map((note, i) => (
                  <li key={i} className="text-[11px] text-slate-400">
                    • {note}
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          /* ── Standard Province/City Sections ── */
          <>
            {/* History */}
            <section>
              <SectionTitle
                icon="📖"
                title="Lịch sử nổi bật"
                color={place.accentColor}
              />
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="relative space-y-4 pl-6">
                  <div
                    className="absolute left-[7px] top-2 bottom-2 w-px opacity-20"
                    style={{ backgroundColor: place.accentColor }}
                  />
                  {place.historyHighlights.map((h, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <div
                        className="absolute -left-6 top-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-white"
                        style={{ backgroundColor: place.accentColor }}
                      />
                      <p className="text-sm leading-relaxed text-slate-600">
                        {h}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Heroes */}
            <section>
              <SectionTitle
                icon="⚔️"
                title="Nhân vật tiêu biểu"
                color={place.accentColor}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {place.notableHeroes.map((hero, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">⚔️</span>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          {hero.name}
                        </h3>
                        <span className="text-[10px] text-slate-400">
                          {hero.period}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {hero.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Landmarks */}
            <section>
              <SectionTitle
                icon="🏛️"
                title="Danh lam thắng cảnh"
                color={place.accentColor}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {place.landmarks.map((lm, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <h3 className="mb-1 text-sm font-semibold text-slate-800">
                      {lm.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {lm.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Foods */}
            <section>
              <SectionTitle
                icon="🍜"
                title="Món ngon nên biết"
                color={place.accentColor}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {place.foods.map((food, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-lg">
                        {['🍜', '🍲', '🥘', '🍱', '🥟'][i % 5]}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-800">
                        {food.name}
                      </h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {food.shortDescription}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Culture */}
            <section>
              <SectionTitle
                icon="✨"
                title="Văn hóa & Đời sống"
                color={place.accentColor}
              />
              <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="space-y-3">
                  {place.cultureNotes.map((note, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div
                        className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: place.accentColor }}
                      />
                      <p className="text-sm leading-relaxed text-slate-600">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Learning Questions */}
            <section>
              <SectionTitle
                icon="🧠"
                title="Học nhanh"
                color={place.accentColor}
              />
              <div className="space-y-2">
                {place.suggestedLearningQuestions.map((question, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                        style={{ backgroundColor: place.accentColor }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {question}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Related Places */}
        {relatedPlaces.length > 0 && (
          <section>
            <SectionTitle
              icon="📍"
              title="Nơi liên quan"
              color={place.accentColor}
            />
            <div className="flex gap-3 overflow-x-auto pb-2">
              {relatedPlaces.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/vietnam/${rp.slug}`}
                  className="group flex w-48 flex-shrink-0 items-start gap-2 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-slate-200 hover:shadow"
                >
                  <span className="text-xl leading-none">{rp.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                      {rp.name}
                    </h3>
                    <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-slate-400">
                      {rp.shortDescription}
                    </p>
                    <div className="mt-1 flex items-center gap-0.5 text-[9px] text-slate-300 group-hover:text-slate-500">
                      <span>Khám phá</span>
                      <ChevronRight className="h-2.5 w-2.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-5xl text-center text-xs text-slate-400">
          <p>
            Nguồn tham khảo: Bộ Ngoại giao (mofa.gov.vn), Chính phủ
            (chinhphu.vn)
          </p>
        </div>
      </footer>
    </div>
  )
}

// ─── Section Title ─────────────────────────────────────────────────────────────

function SectionTitle({
  icon,
  title,
  color,
}: {
  icon: string
  title: string
  color: string
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
        style={{ backgroundColor: `${color}12` }}
      >
        {icon}
      </div>
      <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
        {title}
      </h2>
    </div>
  )
}
