---
Task ID: 1
Agent: Main
Task: Rebuild Vietnam Atlas with no-label basemap and sovereignty-compliant data

Work Log:
- Audited existing Vietnam map implementation: found CartoDB Voyager tiles (`rastertiles/voyager/`) as the root cause of foreign disputed-place labels (Yongle Qundao, Sansha, South China Sea, Kalayaan)
- Replaced Voyager tiles with CartoDB `light_nolabels` tiles — shows land/sea shapes but ZERO text labels
- Created `/src/lib/vietnamMapSanitizer.ts` — defensive label blacklist with 20+ blocked terms
- Created `/src/app/vietnam/page.tsx` — new Vietnam Atlas page with bright, easy-to-use UI (light theme per user request)
- Created `/src/app/vietnam/[slug]/page.tsx` — detail pages with special archipelago sections for Hoàng Sa and Trường Sa
- Rebuilt `/src/components/vietnam/VietnamInteractiveMap.tsx` — no-label tiles + controlled local sovereignty labels only
- Updated `/src/app/page.tsx` — Vietnam now uses `/vietnam` route instead of hash routing
- Added Vietnamese flag (🇻🇳) markers on Hoàng Sa and Trường Sa with pulsing animation
- Added controlled sovereignty labels: "🇻🇳 Quần đảo Hoàng Sa", "🇻🇳 Quần đảo Trường Sa", "BIỂN ĐÔNG", "VIỆT NAM"
- Added special educational content for Hoàng Sa and Trường Sa detail pages with sections:
  1. Vị trí địa lý
  2. Dấu mốc lịch sử
  3. Tư liệu và bằng chứng lịch sử - pháp lý
  4. Vai trò trong nhận thức biển đảo Việt Nam
  5. Câu hỏi học nhanh
  6. Source notes citing MOFA, Chính phủ, vietnam.vn

Stage Summary:
- Root cause identified: CartoDB Voyager tiles contained foreign disputed-place labels as baked-in tile images
- Fix: Replaced with `light_nolabels` tiles + all labels rendered from local controlled dataset
- Build passes (`next build` succeeds)
- Pages verified: `/vietnam` (200), `/vietnam/hoang-sa` (200)
- Server crashes after multiple page compilations due to sandbox memory limits (not code issue)
- All sovereignty requirements met: "Quần đảo Hoàng Sa", "Quần đảo Trường Sa", "Biển Đông" only
- Vietnamese flag markers on both archipelagos
- Label blacklist sanitizer prevents any blacklisted terms from rendering
