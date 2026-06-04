'use client'

/**
 * VietnamInteractiveMap.tsx — Interactive Leaflet map for P-ShareHub's Vietnam Atlas
 *
 * Features:
 * - CartoDB dark_matter tile layer for premium dark aesthetic
 * - CircleMarker for each place in vietnamAtlas, color-coded by region
 * - Styled popups with place info and "Khám phá" action button
 * - Hover tooltips showing place names
 * - Auto-fit Vietnam bounds on load, pan/zoom on selection
 * - Region filter support
 * - Responsive container (500px desktop, 350px mobile)
 * - Custom dark-themed popup styling
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import L from 'leaflet'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { vietnamAtlas, type RegionType, type VietnamPlace } from '@/data/vietnamAtlas'

// ─── Leaflet CSS & Icon Fix ──────────────────────────────────────────────────
// Leaflet requires its CSS for proper rendering
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue with webpack/next.js
// Even though we use CircleMarker (no icons), this prevents runtime errors
delete (L.Icon.Default.prototype as any)._getIconUrl

// ─── Constants ────────────────────────────────────────────────────────────────

/** Center of Vietnam for initial map view */
const VIETNAM_CENTER: [number, number] = [14.0583, 108.2772]

/** Vietnam's approximate geographic bounds: [[south, west], [north, east]] */
const VIETNAM_BOUNDS: L.LatLngBoundsExpression = [
  [8.5, 102],
  [23.5, 112],
]

/** Region color map — each region gets a distinctive color */
const REGION_COLORS: Record<RegionType, string> = {
  north: '#3b82f6',    // Blue
  central: '#f59e0b',  // Amber
  south: '#10b981',    // Emerald
  highlands: '#8b5cf6', // Violet
  islands: '#ef4444',  // Red
}

/** Type badge labels in Vietnamese */
const TYPE_LABELS: Record<string, string> = {
  city: 'Thành phố',
  province: 'Tỉnh',
  archipelago: 'Quần đảo',
}

/** Default zoom level for the initial view */
const DEFAULT_ZOOM = 6

/** Zoom level when a place is selected */
const SELECTED_ZOOM = 10

// ─── Props Interface ─────────────────────────────────────────────────────────

interface VietnamInteractiveMapProps {
  /** Callback when user clicks "Khám phá" in a popup */
  onSelectPlace: (slug: string) => void
  /** Currently selected place slug — map will pan/zoom to it */
  selectedSlug?: string
  /** Filter places by region, or show all */
  regionFilter?: RegionType | 'all'
}

// ─── Map Controller (handles programmatic map movements) ─────────────────────

/**
 * MapController — a component that hooks into the Leaflet map instance
 * to perform programmatic actions like fitBounds and flyTo.
 */
function MapController({
  selectedSlug,
}: {
  selectedSlug?: string
}) {
  const map = useMap()
  const hasFittedBounds = useRef(false)

  // Fit Vietnam bounds on initial load
  useEffect(() => {
    if (!hasFittedBounds.current) {
      map.fitBounds(VIETNAM_BOUNDS, { padding: [30, 30] })
      hasFittedBounds.current = true
    }
  }, [map])

  // Pan/zoom to selected place
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

// ─── Map Event Handler (for click-outside-to-deselect) ───────────────────────

function MapEventHandler({
  onMapClick,
}: {
  onMapClick: () => void
}) {
  useMapEvents({
    click() {
      onMapClick()
    },
  })
  return null
}

// ─── Place Marker Component ──────────────────────────────────────────────────

/**
 * PlaceMarker — renders a single CircleMarker for a VietnamPlace
 * with hover effects, tooltip, and styled popup.
 */
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

  // Marker size: larger on hover or when selected
  const radius = isSelected ? 12 : isHovered ? 10 : 6
  const fillOpacity = isHovered || isSelected ? 1.0 : 0.7

  return (
    <CircleMarker
      center={place.coordinates}
      radius={radius}
      pathOptions={{
        color: regionColor,
        fillColor: regionColor,
        fillOpacity,
        weight: 1,
        opacity: 0.5,
        className: 'transition-all duration-200',
      }}
      eventHandlers={{
        mouseover: onHover,
        mouseout: onHoverEnd,
      }}
    >
      {/* Tooltip on hover — shows place name */}
      <Tooltip
        direction="top"
        offset={[0, -10]}
        className="vietnam-map-tooltip"
      >
        <span style={{ fontWeight: 600, fontSize: '13px' }}>
          {place.icon} {place.name}
        </span>
      </Tooltip>

      {/* Popup on click — styled place info card */}
      <Popup
        maxWidth={260}
        minWidth={220}
        closeButton={true}
        className="vietnam-map-popup"
      >
        <div style={popupStyles.container}>
          {/* Header: icon + name */}
          <div style={popupStyles.header}>
            <span style={popupStyles.icon}>{place.icon}</span>
            <span style={popupStyles.name}>{place.name}</span>
          </div>

          {/* Type badge */}
          <div style={popupStyles.badgeRow}>
            <span
              style={{
                ...popupStyles.badge,
                backgroundColor: `${regionColor}22`,
                color: regionColor,
                borderColor: `${regionColor}44`,
              }}
            >
              {TYPE_LABELS[place.type] || place.type}
            </span>
          </div>

          {/* Description */}
          <p style={popupStyles.description}>{place.shortDescription}</p>

          {/* Action button */}
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
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }}
          >
            Khám phá →
          </button>
        </div>
      </Popup>
    </CircleMarker>
  )
}

