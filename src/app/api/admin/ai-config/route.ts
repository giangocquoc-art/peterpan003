import { NextRequest } from 'next/server'
import { getCurrentUser, isAdminUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const user = await getCurrentUser()
  if (!isAdminUser(user)) return Response.json({ error: 'Bạn không có quyền truy cập.' }, { status: 403 })

  const config = await (db as any).aiConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default', provider: 'zai', language: 'vi' },
  })

  return Response.json({
    config: {
      provider: config.provider,
      baseUrl: config.baseUrl || '',
      model: config.model || '',
      language: config.language || 'vi',
      hasApiKey: Boolean(config.apiKey),
      updatedAt: config.updatedAt,
    },
  })
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!isAdminUser(user)) return Response.json({ error: 'Bạn không có quyền truy cập.' }, { status: 403 })

  const body = await req.json()
  const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : undefined

  const config = await (db as any).aiConfig.upsert({
    where: { id: 'default' },
    update: {
      provider: String(body.provider || 'zai'),
      baseUrl: String(body.baseUrl || '').trim() || null,
      model: String(body.model || '').trim() || null,
      language: String(body.language || 'vi').trim() || 'vi',
      ...(apiKey ? { apiKey } : {}),
      updatedBy: user?.email,
    },
    create: {
      id: 'default',
      provider: String(body.provider || 'zai'),
      baseUrl: String(body.baseUrl || '').trim() || null,
      model: String(body.model || '').trim() || null,
      language: String(body.language || 'vi').trim() || 'vi',
      apiKey: apiKey || null,
      updatedBy: user?.email,
    },
  })

  return Response.json({
    ok: true,
    config: {
      provider: config.provider,
      baseUrl: config.baseUrl || '',
      model: config.model || '',
      language: config.language || 'vi',
      hasApiKey: Boolean(config.apiKey),
      updatedAt: config.updatedAt,
    },
  })
}
