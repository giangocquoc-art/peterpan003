'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MessageSquare,
  Code2,
  GraduationCap,
  Sparkles,
  Send,
  Brain,
  ChevronDown,
  Copy,
  Check,
  X,
  RotateCcw,
  Moon,
  Sun,
  LogOut,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

type ChatMode = 'chat' | 'build-web' | 'study' | 'create'
type AuthView = 'login' | 'register' | 'forgot' | 'reset'
type ThemeMode = 'dark' | 'light'

type AuthUser = {
  id: string
  email: string
  name: string | null
  role: string
  emailVerified: string | null
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatModeInfo {
  id: ChatMode
  label: string
  icon: React.ElementType
  description: string
  color: string
}

interface AiStatus {
  connected: boolean
  provider: string
  model: string | null
  language: string
  languageLabel: string
  note: string
}

const CHAT_MODES: ChatModeInfo[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare, description: 'Trò chuyện tự do', color: 'text-violet-500' },
  { id: 'build-web', label: 'Build Web', icon: Code2, description: 'Xây dựng website', color: 'text-emerald-500' },
  { id: 'study', label: 'Học tập', icon: GraduationCap, description: 'Học tập & ôn luyện', color: 'text-amber-500' },
  { id: 'create', label: 'Sáng tạo', icon: Sparkles, description: 'Sáng tạo nội dung', color: 'text-rose-500' },
]

const SUGGESTIONS: Record<ChatMode, string[]> = {
  chat: ['Giải thích dễ hiểu', 'Viết prompt cho AI', 'Gợi ý tính năng mới', 'Biên tập thành bài học'],
  'build-web': ['Tạo landing page', 'Thiết kế navbar', 'Xây dựng component React', 'Tối ưu SEO website'],
  study: ['Tạo flashcard', 'Tóm tắt nội dung', 'Giải bài tập', 'Luyện tập trắc nghiệm'],
  create: ['Viết thơ', 'Sáng tác truyện ngắn', 'Tạo slogan marketing', 'Brainstorm ý tưởng'],
}

const ADMIN_EMAIL = 'giangoquoc@gmail.com'

