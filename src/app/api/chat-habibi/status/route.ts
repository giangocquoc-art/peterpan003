import { db } from '@/lib/db'

export async function GET() {
  const config = await (db as any).aiConfig.findUnique({ where: { id: 'default' } }).catch(() => null)

  return Response.json({
    connected: Boolean(config?.apiKey || process.env.ZAI_API_KEY || process.env.OPENAI_API_KEY),
    provider: config?.provider || 'zai',
    model: config?.model || null,
    language: config?.language || 'vi',
    languageLabel: 'Tiếng Việt',
    note: 'Habibi đang được cấu hình prompt trả lời bằng tiếng Việt.',
  })
}
