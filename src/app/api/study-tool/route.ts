// Study Tool API route — DEPRECATED
// The Study Tool now runs 100% client-side using open-source algorithms.
// No AI, no server-side processing, no data storage.
// See: /src/lib/study-engine.ts and /src/components/study/StudyTool.tsx

import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  return new Response(
    JSON.stringify({
      deprecated: true,
      message: 'Study Tool now runs 100% client-side. This API route is no longer used.',
    }),
    {
      status: 410, // Gone
      headers: { 'Content-Type': 'application/json' },
    }
  )
}
