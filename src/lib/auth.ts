import { cookies, headers } from 'next/headers'
import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'

export const ADMIN_EMAIL = 'giangoquoc@gmail.com'
const SESSION_COOKIE = 'psharehub_session'
const TOKEN_BYTES = 32

export type AuthUser = {
  id: string
  email: string
  name: string | null
  role: string
  emailVerified: Date | null
}

function getAppUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return 'http://localhost:3000'
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const nextHash = pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex')
  const hashBuffer = Buffer.from(hash, 'hex')
  const nextBuffer = Buffer.from(nextHash, 'hex')
  if (hashBuffer.length !== nextBuffer.length) return false
  return timingSafeEqual(hashBuffer, nextBuffer)
}

export function createPlainToken() {
  return randomBytes(TOKEN_BYTES).toString('hex')
}

export async function createSession(userId: string) {
  const token = createPlainToken()
  const tokenHash = hashToken(token)
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)

  await (db as any).session.create({ data: { tokenHash, userId, expiresAt } })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })

  return token
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (token) {
    await (db as any).session.deleteMany({ where: { tokenHash: hashToken(token) } })
  }
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null

  const session = await (db as any).session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    if (session) await (db as any).session.delete({ where: { id: session.id } })
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    emailVerified: session.user.emailVerified,
  }
}

export function isAdminUser(user: AuthUser | null) {
  return Boolean(user && (user.role === 'ADMIN' || user.email.toLowerCase() === ADMIN_EMAIL))
}

export async function createVerificationToken(userId: string) {
  const token = createPlainToken()
  await (db as any).verificationToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  })
  return token
}

export async function createPasswordResetToken(userId: string) {
  const token = createPlainToken()
  await (db as any).passwordResetToken.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    },
  })
  return token
}

export async function consumeVerificationToken(token: string) {
  const record = await (db as any).verificationToken.findUnique({ where: { tokenHash: hashToken(token) } })
  if (!record || record.expiresAt < new Date()) return null
  await (db as any).verificationToken.delete({ where: { id: record.id } })
  await (db as any).user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } })
  return record.userId as string
}

export async function consumePasswordResetToken(token: string) {
  const record = await (db as any).passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } })
  if (!record || record.expiresAt < new Date()) return null
  await (db as any).passwordResetToken.delete({ where: { id: record.id } })
  return record.userId as string
}

export async function sendAuthEmail(to: string, subject: string, html: string) {
  const host = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!host || !pass) {
    console.log(`[Auth email placeholder] To: ${to}\nSubject: ${subject}\n${html}`)
    return { delivered: false, reason: 'GMAIL_USER/GMAIL_APP_PASSWORD chưa được cấu hình, email được ghi vào log.' }
  }

  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: host, pass },
  })

  await transporter.sendMail({ from: `P-ShareHub <${host}>`, to, subject, html })
  return { delivered: true }
}

export function verificationEmail(email: string, token: string) {
  const url = `${getAppUrl()}/api/auth/verify?token=${encodeURIComponent(token)}`
  return {
    subject: 'Xác thực tài khoản P-ShareHub',
    html: `<p>Xin chào ${email},</p><p>Nhấn vào liên kết sau để xác thực tài khoản:</p><p><a href="${url}">${url}</a></p><p>Liên kết hết hạn sau 24 giờ.</p>`,
  }
}

export function resetPasswordEmail(email: string, token: string) {
  const appUrl = getAppUrl()
  const url = `${appUrl}/habibi?resetToken=${encodeURIComponent(token)}`
  return {
    subject: 'Đặt lại mật khẩu P-ShareHub',
    html: `<p>Xin chào ${email},</p><p>Nhấn vào liên kết sau để đặt lại mật khẩu:</p><p><a href="${url}">${url}</a></p><p>Liên kết hết hạn sau 30 phút.</p>`,
  }
}

export async function requestIp() {
  const headerStore = await headers()
  return headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}