export default function ChatHabibi({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<ChatMode>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [thinkingText, setThinkingText] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showThinking] = useState(true)
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [theme, setTheme] = useState<ThemeMode>('dark')
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authView, setAuthView] = useState<AuthView>('login')
  const [authMessage, setAuthMessage] = useState('')
  const [authError, setAuthError] = useState('')
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', token: '' })
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null)
  const [showAdmin, setShowAdmin] = useState(false)
  const [adminForm, setAdminForm] = useState({ provider: 'zai', baseUrl: '', model: '', language: 'vi', apiKey: '' })
  const [adminMessage, setAdminMessage] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const modeMenuRef = useRef<HTMLDivElement>(null)
  const currentMode = CHAT_MODES.find((m) => m.id === mode)!
  const isAdmin = Boolean(user && (user.role === 'ADMIN' || user.email.toLowerCase() === ADMIN_EMAIL))
  const isDark = theme === 'dark'

  const refreshMe = useCallback(async () => {
    const res = await fetch('/api/auth/me')
    const data = await res.json()
    setUser(data.user || null)
    setAuthLoading(false)
  }, [])

  const refreshStatus = useCallback(async () => {
    const res = await fetch('/api/chat-habibi/status')
    const data = await res.json()
    setAiStatus(data)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const resetToken = params.get('resetToken')
    if (resetToken) {
      setAuthForm((prev) => ({ ...prev, token: resetToken }))
      setAuthView('reset')
    }
    const verified = params.get('verified')
    if (verified === 'success') setAuthMessage('Xác thực Gmail thành công. Bạn có thể sử dụng Habibi ngay.')
    if (verified === 'failed') setAuthError('Liên kết xác thực không hợp lệ hoặc đã hết hạn.')
    refreshMe()
    refreshStatus()
  }, [refreshMe, refreshStatus])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, thinkingText, isThinking])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target as Node)) setModeMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!isAdmin || !showAdmin) return
    fetch('/api/admin/ai-config')
      .then((r) => r.json())
      .then((data) => {
        if (data.config) {
          setAdminForm({
            provider: data.config.provider || 'zai',
            baseUrl: data.config.baseUrl || '',
            model: data.config.model || '',
            language: data.config.language || 'vi',
            apiKey: '',
          })
        }
      })
      .catch(() => undefined)
  }, [isAdmin, showAdmin])

  const submitAuth = async (endpoint: string, success: string) => {
    setAuthError('')
    setAuthMessage('')
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authForm),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setAuthError(data.error || 'Không thể xử lý yêu cầu.')
      return
    }
    setAuthMessage(data.delivery?.delivered === false ? `${success} ${data.delivery.reason}` : success)
    if (endpoint.includes('login') || endpoint.includes('register')) await refreshMe()
    if (endpoint.includes('reset-password')) setAuthView('login')
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setMessages([])
  }

  const saveAdminConfig = async () => {
    setAdminMessage('')
    const res = await fetch('/api/admin/ai-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminForm),
    })
    const data = await res.json().catch(() => ({}))
    setAdminMessage(res.ok ? 'Đã lưu cấu hình API AI.' : data.error || 'Không thể lưu cấu hình.')
    await refreshStatus()
  }

  const clearChat = () => {
    setMessages([])
    setThinkingText('')
    setIsThinking(false)
  }

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isStreaming) return

    const userMessage = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsStreaming(true)
    setIsThinking(true)
    setThinkingText('')

    const history = messages.map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat-habibi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, mode, history }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Lỗi kết nối' }))
        throw new Error(errData.error || 'Lỗi kết nối')
      }

      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await res.json()
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content || 'Không có phản hồi.' }])
        return
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No reader')
      const decoder = new TextDecoder()
      let assistantContent = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.type === 'thinking') setThinkingText(parsed.fullThinking || parsed.content || '')
            if (parsed.type === 'thinking_end') setIsThinking(false)
            if (parsed.type === 'content') {
              assistantContent += parsed.content
              setMessages((prev) => {
                const last = prev[prev.length - 1]
                if (last?.role === 'assistant') return [...prev.slice(0, -1), { role: 'assistant', content: assistantContent }]
                return [...prev, { role: 'assistant', content: assistantContent }]
              })
            }
          } catch {
            // Bỏ qua chunk SSE lỗi định dạng để stream không bị dừng.
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: err instanceof Error ? err.message : 'Không thể kết nối đến AI. Vui lòng thử lại.' }])
    } finally {
      setIsStreaming(false)
      setIsThinking(false)
      setThinkingText('')
    }
  }, [input, isStreaming, messages, mode])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyMessage = (idx: number, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const shellClass = isDark ? 'bg-[#212121] text-white' : 'bg-white text-slate-950'
  const sidebarClass = isDark ? 'border-white/10 bg-[#171717]' : 'border-slate-200 bg-slate-50'
  const softText = isDark ? 'text-white/55' : 'text-slate-500'
  const borderClass = isDark ? 'border-white/10' : 'border-slate-200'
  const panelClass = isDark ? 'bg-white/[0.04]' : 'bg-slate-100'
  const inputClass = isDark ? 'bg-[#303030] text-white placeholder:text-white/35' : 'bg-white text-slate-950 placeholder:text-slate-400 shadow-sm'

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#212121] text-white">Đang kiểm tra đăng nhập...</div>
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#111827] via-black to-[#312e81] px-4 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/45 p-6 shadow-2xl backdrop-blur">
          <button onClick={onBack} className="mb-4 text-sm text-white/50 hover:text-white">← Về trang chủ</button>
          <div className="mb-6 text-center">
            <img src="/p-logo.png" alt="P" className="mx-auto mb-3 h-14 w-14" />
            <h1 className="text-3xl font-semibold">Chat Habibi</h1>
            <p className="mt-2 text-sm text-white/55">Đăng nhập để sử dụng trợ lý AI riêng của P-ShareHub.</p>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
            <button onClick={() => setAuthView('login')} className={`rounded-xl px-3 py-2 ${authView === 'login' ? 'bg-white text-black' : 'bg-white/10'}`}>Đăng nhập</button>
            <button onClick={() => setAuthView('register')} className={`rounded-xl px-3 py-2 ${authView === 'register' ? 'bg-white text-black' : 'bg-white/10'}`}>Đăng ký</button>
            <button onClick={() => setAuthView('forgot')} className={`rounded-xl px-3 py-2 ${authView === 'forgot' || authView === 'reset' ? 'bg-white text-black' : 'bg-white/10'}`}>Quên mật khẩu</button>
          </div>

          {authError && <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">{authError}</div>}
          {authMessage && <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{authMessage}</div>}

          <div className="space-y-3">
            {authView === 'register' && (
              <input value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Tên hiển thị" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-white/35" />
            )}
            {(authView === 'login' || authView === 'register' || authView === 'forgot') && (
              <input value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} placeholder="Email Gmail" type="email" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-white/35" />
            )}
            {(authView === 'login' || authView === 'register' || authView === 'reset') && (
              <input value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} placeholder="Mật khẩu tối thiểu 8 ký tự" type="password" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-white/35" />
            )}
            {authView === 'reset' && (
              <input value={authForm.token} onChange={(e) => setAuthForm({ ...authForm, token: e.target.value })} placeholder="Token đặt lại mật khẩu" className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-white/35" />
            )}
          </div>

          <button
            onClick={() => {
              if (authView === 'login') submitAuth('/api/auth/login', 'Đăng nhập thành công.')
              if (authView === 'register') submitAuth('/api/auth/register', 'Đăng ký thành công. Vui lòng kiểm tra Gmail để xác thực.')
              if (authView === 'forgot') submitAuth('/api/auth/forgot-password', 'Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi.')
              if (authView === 'reset') submitAuth('/api/auth/reset-password', 'Đặt lại mật khẩu thành công.')
            }}
            className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            {authView === 'login' && 'Đăng nhập'}
            {authView === 'register' && 'Tạo tài khoản'}
            {authView === 'forgot' && 'Gửi email đặt lại'}
            {authView === 'reset' && 'Đặt lại mật khẩu'}
          </button>

          <p className="mt-4 text-center text-[11px] text-white/35">Xác thực Gmail dùng Gmail SMTP qua GMAIL_USER và GMAIL_APP_PASSWORD.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-screen w-full ${shellClass}`}>
      <aside className={`hidden w-72 flex-col border-r ${sidebarClass} p-3 md:flex`}>
        <div className="mb-4 flex items-center gap-3 px-2 py-2">
          <img src="/p-logo.png" alt="P" className="h-9 w-9" />
          <div>
            <div className="font-semibold">Chat Habibi</div>
            <div className={`text-xs ${softText}`}>Xin chào {user.name || user.email}</div>
          </div>
        </div>

        <button onClick={clearChat} className={`mb-3 flex items-center gap-2 rounded-xl border ${borderClass} px-3 py-2 text-sm hover:opacity-80`}>
          <RotateCcw className="h-4 w-4" /> Chat mới
        </button>

        <div className={`rounded-2xl border ${borderClass} p-3 text-xs ${softText}`}>
          <div className="mb-2 flex items-center gap-2 font-medium text-inherit">
            <ShieldCheck className="h-4 w-4" /> Trạng thái AI
          </div>
          <p>Ngôn ngữ: {aiStatus?.languageLabel || 'Tiếng Việt'}</p>
          <p>API: {aiStatus?.connected ? 'Đã cấu hình' : 'Chưa có key riêng'}</p>
          <p>Provider: {aiStatus?.provider || 'zai'}</p>
        </div>

        {isAdmin && (
          <button onClick={() => setShowAdmin(!showAdmin)} className={`mt-3 flex items-center gap-2 rounded-xl border ${borderClass} px-3 py-2 text-sm hover:opacity-80`}>
            <Settings className="h-4 w-4" /> Cấu hình API AI
          </button>
        )}

        <div className="flex-1" />
        <button onClick={logout} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${softText} hover:opacity-80`}>
          <LogOut className="h-4 w-4" /> Đăng xuất
        </button>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className={`flex items-center justify-between border-b ${borderClass} px-4 py-3`}>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className={`rounded-lg p-2 ${softText} hover:opacity-80 md:hidden`}><X className="h-4 w-4" /></button>
            <div className="relative" ref={modeMenuRef}>
              <button onClick={() => setModeMenuOpen(!modeMenuOpen)} className={`flex items-center gap-2 rounded-xl border ${borderClass} px-3 py-2 text-sm`}>
                <currentMode.icon className={`h-4 w-4 ${currentMode.color}`} />
                <span>{currentMode.label}</span>
                <ChevronDown className={`h-3 w-3 ${softText}`} />
              </button>
              {modeMenuOpen && (
                <div className={`absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border ${borderClass} ${isDark ? 'bg-[#2f2f2f]' : 'bg-white'} shadow-xl`}>
                  {CHAT_MODES.map((m) => {
                    const Icon = m.icon
                    return (
                      <button key={m.id} onClick={() => { setMode(m.id); clearChat(); setModeMenuOpen(false) }} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:opacity-75 ${mode === m.id ? panelClass : ''}`}>
                        <Icon className={`h-4 w-4 ${m.color}`} />
                        <div><div>{m.label}</div><div className={`text-[11px] ${softText}`}>{m.description}</div></div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && <button onClick={() => setShowAdmin(!showAdmin)} className={`rounded-lg p-2 ${softText} hover:opacity-80 md:hidden`}><Settings className="h-4 w-4" /></button>}
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`rounded-lg p-2 ${softText} hover:opacity-80`}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={onBack} className={`hidden text-sm ${softText} hover:opacity-80 md:block`}>← Quay lại</button>
          </div>
        </header>

        {showAdmin && isAdmin && (
          <section className={`border-b ${borderClass} p-4`}>
            <div className={`mx-auto max-w-3xl rounded-2xl border ${borderClass} ${panelClass} p-4`}>
              <div className="mb-3 flex items-center gap-2 font-semibold"><Settings className="h-4 w-4" /> Admin API AI</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={adminForm.provider} onChange={(e) => setAdminForm({ ...adminForm, provider: e.target.value })} placeholder="Provider" className={`rounded-xl border ${borderClass} px-3 py-2 text-sm outline-none ${inputClass}`} />
                <input value={adminForm.model} onChange={(e) => setAdminForm({ ...adminForm, model: e.target.value })} placeholder="Model" className={`rounded-xl border ${borderClass} px-3 py-2 text-sm outline-none ${inputClass}`} />
                <input value={adminForm.baseUrl} onChange={(e) => setAdminForm({ ...adminForm, baseUrl: e.target.value })} placeholder="Base URL tùy chọn" className={`rounded-xl border ${borderClass} px-3 py-2 text-sm outline-none ${inputClass}`} />
                <input value={adminForm.language} onChange={(e) => setAdminForm({ ...adminForm, language: e.target.value })} placeholder="Ngôn ngữ: vi" className={`rounded-xl border ${borderClass} px-3 py-2 text-sm outline-none ${inputClass}`} />
                <input value={adminForm.apiKey} onChange={(e) => setAdminForm({ ...adminForm, apiKey: e.target.value })} placeholder="API key mới (để trống nếu không đổi)" type="password" className={`rounded-xl border ${borderClass} px-3 py-2 text-sm outline-none ${inputClass} sm:col-span-2`} />
              </div>
              <button onClick={saveAdminConfig} className={`mt-3 rounded-xl px-4 py-2 text-sm font-medium ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>Lưu cấu hình</button>
              {adminMessage && <span className={`ml-3 text-sm ${softText}`}>{adminMessage}</span>}
            </div>
          </section>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
              <img src="/p-logo.png" alt="P" className="h-16 w-16 opacity-70" />
              <h1 className="text-3xl font-semibold sm:text-4xl">Hôm nay bạn muốn hỏi gì?</h1>
              <p className={`max-w-xl text-sm ${softText}`}>Habibi trả lời bằng tiếng Việt. Chọn chế độ trong menu phía trên, giao diện mô phỏng bố cục ChatGPT với nền sáng/tối.</p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS[mode].map((s) => <button key={s} onClick={() => setInput(s)} className={`rounded-full border ${borderClass} px-4 py-2 text-xs ${softText} hover:opacity-80`}>{s}</button>)}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && <div className={`mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${panelClass}`}><img src="/p-logo.png" alt="H" className="h-4 w-4" /></div>}
                  <div className={`group relative max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? (isDark ? 'bg-[#2f2f2f] text-white' : 'bg-slate-200 text-slate-950') : 'bg-transparent'}`}>
                    {msg.role === 'assistant' ? <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert text-white/90' : 'text-slate-800'}`}><ReactMarkdown>{msg.content}</ReactMarkdown></div> : msg.content}
                    {msg.role === 'assistant' && <button onClick={() => copyMessage(idx, msg.content)} className={`absolute -bottom-3 right-2 hidden items-center gap-1 rounded-md px-2 py-1 text-[10px] group-hover:flex ${panelClass} ${softText}`}>{copiedIdx === idx ? <><Check className="h-3 w-3" /> Đã copy</> : <><Copy className="h-3 w-3" /> Copy</>}</button>}
                  </div>
                </div>
              ))}
              {(isThinking || thinkingText) && showThinking && <div className="flex gap-3"><Brain className="h-5 w-5 animate-pulse text-amber-500" /><div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs ${panelClass} ${softText}`}>{thinkingText || 'Đang phân tích câu hỏi của bạn...'}</div></div>}
              {isStreaming && !isThinking && <div className={`flex items-center gap-2 text-xs ${softText}`}><div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />Đang trả lời...</div>}
            </div>
          )}
        </div>

        <div className={`border-t ${borderClass} px-4 py-4`}>
          <div className="mx-auto max-w-3xl">
            <div className={`flex items-end gap-2 rounded-3xl border ${borderClass} px-4 py-3 ${inputClass}`}>
              <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={`Nhắn tin cho Habibi... (${currentMode.label})`} className="max-h-32 flex-1 resize-none bg-transparent text-sm outline-none" rows={1} onInput={(e) => { const el = e.currentTarget; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 128) + 'px' }} />
              <button onClick={sendMessage} disabled={!input.trim() || isStreaming} className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-30 ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}><Send className="h-4 w-4" /></button>
            </div>
            <p className={`mt-2 text-center text-[10px] ${softText}`}>Habibi có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
