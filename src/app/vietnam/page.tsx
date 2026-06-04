'use client'

/**
 * /vietnam — Vietnam Atlas: Interactive map of Vietnam
 *
 * Uses NO-LABEL basemap tiles to prevent foreign disputed-place labels
 * (Sansha, Yongle Qundao, South China Sea, etc.) from appearing.
 * All labels are rendered from our controlled local dataset only.
 *
 * Sovereignty note:
 * - Hoàng Sa and Trường Sa are presented as Vietnamese archipelagos
 * - The sea is called "Biển Đông" (East Sea)
 * - Sources: Bộ Ngoại giao (mofa.gov.vn), Chính phủ (chinhphu.vn)
 */

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Filter,
  X,
  MapPin,
} from 'lucide-react'
import {
  vietnamAtlas,
  getPlaceBySlug,
  type RegionType,
  type VietnamPlace,
} from '@/data/vietnamAtlas'
import dynamic from 'next/dynamic'

// Lazy load the map (requires window/Leaflet)
const VietnamInteractiveMap = dynamic(
  () => import('@/components/vietnam/VietnamInteractiveMap'),
  { ssr: false }
)

// ─── Region filter config ────────────────────────────────────────────────────

const REGION_FILTERS: Array<{
  id: RegionType | 'all'
  label: string
  emoji: string
  color: string
}> = [
  { id: 'all', label: 'Toàn quốc', emoji: '🇻🇳', color: '#ef4444' },
  { id: 'north', label: 'Bắc Bộ', emoji: '🏔️', color: '#3b82f6' },
  { id: 'central', label: 'Trung Bộ', emoji: '🏯', color: '#f59e0b' },
  { id: 'highlands', label: 'Tây Nguyên', emoji: '🌿', color: '#8b5cf6' },
  { id: 'south', label: 'Nam Bộ', emoji: '🛶', color: '#10b981' },
  { id: 'islands', label: 'Biển Đảo', emoji: '🏝️', color: '#ef4444' },
]

const typeLabels: Record<string, string> = {
  city: 'Thành phố',
  province: 'Tỉnh',
  archipelago: 'Quần đảo',
}

