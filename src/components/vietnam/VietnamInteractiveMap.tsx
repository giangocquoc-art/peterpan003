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
  CircleMarker,
  Polyline,
  Polygon,
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
  // ── Biển Đông ──
  {
    position: [13.2, 113.0],
    text: 'BIỂN ĐÔNG',
    style: 'sea',
  },
  // ── Việt Nam label in the sea ──
  {
    position: [15.0, 109.65],
    text: 'VIỆT NAM',
    style: 'secondary',
  },
]

interface CountryBoundary {
  name: string
  positions: [number, number][]
  isVietnam?: boolean
}

interface ArchipelagoPoint {
  name: string
  position: [number, number]
  priority: 'key' | 'detail'
}

interface ArchipelagoCluster {
  slug: 'hoang-sa' | 'truong-sa'
  name: string
  secondaryName: string
  center: [number, number]
  labelPosition: [number, number]
  envelope: [number, number][]
  points: ArchipelagoPoint[]
}

const COUNTRY_BOUNDARIES: CountryBoundary[] = [
  {
    name: 'Việt Nam',
    isVietnam: true,
    positions: [
      [23.35, 105.3], [22.4, 106.7], [21.2, 107.3], [20.1, 106.8],
      [18.6, 106.1], [17.1, 107.0], [16.0, 108.2], [14.2, 109.1],
      [12.4, 109.2], [10.8, 107.0], [9.7, 106.4], [8.6, 104.9],
      [9.7, 104.6], [11.5, 106.0], [12.6, 107.3], [14.6, 107.6],
      [16.4, 106.5], [18.2, 105.5], [20.0, 104.9], [21.7, 104.2],
      [23.35, 105.3],
    ],
  },
  {
    name: 'Trung Quốc',
    positions: [[23.35, 105.3], [22.9, 106.3], [22.4, 107.1], [21.6, 108.0]],
  },
  {
    name: 'Lào',
    positions: [[22.4, 102.4], [20.2, 104.2], [18.0, 105.0], [16.4, 106.5], [14.6, 107.6]],
  },
  {
    name: 'Campuchia',
    positions: [[14.6, 107.6], [12.8, 107.3], [11.0, 106.1], [10.6, 104.8], [9.9, 104.6]],
  },
  {
    name: 'Thái Lan',
    positions: [[20.5, 100.8], [18.0, 101.2], [15.7, 102.1], [13.9, 102.6], [11.6, 102.9]],
  },
  {
    name: 'Philippines',
    positions: [[18.6, 120.0], [15.0, 120.0], [12.4, 121.0], [9.0, 122.0], [6.0, 121.5]],
  },
  {
    name: 'Malaysia',
    positions: [[7.2, 114.0], [5.5, 115.3], [3.8, 114.8]],
  },
]

