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
  Image as ImageIcon,
  Paperclip,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'

type ChatMode = 'chat' | 'build-web' | 'study' | 'create'

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

const CHAT_MODES: ChatModeInfo[] = [
  { id: 'chat', label: 'Chat', icon: MessageSquare, description: 'Trò chuyện tự do', color: 'text-white' },
  { id: 'build-web', label: 'Build Web', icon: Code2, description: 'Xây dựng website', color: 'text-emerald-400' },
  { id: 'study', label: 'Học tập', icon: GraduationCap, description: 'Học tập & ôn luyện', color: 'text-amber-400' },
  { id: 'create', label: 'Sáng tạo', icon: Sparkles, description: 'Sáng tạo nội dung', color: 'text-rose-400' },
]

const SUGGESTIONS: Record<ChatMode, string[]> = {
  chat: ['Giải thích dễ hiểu', 'Viết prompt cho AI', 'Gợi ý tính năng mới', 'Biên tập thành bài học'],
  'build-web': ['Tạo landing page', 'Thiết kế navbar', 'Xây dựng component React', 'Tối ưu SEO website'],
  study: ['Tạo flashcard', 'Tóm tắt nội dung', 'Giải bài tập', 'Luyện tập trắc nghiệm'],
  create: ['Viết thơ', 'Sáng tác truyện ngắn', 'Tạo slogan marketing', 'Brainstorm ý tưởng'],
}