const regionLabels: Record<string, string> = {
  north: 'Bắc Bộ',
  central: 'Trung Bộ',
  highlands: 'Tây Nguyên',
  south: 'Nam Bộ',
  islands: 'Biển Đảo',
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function VietnamPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [regionFilter, setRegionFilter] = useState<RegionType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  // Resolve selected place
  const selectedPlace = useMemo(
    () => (selectedSlug ? getPlaceBySlug(selectedSlug) : null),
    [selectedSlug]
  )

  // Filter and search places
  const filteredPlaces = useMemo(() => {
    let places = vietnamAtlas

    if (regionFilter !== 'all') {
      places = places.filter((p) => p.region === regionFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      places = places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    return places
  }, [regionFilter, searchQuery])

  // Handle place selection from map or card
  const handleSelectPlace = useCallback((slug: string) => {
    setSelectedSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // If a place is selected, show detail view inline
  if (selectedPlace) {
    return (
      <VietnamPlaceDetailInline
        place={selectedPlace}
        onBack={() => setSelectedSlug(null)}
        onNavigateToPlace={(slug) => {
          setSelectedSlug(slug)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  // ── Overview: Map + Cards ──────────────────────────────────────────────────

  const totalCities = vietnamAtlas.filter((p) => p.type === 'city').length
  const totalProvinces = vietnamAtlas.filter((p) => p.type === 'province').length
  const totalArchipelagos = vietnamAtlas.filter(
    (p) => p.type === 'archipelago'
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Trang chủ</span>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <img src="/p-logo.png" alt="P" className="h-6 w-6" />
            <div>
              <h1 className="text-base font-bold text-slate-900 sm:text-lg">
                Việt Nam Atlas 🇻🇳
              </h1>
              <p className="hidden text-[11px] text-slate-400 sm:block">
                Biển Đông là của Việt Nam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="hidden items-center gap-2 text-[11px] text-slate-400 md:flex">
              <span>{totalCities} thành phố</span>
              <span className="text-slate-200">·</span>
              <span>{totalProvinces} tỉnh</span>
              <span className="text-slate-200">·</span>
              <span>{totalArchipelagos} quần đảo</span>
            </div>

            {/* Search toggle */}
            <button
              onClick={() => {
                setShowSearch(!showSearch)
                if (showSearch) setSearchQuery('')
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              {showSearch ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="border-t border-slate-100 px-4 py-3 sm:px-6">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                <Search className="h-4 w-4 text-slate-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tỉnh, thành phố, đặc sản..."
                  className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-300"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-300 hover:text-slate-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Region filter tabs */}
        <div className="border-t border-slate-100 px-4 py-2 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {REGION_FILTERS.map((filter) => {
                const isActive = regionFilter === filter.id
                const count =
                  filter.id === 'all'
                    ? vietnamAtlas.length
                    : vietnamAtlas.filter((p) => p.region === filter.id).length
                return (
                  <button
                    key={filter.id}
                    onClick={() => setRegionFilter(filter.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-red-50 text-red-700 font-medium'
                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    <span className="text-xs">{filter.emoji}</span>
                    <span>{filter.label}</span>
                    <span
                      className={`text-[10px] ${
                        isActive ? 'text-red-400' : 'text-slate-300'
                      }`}
                    >
                      ({count})
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Map */}
        <div className="mb-8">
          <VietnamInteractiveMap
            onSelectPlace={handleSelectPlace}
            selectedSlug={selectedSlug ?? undefined}
            regionFilter={regionFilter}
          />
        </div>

        {/* Results header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-300" />
            <h2 className="text-sm font-medium text-slate-500">
              {filteredPlaces.length} địa điểm
              {regionFilter !== 'all' && (
                <span className="ml-1 text-slate-300">
                  ·{' '}
                  {REGION_FILTERS.find((f) => f.id === regionFilter)?.label}
                </span>
              )}
              {searchQuery && (
                <span className="ml-1 text-slate-300">
                  · Kết quả cho &quot;{searchQuery}&quot;
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Place Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.slug}
              place={place}
              onClick={() => handleSelectPlace(place.slug)}
            />
          ))}
        </div>

        {/* Empty state */}
        {filteredPlaces.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-slate-300">Không tìm thấy kết quả</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setRegionFilter('all')
              }}
              className="mt-3 text-sm text-slate-400 underline decoration-slate-200 hover:text-slate-600"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-100 bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl text-center text-xs text-slate-400">
          <p>
            Dữ liệu bản đồ được kiểm soát nội bộ — không sử dụng nhãn từ nguồn
            bên ngoài.
          </p>
          <p className="mt-1">
            Hoàng Sa, Trường Sa: Theo lập trường và tài liệu lịch sử - pháp lý
            của Việt Nam.
          </p>
          <p className="mt-1">
            Nguồn tham khảo: Bộ Ngoại giao (mofa.gov.vn), Chính phủ
            (chinhphu.vn)
          </p>
        </div>
      </footer>
    </div>
  )
}

// ─── Place Card Component ────────────────────────────────────────────────────

function PlaceCard({
  place,
  onClick,
}: {
  place: VietnamPlace
  onClick: () => void
}) {
  const regionColors: Record<string, string> = {
    north: '#3b82f6',
    central: '#f59e0b',
    south: '#10b981',
    highlands: '#8b5cf6',
    islands: '#ef4444',
  }
  const color = regionColors[place.region] || '#6b7280'
  const isArchipelago = place.type === 'archipelago'

  return (
    <button
      onClick={onClick}
      className={`group rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
        isArchipelago
          ? 'border-red-200 bg-red-50/50 hover:border-red-300 hover:bg-red-50'
          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
      }`}
    >
      {/* Top: Emoji icon badge + type label */}
      <div className="mb-2 flex items-center justify-between">
        <div
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-base"
          style={{
            background: `${color}15`,
            border: `2px solid ${color}`,
            boxShadow: `0 0 8px ${color}22`,
          }}
        >
          {place.icon}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            isArchipelago
              ? 'bg-red-100 text-red-600'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {typeLabels[place.type] || place.type}
        </span>
      </div>

      {/* Name */}
      <h3
        className={`text-sm font-semibold ${
          isArchipelago ? 'text-red-800' : 'text-slate-800'
        } group-hover:text-slate-900`}
      >
        {isArchipelago && '🇻🇳 '}{place.name}
      </h3>

      {/* Description */}
      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-400">
        {place.shortDescription}
      </p>

      {/* Bottom: Region + CTA */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-slate-300">
          {regionLabels[place.region]}
        </span>
        <div className="flex items-center gap-0.5 text-[10px] text-slate-300 transition-colors group-hover:text-slate-500">
          <span>Khám phá</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </button>
  )
}

// ─── Inline Detail View (when a place is selected) ──────────────────────────

function VietnamPlaceDetailInline({
  place,
  onBack,
  onNavigateToPlace,
}: {
  place: VietnamPlace
  onBack: () => void
  onNavigateToPlace: (slug: string) => void
}) {
  const isArchipelago = place.type === 'archipelago'

  // Resolve related places
  const relatedPlaces = place.relatedPlaces
    .map((slug) => getPlaceBySlug(slug))
    .filter((p): p is VietnamPlace => p !== undefined)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Bản đồ
          </button>
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
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-5xl sm:text-6xl leading-none">
                  {place.icon}
                </span>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                    {isArchipelago && '🇻🇳 '}{place.name}
                  </h1>
                  {isArchipelago && (
                    <p className="mt-1 text-sm font-medium text-red-600">
                      Thuộc chủ quyền Việt Nam
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
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
        {/* 1. History */}
        <section>
          <SectionTitle
            icon="📖"
            title="Lịch sử nổi bật"
            color={place.accentColor}
          />
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="relative space-y-4 pl-6">
              <div
                className="absolute left-[7px] top-2 bottom-2 w-px opacity-20"
                style={{ backgroundColor: place.accentColor }}
              />
              {place.historyHighlights.map((highlight, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div
                    className="absolute -left-6 top-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-white"
                    style={{ backgroundColor: place.accentColor }}
                  />
                  <p className="text-sm leading-relaxed text-slate-600">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Notable Heroes */}
        <section>
          <SectionTitle
            icon="⚔️"
            title="Nhân vật / Anh hùng tiêu biểu"
            color={place.accentColor}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {place.notableHeroes.map((hero, i) => (
              <div
                key={i}
                className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200 hover:shadow"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-sm">
                    ⚔️
                  </div>
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

        {/* 3. Landmarks */}
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
                className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200 hover:shadow"
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

        {/* 4. Foods */}
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
                className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-slate-200 hover:shadow"
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

        {/* 5. Culture */}
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

        {/* 6. Learning Questions */}
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

        {/* 7. Related Places */}
        {relatedPlaces.length > 0 && (
          <section>
            <SectionTitle
              icon="📍"
              title="Nơi liên quan"
              color={place.accentColor}
            />
            <div className="flex gap-3 overflow-x-auto pb-2">
              {relatedPlaces.map((rp) => (
                <button
                  key={rp.slug}
                  onClick={() => onNavigateToPlace(rp.slug)}
                  className="group flex w-48 flex-shrink-0 items-start gap-2 rounded-xl border border-slate-100 bg-white p-3 text-left shadow-sm transition-all hover:border-slate-200 hover:shadow"
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
                </button>
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
