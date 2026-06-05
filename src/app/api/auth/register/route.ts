import { NextRequest } from 'next/server'
import { ADMIN_EMAIL, createSession, createVerificationToken, hashPassword, sendAuthEmail, verificationEmail } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const cleanName = String(name || '').trim() || null

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return Response.json({ error: 'Email không hợp lệ.' }, { status: 400 })
    }
    if (!password || String(password).length < 8) {
      return Response.json({ error: 'Mật khẩu cần tối thiểu 8 ký tự.' }, { status: 400 })
    }

    const exists = await (db as any).user.findUnique({ where: { email: normalizedEmail } })
    if (exists) return Response.json({ error: 'Email này đã được đăng ký.' }, { status: 409 })

    const user = await (db as any).user.create({
      data: {
        email: normalizedEmail,
        name: cleanName,
        passwordHash: hashPassword(String(password)),
        role: normalizedEmail === ADMIN_EMAIL ? 'ADMIN' : 'USER',
      },
    })

    const token = await createVerificationToken(user.id)
    const emailBody = verificationEmail(normalizedEmail, token)
    const delivery = await sendAuthEmail(normalizedEmail, emailBody.subject, emailBody.html)
    await createSession(user.id)

    return Response.json({
      ok: true,
      delivery,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, emailVerified: user.emailVerified },
    })
  } catch (error) {
    console.error('Register error:', error)
    return Response.json({ error: 'Không thể đăng ký tài khoản lúc này.' }, { status: 500 })
  }
}
