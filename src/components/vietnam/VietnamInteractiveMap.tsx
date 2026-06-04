'use client'

/**
 * VietnamInteractiveMap.tsx — Interactive Leaflet map for P-ShareHub's Vietnam Atlas
 *
 * Features:
 * - CartoDB Voyager tile layer (bright, clean labels) for easy readability
 * - Vietnamese sovereignty overlay labels (Quần đảo Hoàng Sa, Quần đảo Trường Sa, Biển Đông)
 * - Vietnamese flag markers at Hoàng Sa and Trường Sa
 * - Custom DivIcon markers with emoji icons for each place, color-coded by region
 * - Styled popups with place info and "Khám phá" action button
 * - Hover tooltips showing place names
 * - Auto-fit Vietnam bounds on load, pan/zoom on selection
 * - Region filter support
 * - Responsive container (500px desktop, 350px mobile)
 * - Custom light-themed popup styling matching Voyager tile layer
 * - Attribution hidden for cleaner map appearance
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

// ─── Leaflet CSS & Icon Fix ──────────────────────────────────────────────────
// Leaflet requires its CSS for proper rendering
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue with webpack/next.js
delete (L.Icon.Default.prototype as any)._getIconUrl

// ─── Constants ────────────────────────────────────────────────────────────────

/** Center of Vietnam for initial map view */
const VIETNAM_CENTER: [number, number] = [14.0583, 108.2772]

/** Vietnam's approximate geographic bounds: [[south, west], [north, east]]
 *  Extended to include Hoàng Sa and Trường Sa archipelagos
 */
const VIETNAM_BOUNDS: L.LatLngBoundsExpression = [
  [6.0, 102],
  [23.5, 117],
]

/** Region color map — each region gets a distinctive color (stronger for light map background) */
const REGION_COLORS: Record<RegionType, string> = {
  north: '#2563eb',     // Blue — stronger
  central: '#d97706',   // Amber — stronger
  south: '#059669',     // Emerald — stronger
  highlands: '#7c3aed', // Violet — stronger
  islands: '#dc2626',   // Red — stronger for sovereignty
}