const ARCHIPELAGO_CLUSTERS: ArchipelagoCluster[] = [
  {
    slug: 'hoang-sa',
    name: 'Quần đảo Hoàng Sa',
    secondaryName: 'Hoàng Sa / Paracel',
    center: [16.6, 112.3],
    labelPosition: [17.25, 112.78],
    envelope: [[17.35, 111.45], [17.35, 113.25], [16.0, 113.35], [15.65, 112.0], [16.15, 111.25]],
    points: [
      { name: 'Đảo Phú Lâm', position: [16.84, 112.34], priority: 'key' },
      { name: 'Đảo Cây', position: [16.97, 112.27], priority: 'key' },
      { name: 'Đảo Linh Côn', position: [16.66, 112.73], priority: 'key' },
      { name: 'Đảo Quang Hòa', position: [16.45, 111.72], priority: 'key' },
      { name: 'Đảo Tri Tôn', position: [15.79, 111.20], priority: 'key' },
      { name: 'Nhóm An Vĩnh', position: [16.95, 112.10], priority: 'detail' },
      { name: 'Nhóm Lưỡi Liềm', position: [16.50, 111.65], priority: 'detail' },
    ],
  },
  {
    slug: 'truong-sa',
    name: 'Quần đảo Trường Sa',
    secondaryName: 'Trường Sa / Spratly',
    center: [9.5, 114.3],
    labelPosition: [10.65, 116.25],
    envelope: [[12.0, 111.0], [12.0, 117.4], [8.6, 117.5], [6.0, 115.8], [6.2, 112.0], [9.2, 111.0]],
    points: [
      { name: 'Trường Sa Lớn', position: [8.64, 111.92], priority: 'key' },
      { name: 'Song Tử Tây', position: [11.43, 114.33], priority: 'key' },
      { name: 'Sinh Tồn', position: [9.89, 114.32], priority: 'key' },
      { name: 'Sơn Ca', position: [10.38, 114.48], priority: 'key' },
      { name: 'Nam Yết', position: [10.18, 114.37], priority: 'key' },
      { name: 'Phan Vinh', position: [8.97, 113.68], priority: 'key' },
      { name: 'Đá Tây', position: [8.86, 112.26], priority: 'detail' },
      { name: 'Đá Lát', position: [8.67, 111.67], priority: 'detail' },
      { name: 'Tốc Tan', position: [8.82, 114.02], priority: 'detail' },
      { name: 'Thuyền Chài', position: [8.17, 113.30], priority: 'detail' },
    ],
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

function useZoomLevel() {
  const map = useMap()
  const [zoom, setZoom] = useState(map.getZoom())

  useMapEvents({
    zoomend() {
      setZoom(map.getZoom())
    },
  })

  return zoom
}

function createArchipelagoLabelIcon(cluster: ArchipelagoCluster, zoom: number) {
  const compact = zoom <= 5
  return L.divIcon({
    html: `<div class="vietnam-archipelago-card ${compact ? 'compact' : ''}">
      <span class="flag">🇻🇳</span>
      <span class="label-main">${cluster.name}</span>
      <span class="label-sub">${cluster.secondaryName}</span>
    </div>`,
    className: 'vietnam-archipelago-label',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

function createIslandPointIcon(isKey: boolean, zoom: number) {
  const size = isKey ? (zoom >= 8 ? 10 : 8) : 7
  return L.divIcon({
    html: `<div class="vietnam-island-dot ${isKey ? 'key' : 'detail'}" style="width:${size}px;height:${size}px"></div>`,
    className: 'vietnam-island-point',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function CountryBoundaryLayer() {
  return (
    <>
      {COUNTRY_BOUNDARIES.map((boundary) => (
        <Polyline
          key={boundary.name}
          positions={boundary.positions}
          pathOptions={{
            color: boundary.isVietnam ? 'rgba(185, 28, 28, 0.62)' : 'rgba(15, 39, 71, 0.45)',
            weight: boundary.isVietnam ? 1.7 : 1,
            opacity: 0.92,
            dashArray: boundary.isVietnam ? undefined : '5 5',
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      ))}
    </>
  )
}

function ArchipelagoLayer({ onSelectPlace }: { onSelectPlace: (slug: string) => void }) {
  const zoom = useZoomLevel()
  const showEnvelope = zoom >= 6
  const showDetailPoints = zoom >= 8
  const showKeyPoints = zoom >= 6

  return (
    <>
      {ARCHIPELAGO_CLUSTERS.map((cluster) => {
        const visiblePoints = cluster.points.filter((point) =>
          showDetailPoints ? true : showKeyPoints && point.priority === 'key'
        )

        return (
          <div key={cluster.slug}>
            {showEnvelope && (
              <Polygon
                positions={cluster.envelope}
                pathOptions={{
                  color: 'rgba(220, 38, 38, 0.56)',
                  weight: 1.2,
                  opacity: 0.9,
                  fillColor: 'rgba(220, 38, 38, 0.06)',
                  fillOpacity: 1,
                  dashArray: '6 6',
                }}
              />
            )}

            {zoom <= 5 && (
              <CircleMarker
                center={cluster.center}
                radius={8}
                pathOptions={{
                  color: '#dc2626',
                  weight: 2,
                  fillColor: '#ffffff',
                  fillOpacity: 1,
                }}
                eventHandlers={{ click: () => onSelectPlace(cluster.slug) }}
              />
            )}

            {visiblePoints.map((point) => (
              <Marker
                key={`${cluster.slug}-${point.name}`}
                position={point.position}
                icon={createIslandPointIcon(point.priority === 'key', zoom)}
                eventHandlers={{ click: () => onSelectPlace(cluster.slug) }}
              >
                {zoom >= 8 && (
                  <Tooltip direction="top" offset={[0, -6]} className="vietnam-island-tooltip">
                    <span>{point.name}</span>
                  </Tooltip>
                )}
              </Marker>
            ))}

            {cluster.slug === 'truong-sa' && zoom >= 6 && (
              <Polyline
                positions={[cluster.labelPosition, cluster.center]}
                pathOptions={{ color: 'rgba(220, 38, 38, 0.38)', weight: 1, dashArray: '4 6' }}
              />
            )}

            <Marker
              position={cluster.labelPosition}
              icon={createArchipelagoLabelIcon(cluster, zoom)}
              interactive
              eventHandlers={{ click: () => onSelectPlace(cluster.slug) }}
            />
          </div>
        )
      })}
    </>
  )
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
      .vietnam-sovereignty-label,
      .vietnam-archipelago-label,
      .vietnam-island-point {
        background: transparent !important;
        border: none !important;
      }

      .vietnam-archipelago-card {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        background: rgba(255,255,255,0.88);
        border: 1px solid rgba(37,99,235,0.25);
        border-radius: 999px;
        box-shadow: 0 8px 24px rgba(15,39,71,0.12);
        backdrop-filter: blur(10px);
        padding: 5px 10px;
        color: #991b1b;
        font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
        cursor: pointer;
      }
      .vietnam-archipelago-card.compact {
        padding: 4px 9px;
      }
      .vietnam-archipelago-card .flag {
        font-size: 13px;
        line-height: 1;
      }
      .vietnam-archipelago-card .label-main {
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.01em;
      }
      .vietnam-archipelago-card .label-sub {
        color: rgba(100,116,139,0.75);
        font-size: 9px;
        font-weight: 600;
      }
      .vietnam-archipelago-card.compact .label-sub {
        display: none;
      }
      .vietnam-island-dot {
        border-radius: 999px;
        background: #ffffff;
        border: 2px solid #dc2626;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.92), 0 4px 12px rgba(220,38,38,0.32);
      }
      .vietnam-island-dot.detail {
        border-color: #f97316;
        box-shadow: 0 0 0 2px rgba(255,255,255,0.9), 0 3px 9px rgba(249,115,22,0.28);
      }
      .vietnam-island-tooltip {
        background: rgba(255,255,255,0.94) !important;
        color: #7f1d1d !important;
        border: 1px solid rgba(220,38,38,0.16) !important;
        border-radius: 999px !important;
        box-shadow: 0 6px 18px rgba(15,39,71,0.12) !important;
        padding: 3px 8px !important;
        font-size: 11px !important;
        font-weight: 700 !important;
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

        <CountryBoundaryLayer />
        <ArchipelagoLayer onSelectPlace={onSelectPlace} />

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
                  background: ${isSea ? 'transparent' : 'rgba(255, 255, 255, 0.78)'};
                  color: ${isSea ? 'rgba(37, 99, 235, 0.75)' : '#475569'};
                  font-size: ${isSea ? '17px' : '12px'};
                  font-weight: ${isSea ? '700' : '600'};
                  padding: ${isSea ? '0' : '3px 9px'};
                  border-radius: 999px;
                  white-space: nowrap;
                  text-align: center;
                  border: ${isSea ? 'none' : '1px solid rgba(100,116,139,0.22)'};
                  box-shadow: ${isSea ? 'none' : '0 2px 8px rgba(15, 23, 42, 0.12)'};
                  text-shadow: ${isSea ? '0 1px 8px rgba(255,255,255,0.7)' : 'none'};
                  font-family: 'Inter', 'Segoe UI', -apple-system, sans-serif;
                  letter-spacing: ${isSea ? '0.18em' : '0.02em'};
                  line-height: 1.4;
                  text-transform: ${isSea ? 'uppercase' : 'none'};
                  transform: ${isSea ? 'rotate(-16deg)' : 'none'};
                  opacity: ${isSea ? '0.86' : '1'};
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
        {safePlaces.filter((place) => !['hoang-sa', 'truong-sa'].includes(place.slug)).map((place) => (
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

      {/* Mini inset map */}
      <div className="pointer-events-none absolute bottom-14 right-4 z-[1000] hidden sm:block">
        <div className="rounded-xl border border-slate-200 bg-white/92 p-3 shadow-lg backdrop-blur-md">
          <div className="relative h-28 w-36 text-[9px] font-semibold text-slate-500">
            <div className="absolute left-8 top-3 h-20 w-8 rounded-full bg-red-100/80 shadow-inner" style={{ transform: 'rotate(18deg)' }} />
            <span className="absolute left-4 top-9 text-red-700">Việt Nam</span>
            <span className="absolute left-20 top-7 h-2 w-2 rounded-full border border-red-500 bg-white" />
            <span className="absolute left-24 top-5 text-red-600">Hoàng Sa</span>
            <span className="absolute left-24 top-16 h-2 w-2 rounded-full border border-red-500 bg-white" />
            <span className="absolute left-16 top-20 text-red-600">Trường Sa</span>
            <span className="absolute bottom-1 right-2 -rotate-12 text-[10px] tracking-[0.18em] text-blue-500/70">BIỂN ĐÔNG</span>
          </div>
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