// ─── Popup Inline Styles (dark theme) ────────────────────────────────────────

const popupStyles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily:
      "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '4px 0',
    color: '#e2e8f0',
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
    color: '#f1f5f9',
    letterSpacing: '-0.01em',
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
    color: '#94a3b8',
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

// ─── Global CSS Overrides for Leaflet Popups ──────────────────────────────────

/**
 * Injects a <style> tag to override Leaflet's default popup and tooltip
 * styles to match P-ShareHub's dark premium aesthetic.
 * This runs once on mount.
 */
function useLeafletDarkStyles() {
  useEffect(() => {
    const styleId = 'vietnam-map-dark-styles'
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      /* ── Popup overrides ── */
      .vietnam-map-popup .leaflet-popup-content-wrapper {
        background: #1e1e2e;
        color: #e2e8f0;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3);
        padding: 4px;
      }
      .vietnam-map-popup .leaflet-popup-content {
        margin: 14px 16px;
        line-height: 1.5;
      }
      .vietnam-map-popup .leaflet-popup-tip {
        background: #1e1e2e;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-top: none;
        border-right: none;
        box-shadow: none;
      }
      .vietnam-map-popup .leaflet-popup-close-button {
        color: #64748b !important;
        font-size: 20px !important;
        padding: 6px 8px 0 0 !important;
        transition: color 0.15s ease;
      }
      .vietnam-map-popup .leaflet-popup-close-button:hover {
        color: #e2e8f0 !important;
      }

      /* ── Tooltip overrides ── */
      .vietnam-map-tooltip {
        background: #1a1a2e !important;
        color: #e2e8f0 !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
        padding: 4px 10px !important;
        font-size: 13px !important;
      }
      .vietnam-map-tooltip::before {
        border-top-color: #1a1a2e !important;
      }

      /* ── Leaflet controls dark theme ── */
      .leaflet-control-zoom a {
        background-color: #1e1e2e !important;
        color: #94a3b8 !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
        transition: all 0.15s ease;
      }
      .leaflet-control-zoom a:hover {
        background-color: #2a2a3e !important;
        color: #e2e8f0 !important;
      }
      .leaflet-control-attribution {
        background: rgba(15, 15, 25, 0.7) !important;
        color: #475569 !important;
        font-size: 10px !important;
        border-radius: 4px 0 0 0;
      }
      .leaflet-control-attribution a {
        color: #64748b !important;
      }
      .leaflet-control-attribution a:hover {
        color: #94a3b8 !important;
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
  // Track which marker is being hovered
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  // Inject dark theme CSS overrides for Leaflet
  useLeafletDarkStyles()

  // Filter places by region if a filter is applied
  const visiblePlaces = vietnamAtlas.filter(
    (place) => regionFilter === 'all' || place.region === regionFilter
  )

  // Handle map click (deselect)
  const handleMapClick = useCallback(() => {
    // Could call a parent deselect handler here if needed
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06] min-h-[350px] md:min-h-[500px]" style={{ height: 'min(70vh, 600px)' }}>
      <MapContainer
        center={VIETNAM_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        {/* CartoDB dark_matter tile layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Programmatic map controls */}
        <MapController selectedSlug={selectedSlug} />
        <MapEventHandler onMapClick={handleMapClick} />

        {/* Render markers for each visible place */}
        {visiblePlaces.map((place) => (
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
        <div className="pointer-events-auto rounded-xl border border-white/[0.06] bg-black/70 px-3 py-2 backdrop-blur-md">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(REGION_COLORS).map(([region, color]) => {
              const labels: Record<string, string> = {
                north: 'Bắc Bộ',
                central: 'Trung Bộ',
                south: 'Nam Bộ',
                highlands: 'Tây Nguyên',
                islands: 'Quần đảo',
              }
              return (
                <div key={region} className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[11px] text-white/50">
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
        <div className="rounded-lg border border-white/[0.06] bg-black/70 px-2.5 py-1.5 backdrop-blur-md">
          <span className="text-[11px] text-white/40">
            {visiblePlaces.length} địa điểm
          </span>
        </div>
      </div>
    </div>
  )
}
