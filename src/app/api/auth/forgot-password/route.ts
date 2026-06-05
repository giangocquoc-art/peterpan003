import { NextRequest } from 'next/server'
import { createPasswordResetToken, resetPasswordEmail, sendAuthEmail } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const user = await (db as any).user.findUnique({ where: { email: normalizedEmail } })

    if (user) {
      const token = await createPasswordResetToken(user.id)
      const emailBody = resetPasswordEmail(normalizedEmail, token)
      await sendAuthEmail(normalizedEmail, emailBody.subject, emailBody.html)
    }

    return Response.json({ ok: true, message: 'Nếu email tồn tại, hệ thống đã gửi liên kết đặt lại mật khẩu.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return Response.json({ error: 'Không thể xử lý yêu cầu quên mật khẩu.' }, { status: 500 })
  }
}
