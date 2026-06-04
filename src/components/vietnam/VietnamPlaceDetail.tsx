'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Swords,
  Landmark,
  UtensilsCrossed,
  Sparkles,
  Brain,
  ChevronRight,
  Eye,
  EyeOff,
  MapPin,
} from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getPlaceBySlug, type VietnamPlace, type RegionType, type UnitType } from '@/data/vietnamAtlas'

import 'leaflet/dist/leaflet.css'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface VietnamPlaceDetailProps {
  place: VietnamPlace
  onBack: () => void
  onNavigateToPlace: (slug: string) => void
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

// ─── Component ─────────────────────────────────────────────────────────────────

export default function VietnamPlaceDetail({ place, onBack, onNavigateToPlace }: VietnamPlaceDetailProps) {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set())

  const toggleAnswer = (index: number) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  // Resolve related places
  const relatedPlaces = place.relatedPlaces
    .map((slug) => getPlaceBySlug(slug))
    .filter((p): p is VietnamPlace => p !== undefined)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ─── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient background using accentColor */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 30% 40%, ${place.accentColor}, transparent 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />

        {/* Decorative glow */}
        <div
          className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full blur-[120px]"
          style={{ backgroundColor: place.accentColor, opacity: 0.06 }}
        />

        <div className="relative mx-auto max-w-5xl px-6 pt-8 pb-12">
          {/* Back button */}
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-white/50 transition-all hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại bản đồ
          </button>

          {/* Hero content */}
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
            {/* Left: Emoji + info */}
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-4">
                <span className="text-6xl sm:text-7xl leading-none">{place.icon}</span>
                <div>
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {place.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white/70"
                    >
                      {typeLabels[place.type]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white/70"
                    >
                      {regionLabels[place.region]}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
                {place.shortDescription}
              </p>
              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {place.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-xs text-white/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Mini map */}
            <div className="flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
              <MapContainer
                center={place.coordinates}
                zoom={8}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                zoomControl={false}
                attributionControl={false}
                style={{ width: 200, height: 150 }}
                className="rounded-xl"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <CircleMarker
                  center={place.coordinates}
                  radius={6}
                  pathOptions={{
                    color: place.accentColor,
                    fillColor: place.accentColor,
                    fillOpacity: 0.8,
                    weight: 2,
                  }}
                />
              </MapContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Content Sections ────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl space-y-10 px-6 pb-20">

        {/* ── 1. Lịch sử nổi bật ───────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={BookOpen} title="Lịch sử nổi bật" accentColor={place.accentColor} />
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 sm:p-6">
            <div className="relative space-y-5 pl-6">
              {/* Vertical line */}
              <div
                className="absolute left-[7px] top-2 bottom-2 w-px opacity-20"
                style={{ backgroundColor: place.accentColor }}
              />
              {place.historyHighlights.map((highlight, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  {/* Dot */}
                  <div
                    className="absolute -left-6 top-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full border-2 border-black"
                    style={{ backgroundColor: place.accentColor }}
                  />
                  <p className="text-sm leading-relaxed text-white/70">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. Nhân vật / Anh hùng tiêu biểu ─────────────────────────────── */}
        <section>
          <SectionTitle icon={Swords} title="Nhân vật / Anh hùng tiêu biểu" accentColor={place.accentColor} />
          <div className="grid gap-4 sm:grid-cols-2">
            {place.notableHeroes.map((hero, i) => (
              <div
                key={i}
                className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg"
                  >
                    ⚔️
                  </div>
                  <div>
                    <h3 className="font-medium text-white/90">{hero.name}</h3>
                    <Badge
                      variant="outline"
                      className="mt-0.5 border-white/10 bg-white/5 text-[10px] text-white/50"
                    >
                      {hero.period}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/50">{hero.shortDescription}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Danh lam thắng cảnh ────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={Landmark} title="Danh lam thắng cảnh" accentColor={place.accentColor} />
          <div className="grid gap-4 sm:grid-cols-2">
            {place.landmarks.map((lm, i) => (
              <div
                key={i}
                className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5"
                  >
                    <Landmark className="h-4 w-4" style={{ color: place.accentColor }} />
                  </div>
                  <h3 className="font-medium text-white/90">{lm.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/50">{lm.shortDescription}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Món ngon nên biết ──────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={UtensilsCrossed} title="Món ngon nên biết" accentColor={place.accentColor} />
          <div className="grid gap-4 sm:grid-cols-2">
            {place.foods.map((food, i) => (
              <div
                key={i}
                className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-2xl">
                    {i % 5 === 0 ? '🍜' : i % 5 === 1 ? '🍲' : i % 5 === 2 ? '🥘' : i % 5 === 3 ? '🍱' : '🥟'}
                  </span>
                  <h3 className="font-medium text-white/90">{food.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/50">{food.shortDescription}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. Văn hóa & Đời sống ─────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={Sparkles} title="Văn hóa & Đời sống" accentColor={place.accentColor} />
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5 sm:p-6">
            <div className="space-y-4">
              {place.cultureNotes.map((note, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: place.accentColor }}
                  />
                  <p className="text-sm leading-relaxed text-white/70">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Học nhanh ──────────────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={Brain} title="Học nhanh 🧠" accentColor={place.accentColor} />
          <p className="mb-4 -mt-2 text-sm text-white/40">Kiểm tra kiến thức của bạn!</p>
          <div className="space-y-3">
            {place.suggestedLearningQuestions.map((question, i) => {
              const isRevealed = revealedAnswers.has(i)
              return (
                <div
                  key={i}
                  className="rounded-xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                      style={{ backgroundColor: `${place.accentColor}20`, color: place.accentColor }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-relaxed text-white/80">
                        {question}
                      </p>
                      <div className="mt-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAnswer(i)}
                          className="h-7 gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white/60 transition-all hover:bg-white/10 hover:text-white/80"
                        >
                          {isRevealed ? (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Ẩn đáp án
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3" />
                              Hiện đáp án
                            </>
                          )}
                        </Button>
                      </div>
                      {isRevealed && (
                        <div
                          className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-sm leading-relaxed text-white/50"
                          style={{ borderLeftColor: place.accentColor, borderLeftWidth: 2 }}
                        >
                          Hãy tự tìm hiểu và chia sẻ với bạn bè! 🔍
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── 7. Nơi liên quan ──────────────────────────────────────────────── */}
        {relatedPlaces.length > 0 && (
          <section>
            <SectionTitle icon={MapPin} title="Nơi liên quan" accentColor={place.accentColor} />
            <div className="-mx-6 overflow-x-auto px-6 pb-2">
              <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                {relatedPlaces.map((relatedPlace) => (
                  <button
                    key={relatedPlace.slug}
                    onClick={() => onNavigateToPlace(relatedPlace.slug)}
                    className="group flex w-56 flex-shrink-0 items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]"
                  >
                    <span className="text-2xl leading-none">{relatedPlace.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white/80 group-hover:text-white">
                        {relatedPlace.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/40">
                        {relatedPlace.shortDescription}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-white/30 group-hover:text-white/50">
                        <ChevronRight className="h-3 w-3" />
                        Khám phá
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

// ─── Section Title ─────────────────────────────────────────────────────────────

function SectionTitle({
  icon: Icon,
  title,
  accentColor,
}: {
  icon: React.ElementType
  title: string
  accentColor: string
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accentColor}15` }}
      >
        <Icon className="h-4 w-4" style={{ color: accentColor }} />
      </div>
      <h2
        className="text-lg font-semibold tracking-tight text-white/90 sm:text-xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>
    </div>
  )
}