/** Region emoji icons for legend */
const REGION_ICONS: Record<RegionType, string> = {
  north: '🏔️',
  central: '🏯',
  south: '🛶',
  highlands: '🌿',
  islands: '🏝️',
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

// ─── Custom DivIcon Factory ──────────────────────────────────────────────────

/**
 * createPlaceIcon — creates a custom L.divIcon with an emoji badge
 * for a given place, adapting size based on selection/hover state.
 */
function createPlaceIcon(place: VietnamPlace, isSelected: boolean, isHovered: boolean) {
  const size = isSelected ? 40 : isHovered ? 36 : 28
  const regionColor = REGION_COLORS[place.region]

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
          background: ${regionColor}33;
          animation: vietnamPulse 2s ease-in-out infinite;
        "></div>
      ` : ''}
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${regionColor}22;
        border: 2px solid ${regionColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? 20 : isHovered ? 18 : 14}px;
        line-height: 1;
        box-shadow: 0 0 ${isSelected ? 16 : 8}px ${regionColor}66;
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

/**
 * PlaceMarker — renders a custom DivIcon Marker for a VietnamPlace
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

  // Memoize icon creation to avoid re-creating on every render
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
      {/* Tooltip on hover — shows place name */}
      <Tooltip
        direction="top"
        offset={[0, -10]}
        className="vietnam-map-tooltip"
      >
        <span style={{ fontWeight: 600, fontSize: '13px' }}>
          {place.name}
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
    </Marker>
  )
}

// ─── Popup Inline Styles (light theme for Voyager tile layer) ────────────────

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

// ─── Global CSS Overrides for Leaflet Popups ──────────────────────────────────

/**
 * Injects a <style> tag to override Leaflet's default popup and tooltip
 * styles to match P-ShareHub's light theme (Voyager tile layer).
 * This runs once on mount.
 */
function useLeafletDarkStyles() {
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
        0%, 100% { transform: scale(1); box-shadow: 0 0 16px rgba(220, 38, 38, 0.6), 0 0 32px rgba(220, 38, 38, 0.3); }
        50% { transform: scale(1.08); box-shadow: 0 0 24px rgba(220, 38, 38, 0.8), 0 0 48px rgba(220, 38, 38, 0.4); }
      }

      /* ── Popup overrides — light theme ── */
      .vietnam-map-popup .leaflet-popup-content-wrapper {
        background: #ffffff;
        color: #1e293b;
        border-radius: 14px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
        padding: 4px;
      }
      .vietnam-map-popup .leaflet-popup-content {
        margin: 14px 16px;
        line-height: 1.5;
      }
      .vietnam-map-popup .leaflet-popup-tip {
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.08);
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
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
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
        border-color: rgba(0, 0, 0, 0.1) !important;
        transition: all 0.15s ease;
      }
      .leaflet-control-zoom a:hover {
        background-color: #f1f5f9 !important;
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
        attributionControl={false}
      >
        {/* CartoDB Voyager tile layer — bright, clean labels */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* ── Vietnamese Sovereignty Overlay Labels ── */}
        {/* These are PERMANENT, NON-INTERACTIVE labels that assert Vietnamese sovereignty */}
        <Marker
          position={[16.5, 112.0]}
          icon={L.divIcon({
            html: `<div style="
              background: rgba(0, 0, 0, 0.72);
              color: #ffffff;
              font-size: 15px;
              font-weight: 700;
              padding: 5px 12px;
              border-radius: 6px;
              white-space: nowrap;
              text-align: center;
              border: 2px solid #dc2626;
              box-shadow: 0 2px 12px rgba(220, 38, 38, 0.4);
              font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
              letter-spacing: 0.02em;
              line-height: 1.4;
            ">🇻🇳 Quần đảo Hoàng Sa</div>`,
            className: 'vietnam-sovereignty-label',
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })}
          interactive={false}
          keyboard={false}
        />
        <Marker
          position={[10.0, 114.0]}
          icon={L.divIcon({
            html: `<div style="
              background: rgba(0, 0, 0, 0.72);
              color: #ffffff;
              font-size: 15px;
              font-weight: 700;
              padding: 5px 12px;
              border-radius: 6px;
              white-space: nowrap;
              text-align: center;
              border: 2px solid #dc2626;
              box-shadow: 0 2px 12px rgba(220, 38, 38, 0.4);
              font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
              letter-spacing: 0.02em;
              line-height: 1.4;
            ">🇻🇳 Quần đảo Trường Sa</div>`,
            className: 'vietnam-sovereignty-label',
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })}
          interactive={false}
          keyboard={false}
        />
        <Marker
          position={[12.0, 113.0]}
          icon={L.divIcon({
            html: `<div style="
              background: rgba(0, 0, 0, 0.6);
              color: #ffffff;
              font-size: 16px;
              font-weight: 700;
              padding: 4px 14px;
              border-radius: 6px;
              white-space: nowrap;
              text-align: center;
              border: 1.5px solid rgba(255, 255, 255, 0.3);
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
              font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
              letter-spacing: 0.04em;
              line-height: 1.4;
            ">Biển Đông</div>`,
            className: 'vietnam-sovereignty-label',
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          })}
          interactive={false}
          keyboard={false}
        />

        {/* ── Vietnamese Flag Markers at Hoàng Sa & Trường Sa ── */}
        <Marker
          position={[16.5, 112.0]}
          icon={L.divIcon({
            html: `<div style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
              border: 3px solid #dc2626;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              line-height: 1;
              box-shadow: 0 0 16px rgba(220, 38, 38, 0.6), 0 0 32px rgba(220, 38, 38, 0.3);
              animation: vietnamFlagPulse 3s ease-in-out infinite;
            ">🇻🇳</div>`,
            className: 'vietnam-flag-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          })}
          interactive={false}
          keyboard={false}
        />
        <Marker
          position={[10.0, 114.0]}
          icon={L.divIcon({
            html: `<div style="
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
              border: 3px solid #dc2626;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              line-height: 1;
              box-shadow: 0 0 16px rgba(220, 38, 38, 0.6), 0 0 32px rgba(220, 38, 38, 0.3);
              animation: vietnamFlagPulse 3s ease-in-out infinite;
            ">🇻🇳</div>`,
            className: 'vietnam-flag-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          })}
          interactive={false}
          keyboard={false}
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

      {/* Region legend overlay — light theme */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-[1000]">
        <div className="pointer-events-auto rounded-xl border border-black/[0.08] bg-white/90 px-3 py-2 shadow-md backdrop-blur-md">
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
                      background: `${color}18`,
                      border: `1.5px solid ${color}`,
                      boxShadow: `0 0 4px ${color}33`,
                    }}
                  >
                    {REGION_ICONS[regionKey]}
                  </span>
                  <span className="text-[11px] text-slate-600">
                    {labels[region]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Place count overlay — light theme */}
      <div className="pointer-events-none absolute right-4 top-4 z-[1000]">
        <div className="rounded-lg border border-black/[0.08] bg-white/90 px-2.5 py-1.5 shadow-md backdrop-blur-md">
          <span className="text-[11px] text-slate-500">
            {visiblePlaces.length} địa điểm
          </span>
        </div>
      </div>
    </div>
  )
}
