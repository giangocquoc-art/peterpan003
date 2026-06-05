'use client'

/**
 * VietnamInteractiveMap.tsx — Interactive Leaflet map for P-ShareHub's Vietnam Atlas
 *
 * CRITICAL ARCHITECTURE DECISION:
 * This map uses CartoDB LIGHT_NOLABELS tiles — these show land/sea shapes
 * but contain ZERO text labels. ALL place names, sea names, and island names
 * are rendered from our controlled local dataset only.
 *
 * This prevents foreign disputed-place labels (Sansha, Yongle Qundao,
 * South China Sea, Kalayaan, Chinese characters, etc.) from appearing
 * on the map, which would be politically incorrect for a Vietnamese
 * educational website.
 *
 * Sources:
 * - Bộ Ngoại giao Việt Nam (mofa.gov.vn)
 * - Cổng thông tin Chính phủ (chinhphu.vn)
 * - Cổng thông tin quốc gia (vietnam.vn)
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import L from 'leaflet'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { vietnamAtlas, type RegionType, type VietnamPlace } from '@/data/vietnamAtlas'
import { isLabelBlacklisted } from '@/lib/vietnamMapSanitizer'

// ─── Leaflet CSS & Icon Fix ──────────────────────────────────────────────────
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue with webpack/next.js
delete (L.Icon.Default.prototype as any)._getIconUrl

// ─── Constants ────────────────────────────────────────────────────────────────

const VIETNAM_CENTER: [number, number] = [14.0583, 108.2772]

/** Extended bounds to include Hoàng Sa and Trường Sa */
const VIETNAM_BOUNDS: L.LatLngBoundsExpression = [
  [5.0, 101.0],
  [24.5, 118.5],
]

const VIETNAM_MAX_BOUNDS: L.LatLngBoundsExpression = [
  [3.5, 99.5],
  [25.5, 120.0],
]

/** Region colors — bright and easy to see on light basemap */
const REGION_COLORS: Record<RegionType, string> = {
  north: '#2563eb',
  central: '#d97706',
  south: '#059669',
  highlands: '#7c3aed',
  islands: '#dc2626',
}

const REGION_ICONS: Record<RegionType, string> = {
  north: '🏔️',
  central: '🏯',
  south: '🛶',
  highlands: '🌿',
  islands: '🏝️',
}

const TYPE_LABELS: Record<string, string> = {
  city: 'Thành phố',
  province: 'Tỉnh',
  archipelago: 'Quần đảo',
}

const DEFAULT_ZOOM = 6
const SELECTED_ZOOM = 10

// ─── Custom Sovereignty Labels (rendered from our controlled data) ────────────
// These are the ONLY labels that appear in the sea/island area.
// No external tile labels are used.

interface SovereigntyLabel {
  position: [number, number]
  text: string
  style: 'primary' | 'secondary' | 'sea'
  isClickable?: boolean
  slug?: string
}

const SOVEREIGNTY_LABELS: SovereigntyLabel[] = [
  // ── Hoàng Sa ──
  {
    position: [16.9, 112.55],
    text: 'Hoàng Sa',
    style: 'primary',
    isClickable: true,
    slug: 'hoang-sa',
  },
  // ── Trường Sa ──
  {
    position: [9.45, 114.55],
    text: 'Trường Sa',
    style: 'primary',
    isClickable: true,
    slug: 'truong-sa',
  },
  // ── Biển Đông ──
  {
    position: [12.7, 112.35],
    text: 'BIỂN ĐÔNG',
    style: 'sea',
  },
  // ── Việt Nam label in the sea ──
  {
    position: [14.0, 110.0],
    text: 'VIỆT NAM',
    style: 'secondary',
  },
]

// ─── Props Interface ─────────────────────────────────────────────────────────

interface VietnamInteractiveMapProps {
  onSelectPlace: (slug: string) => void
  selectedSlug?: string
  regionFilter?: RegionType | 'all'
}

// ─── Map Controller ──────────────────────────────────────────────────────────

