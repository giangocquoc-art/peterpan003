import { NextRequest } from 'next/server'
import { consumeVerificationToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return Response.redirect(new URL('/habibi?verified=missing', req.url))

  const userId = await consumeVerificationToken(token)
  const status = userId ? 'success' : 'failed'
  return Response.redirect(new URL(`/habibi?verified=${status}`, req.url))
}
