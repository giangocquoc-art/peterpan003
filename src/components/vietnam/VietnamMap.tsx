'use client'

/**
 * VietnamMap.tsx — Main Vietnam Atlas page for P-ShareHub
 *
 * Orchestrates:
 * - Interactive Leaflet map (VietnamInteractiveMap)
 * - Region filter tabs + search
 * - Place cards grid
 * - Place detail view (VietnamPlaceDetail)
 */

import { useState, useMemo, useCallback } from 'react'
import {
  ArrowLeft,
  Search,
  MapPin,
  ChevronRight,
  Filter,
  X,
} from 'lucide-react'
import { vietnamAtlas, getPlaceBySlug, type RegionType, type VietnamPlace } from '@/data/vietnamAtlas'
import VietnamInteractiveMap from './VietnamInteractiveMap'
import VietnamPlaceDetail from './VietnamPlaceDetail'

// ─── Region filter config ────────────────────────────────────────────────────

const REGION_FILTERS: Array<{ id: RegionType | 'all'; label: string; emoji: string; color: string }> = [
  { id: 'all', label: 'Toàn quốc', emoji: '🇻🇳', color: '#ffffff' },
  { id: 'north', label: 'Bắc Bộ', emoji: '🏔️', color: '#3b82f6' },
  { id: 'central', label: 'Trung Bộ', emoji: '🏯', color: '#f59e0b' },
  { id: 'highlands', label: 'Tây Nguyên', emoji: '🌿', color: '#8b5cf6' },
  { id: 'south', label: 'Nam Bộ', emoji: '🛶', color: '#10b981' },
  { id: 'islands', label: 'Biển Đảo', emoji: '🏝️', color: '#ef4444' },
]

// ─── Type labels ─────────────────────────────────────────────────────────────

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

export default function VietnamMap({ onBack }: { onBack: () => void }) {
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

    // Region filter
    if (regionFilter !== 'all') {
      places = places.filter((p) => p.region === regionFilter)
    }

    // Search filter
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

  // Handle navigation to related place from detail view
  const handleNavigateToPlace = useCallback((slug: string) => {
    setSelectedSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // If a place is selected, show the detail view
  if (selectedPlace) {
    return (
      <VietnamPlaceDetail
        place={selectedPlace}
        onBack={() => setSelectedSlug(null)}
        onNavigateToPlace={handleNavigateToPlace}
      />
    )
  }

  // ── Overview: Map + Cards ──────────────────────────────────────────────────

  const totalCities = vietnamAtlas.filter((p) => p.type === 'city').length
  const totalProvinces = vietnamAtlas.filter((p) => p.type === 'province').length
  const totalArchipelagos = vietnamAtlas.filter((p) => p.type === 'archipelago').length

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
            <div className="h-5 w-px bg-white/10" />
            <img src="/p-logo.png" alt="P" className="h-7 w-7" />
            <div>
              <h1
                className="text-lg font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Việt Nam 🇻🇳 — Biển Đông là của Việt Nam
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stats */}
            <div className="hidden items-center gap-2 text-[11px] text-white/30 md:flex">
              <span>{totalCities} thành phố</span>
              <span className="text-white/10">·</span>
              <span>{totalProvinces} tỉnh</span>
              <span className="text-white/10">·</span>
              <span>{totalArchipelagos} quần đảo</span>
            </div>

            {/* Search toggle */}
            <button
              onClick={() => {
                setShowSearch(!showSearch)
                if (showSearch) setSearchQuery('')
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            >
              {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="border-t border-white/5 px-6 py-3">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
                <Search className="h-4 w-4 text-white/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tỉnh, thành phố, đặc sản..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-white/30 hover:text-white/60"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Region filter tabs */}
        <div className="border-t border-white/5 px-6 py-2">
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
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                    }`}
                  >
                    <span className="text-xs">{filter.emoji}</span>
                    <span>{filter.label}</span>
                    <span className="text-[10px] text-white/30">({count})</span>
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
            <Filter className="h-4 w-4 text-white/30" />
            <h2 className="text-sm font-medium text-white/60">
              {filteredPlaces.length} địa điểm
              {regionFilter !== 'all' && (
                <span className="ml-1 text-white/30">
                  · {REGION_FILTERS.find((f) => f.id === regionFilter)?.label}
                </span>
              )}
              {searchQuery && (
                <span className="ml-1 text-white/30">
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
            <p className="text-lg text-white/30">Không tìm thấy kết quả</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setRegionFilter('all')
              }}
              className="mt-3 text-sm text-white/50 underline decoration-white/20 hover:text-white/70"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
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

  return (
    <button
      onClick={onClick}
      className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-white/10 hover:bg-white/[0.05]"
    >
      {/* Top: Emoji icon badge + type label */}
      <div className="mb-2 flex items-center justify-between">
        <div
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-base"
          style={{
            background: `${color}22`,
            border: `2px solid ${color}`,
            boxShadow: `0 0 8px ${color}33`,
          }}
        >
          {place.icon}
        </div>
        <span className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[10px] text-white/30">
          {typeLabels[place.type] || place.type}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-sm font-medium text-white/90 group-hover:text-white">
        {place.name}
      </h3>

      {/* Description */}
      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/30">
        {place.shortDescription}
      </p>

      {/* Bottom: Region + CTA */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] text-white/20">
          {regionLabels[place.region]}
        </span>
        <div className="flex items-center gap-0.5 text-[10px] text-white/20 transition-colors group-hover:text-white/50">
          <span>Khám phá</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </div>
    </button>
  )
}