export default function ChatHabibi({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<ChatMode>('chat')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [thinkingText, setThinkingText] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [showThinking, setShowThinking] = useState(true)
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const modeMenuRef = useRef<HTMLDivElement>(null)

  const currentMode = CHAT_MODES.find((m) => m.id === mode)!

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, thinkingText, isThinking])

  // Close mode menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target as Node)) {
        setModeMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

      // Check if response is SSE stream or JSON
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        // Non-streaming fallback
        const data = await res.json()
        setMessages((prev) => [...prev, { role: 'assistant', content: data.content || 'Không có phản hồi.' }])
        return
      }

      // SSE Streaming
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let assistantContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))

            if (data.type === 'thinking') {
              setThinkingText(data.fullThinking || '')
            } else if (data.type === 'thinking_end') {
              setIsThinking(false)
            } else if (data.type === 'content') {
              setIsThinking(false)
              assistantContent += data.content
              setMessages((prev) => {
                const newMsgs = [...prev]
                const lastMsg = newMsgs[newMsgs.length - 1]
                if (lastMsg?.role === 'assistant') {
                  newMsgs[newMsgs.length - 1] = { ...lastMsg, content: assistantContent }
                } else {
                  newMsgs.push({ role: 'assistant', content: assistantContent })
                }
                return newMsgs
              })
            } else if (data.type === 'done') {
              break
            } else if (data.type === 'error') {
              setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: '⚠️ ' + data.content },
              ])
            }
          } catch {
            // skip malformed data
          }
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Không thể kết nối đến AI. Vui lòng thử lại.'
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${errMsg}` },
      ])
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

  const handleSuggestion = (text: string) => {
    setInput(text)
    inputRef.current?.focus()
  }

  const clearChat = () => {
    setMessages([])
    setThinkingText('')
    setIsThinking(false)
  }

  const copyMessage = (idx: number, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="flex h-screen w-full bg-black text-white">
      {/* Left Sidebar */}
      <div className="flex w-16 flex-col items-center gap-2 border-r border-white/5 bg-black/40 py-4 md:w-56 md:items-stretch md:px-3">
        {/* P Logo */}
        <div className="mb-4 flex items-center justify-center md:justify-start md:gap-3 md:px-2">
          <img src="/p-logo.png" alt="P" className="h-8 w-8 md:h-10 md:w-10" />
          <span className="hidden text-lg font-semibold md:block" style={{ fontFamily: 'var(--font-display)' }}>
            Chat Habibi
          </span>
        </div>

        {/* New Chat */}
        <button
          onClick={clearChat}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10 md:w-full md:gap-2 md:px-3"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden text-sm md:block">Chat mới</span>
        </button>

        {/* Mode selector */}
        <div className="mt-4 flex flex-col gap-1">
          {CHAT_MODES.map((m) => {
            const Icon = m.icon
            const isActive = mode === m.id
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id)
                  clearChat()
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all md:w-full md:gap-2.5 md:px-3 ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? m.color : ''}`} />
                <span className="hidden text-sm md:block">{m.label}</span>
              </button>
            )
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom info */}
        <div className="hidden border-t border-white/5 px-2 pt-3 md:block">
          <p className="text-[11px] text-white/30">
            Chế độ: <span className={currentMode.color}>{currentMode.label}</span>
          </p>
          <p className="mt-1 text-[11px] text-white/20">{currentMode.description}</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/5 hover:text-white md:hidden"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Mode Selector Dropdown */}
            <div className="relative" ref={modeMenuRef}>
              <button
                onClick={() => setModeMenuOpen(!modeMenuOpen)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
              >
                <currentMode.icon className={`h-4 w-4 ${currentMode.color}`} />
                <span>{currentMode.label}</span>
                <ChevronDown className="h-3 w-3 text-white/40" />
              </button>

              {modeMenuOpen && (
                <div className="absolute left-0 top-full z-50 mt-1 w-56 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-xl">
                  {CHAT_MODES.map((m) => {
                    const Icon = m.icon
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setMode(m.id)
                          clearChat()
                          setModeMenuOpen(false)
                        }}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5 ${
                          mode === m.id ? 'bg-white/5 text-white' : 'text-white/60'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${m.color}`} />
                        <div>
                          <div className="font-medium">{m.label}</div>
                          <div className="text-[11px] text-white/40">{m.description}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {mode !== 'chat' && (
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                AI chỉ trả lời trong lĩnh vực này
              </span>
            )}
          </div>

          <button
            onClick={onBack}
            className="hidden text-sm text-white/40 transition-colors hover:text-white md:block"
          >
            ← Quay lại
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex h-full flex-col items-center justify-center gap-6 px-4">
              <img src="/p-logo.png" alt="P" className="h-16 w-16 opacity-60" />
              <h1
                className="text-3xl tracking-tight sm:text-4xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Hi, I&apos;m Habibi
              </h1>
              <p className="max-w-md text-center text-sm text-white/50">
                Hỏi ngắn gọn — Habibi sẽ đoán ý, giải thích dễ hiểu và gợi ý bước tiếp theo cho bạn.
                <br />
                <span className="text-white/30">
                  Đang ở chế độ: {currentMode.label} — {currentMode.description}
                </span>
              </p>

              {/* Suggestion chips */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS[mode].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/5">
                      <img src="/p-logo.png" alt="H" className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white/10 text-white'
                        : 'bg-white/[0.03] text-white/90'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ol]:mb-2 [&>pre]:mb-2">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}

                    {/* Copy button for assistant messages */}
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => copyMessage(idx, msg.content)}
                        className="absolute -bottom-2 right-2 hidden items-center gap-1 rounded-md bg-neutral-800 px-2 py-1 text-[10px] text-white/40 transition-colors hover:text-white group-hover:flex"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="h-3 w-3" /> Đã copy
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" /> Copy
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Thinking indicator */}
              {(isThinking || thinkingText) && showThinking && (
                <div className="flex gap-3">
                  <div className="mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/5">
                    <Brain className="h-4 w-4 animate-pulse text-amber-400" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl bg-white/[0.02] px-4 py-3">
                    <div className="mb-2 flex items-center gap-2 text-xs text-amber-400/70">
                      <Brain className="h-3 w-3 animate-pulse" />
                      Đang suy nghĩ...
                    </div>
                    <div className="max-h-32 overflow-y-auto text-xs leading-relaxed text-white/30">
                      {thinkingText || 'Đang phân tích câu hỏi của bạn...'}
                    </div>
                  </div>
                </div>
              )}

              {/* Streaming indicator */}
              {isStreaming && !isThinking && (
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/40" />
                  Đang trả lời...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/5 px-4 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Hỏi Habibi bất cứ điều gì... (${currentMode.label})`}
                className="flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                rows={1}
                style={{ maxHeight: '120px' }}
                onInput={(e) => {
                  const el = e.currentTarget
                  el.style.height = 'auto'
                  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-white/20">
              Habibi có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
