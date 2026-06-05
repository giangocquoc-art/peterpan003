import { NextRequest } from 'next/server'
import { consumePasswordResetToken, hashPassword } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    if (!token || !password || String(password).length < 8) {
      return Response.json({ error: 'Token hoặc mật khẩu không hợp lệ.' }, { status: 400 })
    }

    const userId = await consumePasswordResetToken(String(token))
    if (!userId) return Response.json({ error: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.' }, { status: 400 })

    await (db as any).user.update({ where: { id: userId }, data: { passwordHash: hashPassword(String(password)) } })
    await (db as any).session.deleteMany({ where: { userId } })

    return Response.json({ ok: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return Response.json({ error: 'Không thể đặt lại mật khẩu.' }, { status: 500 })
  }
}