function MapController({ selectedSlug }: { selectedSlug?: string }) {
  const map = useMap()
  const hasFittedBounds = useRef(false)

  useEffect(() => {
    if (!hasFittedBounds.current) {
      map.fitBounds(VIETNAM_BOUNDS, { padding: [30, 30] })
      hasFittedBounds.current = true
    }
  }, [map])

  useEffect(() => {
    if (!selectedSlug) return
    const place = vietnamAtlas.find((p) => p.slug === selectedSlug)
    if (!place) return
    map.flyTo(place.coordinates, SELECTED_ZOOM, {
      duration: 1.2,
      easeLinearity: 0.25,
    })
  }, [selectedSlug, map])

  return null
}

function MapEventHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click() {
      onMapClick()
    },
  })
  return null
}

// ─── Custom DivIcon Factory ──────────────────────────────────────────────────

function createPlaceIcon(place: VietnamPlace, isSelected: boolean, isHovered: boolean) {
  const size = isSelected ? 40 : isHovered ? 36 : 28
  const regionColor = REGION_COLORS[place.region]
  const isArchipelago = place.type === 'archipelago'

  const html = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    ">
      ${isSelected || isHovered ? `
        <div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: ${regionColor}22;
          animation: vietnamPulse 2s ease-in-out infinite;
        "></div>
      ` : ''}
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${isArchipelago ? 'white' : 'white'};
        border: ${isArchipelago ? '3px' : '2.5px'} solid ${regionColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isArchipelago ? (isSelected ? 18 : isHovered ? 17 : 15) : (isSelected ? 20 : isHovered ? 18 : 14)}px;
        line-height: 1;
        box-shadow: 0 2px ${isSelected ? 12 : 6}px ${regionColor}33;
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        ${place.icon}
      </div>
    </div>
  `

  return L.divIcon({
    html,
    className: 'vietnam-place-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  })
}

// ─── Place Marker Component ──────────────────────────────────────────────────

function PlaceMarker({
  place,
  isSelected,
  isHovered,
  onHover,
  onHoverEnd,
  onSelect,
}: {
  place: VietnamPlace
  isSelected: boolean
  isHovered: boolean
  onHover: () => void
  onHoverEnd: () => void
  onSelect: (slug: string) => void
}) {
  const regionColor = REGION_COLORS[place.region]
  const isArchipelago = place.type === 'archipelago'

  const icon = useMemo(
    () => createPlaceIcon(place, isSelected, isHovered),
    [place, isSelected, isHovered]
  )

  return (
    <Marker
      position={place.coordinates}
      icon={icon}
      eventHandlers={{
        mouseover: onHover,
        mouseout: onHoverEnd,
      }}
    >
      <Tooltip
        direction="top"
        offset={[0, -10]}
        className="vietnam-map-tooltip"
      >
        <span style={{ fontWeight: 600, fontSize: '13px' }}>
          {isArchipelago && '🇻🇳 '}{place.name}
        </span>
      </Tooltip>

      <Popup
        maxWidth={260}
        minWidth={220}
        closeButton={true}
        className="vietnam-map-popup"
      >
        <div style={popupStyles.container}>
          <div style={popupStyles.header}>
            <span style={popupStyles.icon}>{place.icon}</span>
            <div>
              <span style={popupStyles.name}>
                {isArchipelago && '🇻🇳 '}{place.name}
              </span>
              {isArchipelago && (
                <div style={{ fontSize: '10px', color: '#dc2626', fontWeight: 600, marginTop: 2 }}>
                  Thuộc chủ quyền Việt Nam
                </div>
              )}
            </div>
          </div>

          <div style={popupStyles.badgeRow}>
            <span
              style={{
                ...popupStyles.badge,
                backgroundColor: `${regionColor}12`,
                color: regionColor,
                borderColor: `${regionColor}30`,
              }}
            >
              {TYPE_LABELS[place.type] || place.type}
            </span>
          </div>

          <p style={popupStyles.description}>{place.shortDescription}</p>

          <button
            style={{
              ...popupStyles.button,
              backgroundColor: regionColor,
            }}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(place.slug)
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.85'
              ;(e.currentTarget as HTMLButtonElement).style.transform =
                'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
              ;(e.currentTarget as HTMLButtonElement).style.transform =
                'translateY(0)'
            }}
          >
            Khám phá →
          </button>
        </div>
      </Popup>
    </Marker>
  )
}

// ─── Popup Styles ─────────────────────────────────────────────────────────────

const popupStyles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily:
      "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '4px 0',
    color: '#1e293b',
    background: 'transparent',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  icon: {
    fontSize: '22px',
    lineHeight: 1,
  },
  name: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.01em',
    display: 'block',
  },
  badgeRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '10px',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '9999px',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    border: '1px solid',
  },
  description: {
    fontSize: '13px',
    lineHeight: 1.55,
    color: '#475569',
    margin: '0 0 14px 0',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '8px 0',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s ease',
  },
}

// ─── CSS Overrides ────────────────────────────────────────────────────────────

function useLeafletStyles() {
  useEffect(() => {
    const styleId = 'vietnam-map-light-styles'
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* ── Custom marker base ── */
      .vietnam-place-marker {
        background: transparent !important;
        border: none !important;
      }

      /* ── Sovereignty label base ── */
      .vietnam-sovereignty-label {
        background: transparent !important;
        border: none !important;
      }

      /* ── Flag marker base ── */
      .vietnam-flag-marker {
        background: transparent !important;
        border: none !important;
      }

      /* ── Pulse animation for place markers ── */
      @keyframes vietnamPulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.3); opacity: 0; }
      }

      /* ── Flag pulse animation ── */
      @keyframes vietnamFlagPulse {
        0%, 100% { transform: scale(1); box-shadow: 0 0 12px rgba(220, 38, 38, 0.5), 0 0 24px rgba(220, 38, 38, 0.2); }
        50% { transform: scale(1.06); box-shadow: 0 0 20px rgba(220, 38, 38, 0.7), 0 0 40px rgba(220, 38, 38, 0.3); }
      }

      /* ── Popup overrides — light theme ── */
      .vietnam-map-popup .leaflet-popup-content-wrapper {
        background: #ffffff;
        color: #1e293b;
        border-radius: 14px;
        border: 1px solid rgba(0, 0, 0, 0.06);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
        padding: 4px;
      }
      .vietnam-map-popup .leaflet-popup-content {
        margin: 14px 16px;
        line-height: 1.5;
      }
      .vietnam-map-popup .leaflet-popup-tip {
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-top: none;
        border-right: none;
        box-shadow: none;
      }
      .vietnam-map-popup .leaflet-popup-close-button {
        color: #94a3b8 !important;
        font-size: 20px !important;
        padding: 6px 8px 0 0 !important;
        transition: color 0.15s ease;
      }
      .vietnam-map-popup .leaflet-popup-close-button:hover {
        color: #334155 !important;
      }

      /* ── Tooltip overrides — light theme ── */
      .vietnam-map-tooltip {
        background: #ffffff !important;
        color: #1e293b !important;
        border: 1px solid rgba(0, 0, 0, 0.06) !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
        padding: 4px 10px !important;
        font-size: 13px !important;
      }
      .vietnam-map-tooltip::before {
        border-top-color: #ffffff !important;
      }

      /* ── Leaflet controls light theme ── */
      .leaflet-control-zoom a {
        background-color: #ffffff !important;
        color: #475569 !important;
        border-color: rgba(0, 0, 0, 0.06) !important;
        transition: all 0.15s ease;
      }
      .leaflet-control-zoom a:hover {
        background-color: #f8fafc !important;
        color: #0f172a !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      const el = document.getElementById(styleId)
      if (el) el.remove()
    }
  }, [])
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function VietnamInteractiveMap({
  onSelectPlace,
  selectedSlug,
  regionFilter = 'all',
}: VietnamInteractiveMapProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  useLeafletStyles()

  const visiblePlaces = vietnamAtlas.filter(
    (place) => regionFilter === 'all' || place.region === regionFilter
  )

  const handleMapClick = useCallback(() => {}, [])

  // Defensive check: ensure no visible place has a blacklisted name
  const safePlaces = visiblePlaces.filter((place) => {
    if (isLabelBlacklisted(place.name)) {
      console.warn(
        `[VietnamMapSanitizer] Blocked blacklisted place name: "${place.name}"`
      )
      return false
    }
    return true
  })

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-lg"
      style={{ height: 'min(70vh, 600px)', minHeight: '350px', touchAction: 'pan-y pinch-zoom' }}
    >
      <MapContainer
        center={VIETNAM_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={5}
        maxZoom={11}
        maxBounds={VIETNAM_MAX_BOUNDS}
        maxBoundsViscosity={1}
        worldCopyJump={false}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={false}
      >
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            TILE LAYER: CartoDB LIGHT_NOLABELS
            This tile layer shows land/sea shapes but contains ZERO text labels.
            ALL place names are rendered from our controlled local dataset.
            This prevents "Yongle Qundao", "Sansha", "South China Sea",
            "Kalayaan", Chinese characters, and other foreign disputed-place
            labels from appearing on the map.
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />

        {/* ── Sovereignty Labels (from our controlled dataset) ── */}
        {SOVEREIGNTY_LABELS.map((label, i) => {
          if (isLabelBlacklisted(label.text)) return null

          const isPrimary = label.style === 'primary'
          const isSea = label.style === 'sea'
          const isSecondary = label.style === 'secondary'

          return (
            <Marker
              key={`sovereignty-${i}`}
              position={label.position}
              icon={L.divIcon({
                html: `<div style="
                  background: ${
                    isPrimary
                      ? 'rgba(255, 255, 255, 0.92)'
                      : isSea
                      ? 'rgba(255, 255, 255, 0.78)'
                      : 'rgba(255, 255, 255, 0.78)'
                  };
                  color: ${isPrimary ? '#b91c1c' : isSea ? '#1d4ed8' : '#475569'};
                  font-size: ${isPrimary ? '12px' : isSea ? '15px' : '12px'};
                  font-weight: ${isPrimary ? '700' : isSea ? '800' : '600'};
                  padding: ${isPrimary ? '3px 8px' : isSea ? '3px 14px' : '3px 9px'};
                  border-radius: 999px;
                  white-space: nowrap;
                  text-align: center;
                  border: ${isPrimary ? '1px solid rgba(220, 38, 38, 0.28)' : isSea ? '1px solid rgba(59, 130, 246, 0.24)' : '1px solid rgba(100,116,139,0.22)'};
                  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.12);
                  font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
                  letter-spacing: ${isSea ? '0.12em' : '0.02em'};
                  line-height: 1.4;
                  cursor: ${label.isClickable ? 'pointer' : 'default'};
                ">${label.text}</div>`,
                className: 'vietnam-sovereignty-label',
                iconSize: [0, 0],
                iconAnchor: [0, 0],
              })}
              interactive={!!label.isClickable}
              keyboard={false}
              {...(label.isClickable && label.slug
                ? {
                    eventHandlers: {
                      click: () => onSelectPlace(label.slug!),
                    },
                  }
                : {})}
            />
          )
        })}

        {/* Programmatic map controls */}
        <MapController selectedSlug={selectedSlug} />
        <MapEventHandler onMapClick={handleMapClick} />

        {/* Render markers for each visible place */}
        {safePlaces.map((place) => (
          <PlaceMarker
            key={place.slug}
            place={place}
            isSelected={selectedSlug === place.slug}
            isHovered={hoveredSlug === place.slug}
            onHover={() => setHoveredSlug(place.slug)}
            onHoverEnd={() => setHoveredSlug(null)}
            onSelect={onSelectPlace}
          />
        ))}
      </MapContainer>

      {/* Region legend overlay */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-[1000]">
        <div className="pointer-events-auto rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur-md">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(REGION_COLORS).map(([region, color]) => {
              const labels: Record<string, string> = {
                north: 'Bắc Bộ',
                central: 'Trung Bộ',
                south: 'Nam Bộ',
                highlands: 'Tây Nguyên',
                islands: 'Quần đảo',
              }
              const regionKey = region as RegionType
              return (
                <div key={region} className="flex items-center gap-1.5">
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
                    style={{
                      background: `${color}12`,
                      border: `1.5px solid ${color}`,
                    }}
                  >
                    {REGION_ICONS[regionKey]}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {labels[region]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Place count overlay */}
      <div className="pointer-events-none absolute right-4 top-4 z-[1000]">
        <div className="rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur-md">
          <span className="text-[11px] text-slate-400">
            {safePlaces.length} địa điểm
          </span>
        </div>
      </div>

      {/* Sovereignty notice */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-[1000]">
        <div className="rounded-lg border border-red-100 bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur-md">
          <span className="text-[10px] font-medium text-red-500">
            🇻🇳 Bản đồ sử dụng nhãn từ nguồn nội bộ
          </span>
        </div>
      </div>
    </div>
  )
}
