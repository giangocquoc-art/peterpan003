/**
 * vietnamMapSanitizer.ts — Defensive label blacklist for Vietnam Atlas
 *
 * This module provides a sanitation layer to prevent rendering of
 * politically incorrect or disputed-place labels on the Vietnam map.
 *
 * Any external feature name or label containing these terms must NOT be rendered.
 * This is a safety net in case any external data source leaks through.
 *
 * Sources:
 * - Bộ Ngoại giao Việt Nam (mofa.gov.vn)
 * - Cổng thông tin Chính phủ (chinhphu.vn)
 * - Cổng thông tin quốc gia (vietnam.vn)
 */

/** Blacklisted terms — if ANY label contains these, it must be blocked */
export const LABEL_BLACKLIST: string[] = [
  // Chinese names for Hoàng Sa / Trường Sa / disputed areas
  'Sansha',
  'Yongle',
  'Yongle Qundao',
  'Qilianyu',
  'Qilian Yu',
  'Xisha',
  'Nansha',
  'Zhongsha',
  'Dongsha',
  'Kalayaan',
  'West Philippine Sea',

  // Chinese characters for disputed areas
  '三沙',
  '西沙',
  '南沙',
  '中沙',
  '东沙',
  '永乐群岛',
  '七连屿',

  // International names that should be replaced with Vietnamese
  'South China Sea',
  'Paracel Islands',
  'Spratly Islands',
]

/**
 * Check if a label contains any blacklisted term (case-insensitive)
 * Returns true if the label should be BLOCKED
 */
export function isLabelBlacklisted(label: string): boolean {
  const lowerLabel = label.toLowerCase()
  return LABEL_BLACKLIST.some((term) => lowerLabel.includes(term.toLowerCase()))
}

/**
 * Sanitize a label — returns null if blocked, otherwise returns the original label
 */
export function sanitizeLabel(label: string): string | null {
  if (isLabelBlacklisted(label)) return null
  return label
}

/**
 * Map of foreign names to their correct Vietnamese replacements
 * Used for bilingual display where appropriate
 */
export const LABEL_REPLACEMENTS: Record<string, string> = {
  'South China Sea': 'Biển Đông',
  'Paracel Islands': 'Quần đảo Hoàng Sa',
  'Spratly Islands': 'Quần đảo Trường Sa',
  'Sansha': undefined as unknown as string, // Block entirely
  'Yongle Qundao': undefined as unknown as string, // Block entirely
  'Kalayaan': undefined as unknown as string, // Block entirely
}

/**
 * Allowed labels in the sea/island area — only these should be rendered
 * for the Biển Đông, Hoàng Sa, and Trường Sa regions
 */
export const ALLOWED_SEA_LABELS = [
  'Biển Đông',
  'Hoàng Sa',
  'Trường Sa',
  'Quần đảo Hoàng Sa',
  'Quần đảo Trường Sa',
  'Việt Nam',
] as const
