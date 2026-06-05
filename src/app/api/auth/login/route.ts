import { NextRequest } from 'next/server'
import { createSession, verifyPassword } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const user = await (db as any).user.findUnique({ where: { email: normalizedEmail } })

    if (!user?.passwordHash || !verifyPassword(String(password || ''), user.passwordHash)) {
      return Response.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 })
    }

    await createSession(user.id)
    return Response.json({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, emailVerified: user.emailVerified } })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Không thể đăng nhập lúc này.' }, { status: 500 })
  }
}
