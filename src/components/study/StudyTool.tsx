'use client'

import { useState, useCallback } from 'react'
import {
  ArrowLeft,
  Upload,
  BookOpen,
  Layers,
  CheckSquare,
  PenLine,
  List,
  FlipHorizontal2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  FileText,
  Image as ImageIcon,
  Type,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Difficulty = 'easy' | 'medium' | 'hard'
type StudyMode = 'flashcard' | 'fillBlank' | 'quiz' | 'summary' | 'match'

interface StudyData {
  title: string
  flashcard: Array<{ front: string; back: string }>
  fillBlank: Array<{ sentence: string; answer: string; hint?: string }>
  quiz: Array<{ question: string; options: string[]; correct: number; explanation: string }>
  summary: Array<{ point: string; detail: string }>
  match: Array<{ term: string; definition: string }>
}

const DIFFICULTIES: { id: Difficulty; label: string; emoji: string; desc: string }[] = [
  { id: 'easy', label: 'Dễ', emoji: '🟢', desc: 'Cơ bản, phù hợp người mới' },
  { id: 'medium', label: 'Trung bình', emoji: '🟡', desc: 'Có nền tảng cơ bản' },
  { id: 'hard', label: 'Khó', emoji: '🔴', desc: 'Nâng cao, hiểu sâu' },
]

const STUDY_MODES: { id: StudyMode; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'flashcard', label: 'Lật thẻ', icon: FlipHorizontal2, desc: 'Thẻ ghi nhớ mặt trước-sau' },
  { id: 'fillBlank', label: 'Điền chỗ trống', icon: PenLine, desc: 'Điền từ vào chỗ trống' },
  { id: 'quiz', label: 'Trắc nghiệm', icon: CheckSquare, desc: 'Chọn đáp án đúng A-B-C-D' },
  { id: 'summary', label: 'Tóm tắt', icon: List, desc: 'Ý chính bài học' },
  { id: 'match', label: 'Nối cặp', icon: Layers, desc: 'Nối thuật ngữ với định nghĩa' },
]

export default function StudyTool({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'input' | 'config' | 'loading' | 'result'>('input')
  const [content, setContent] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [questionCount, setQuestionCount] = useState(5)
  const [selectedModes, setSelectedModes] = useState<StudyMode[]>(['flashcard'])
  const [studyData, setStudyData] = useState<StudyData | null>(null)
  const [error, setError] = useState('')

  const toggleMode = (mode: StudyMode) => {
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    )
  }

  const generateStudy = useCallback(async () => {
    if (!content.trim() || selectedModes.length === 0) return

    setStep('loading')
    setError('')

    try {
      const res = await fetch('/api/study-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          difficulty,
          questionCount,
          studyModes: selectedModes,
        }),
      })

      const data = await res.json()

      if (data.success && data.data) {
        setStudyData(data.data)
        setStep('result')
      } else {
        setError(data.error || 'Không thể tạo bài học. Vui lòng thử lại.')
        setStep('config')
      }
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.')
      setStep('config')
    }
  }, [content, difficulty, questionCount, selectedModes])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <div className="h-5 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-400" />
              <h1 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                Study Tool
              </h1>
            </div>
          </div>

          {step === 'result' && (
            <button
              onClick={() => setStep('config')}
              className="text-sm text-white/40 transition-colors hover:text-white"
            >
              Tạo bài học mới
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Step: Input Content */}
        {step === 'input' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
                Biến tài liệu thành bài học 📚
              </h2>
              <p className="mt-3 text-sm text-white/40">
                Dán nội dung, tải file hoặc gõ trực tiếp — AI sẽ tạo bài học cho bạn
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dán nội dung bài học vào đây... (có thể dán text, ghi chép, tài liệu học tập)"
                className="h-64 w-full resize-none rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/15"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white">
                  <FileText className="h-3.5 w-3.5" />
                  File Word/TXT
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Hình ảnh
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white">
                  <Type className="h-3.5 w-3.5" />
                  Nhập tay
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => content.trim() ? setStep('config') : null}
                disabled={!content.trim()}
                className="rounded-full bg-white px-8 py-3 text-black hover:bg-white/90 disabled:opacity-30"
              >
                Tiếp tục <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Configure */}
        {step === 'config' && (
          <div className="space-y-8">
            {/* Difficulty */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-white/60">Mức độ khó</h3>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      difficulty === d.id
                        ? 'border-white/20 bg-white/10'
                        : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                    }`}
                  >
                    <span className="text-2xl">{d.emoji}</span>
                    <div className="mt-2 text-sm font-medium">{d.label}</div>
                    <div className="mt-1 text-[11px] text-white/40">{d.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-white/60">Số lượng câu hỏi</h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="flex-1 accent-white"
                />
                <span className="w-8 text-center text-lg font-semibold">{questionCount}</span>
              </div>
            </div>

            {/* Study Modes */}
            <div>
              <h3 className="mb-4 text-sm font-medium text-white/60">Loại bài học</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {STUDY_MODES.map((m) => {
                  const Icon = m.icon
                  const isSelected = selectedModes.includes(m.id)
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMode(m.id)}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-white/20 bg-white/10'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                      }`}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isSelected ? 'bg-white/10' : 'bg-white/5'}`}>
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-amber-400' : 'text-white/40'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{m.label}</div>
                        <div className="text-[11px] text-white/40">{m.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                onClick={() => setStep('input')}
                variant="ghost"
                className="text-white/50 hover:text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Quay lại
              </Button>
              <Button
                onClick={generateStudy}
                disabled={selectedModes.length === 0}
                className="rounded-full bg-white px-8 py-3 text-black hover:bg-white/90 disabled:opacity-30"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Tạo bài học
              </Button>
            </div>
          </div>
        )}

        {/* Step: Loading */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-white/40" />
            <p className="mt-6 text-lg text-white/50">Đang tạo bài học...</p>
            <p className="mt-2 text-sm text-white/30">AI đang phân tích nội dung và soạn câu hỏi</p>
          </div>
        )}

        {/* Step: Result */}
        {step === 'result' && studyData && (
          <StudyResult data={studyData} selectedModes={selectedModes} />
        )}
      </div>
    </div>
  )
}

function StudyResult({ data, selectedModes }: { data: StudyData; selectedModes: StudyMode[] }) {
  const [activeMode, setActiveMode] = useState<StudyMode>(selectedModes[0] || 'flashcard')

  return (
    <div className="space-y-6">
      <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
        {data.title || 'Bài học của bạn'}
      </h2>

      {/* Mode Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02] p-1">
        {selectedModes.map((m) => {
          const modeInfo = STUDY_MODES.find((sm) => sm.id === m)
          if (!modeInfo) return null
          const Icon = modeInfo.icon
          return (
            <button
              key={m}
              onClick={() => setActiveMode(m)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                activeMode === m
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon className="h-4 w-4" />
              {modeInfo.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeMode === 'flashcard' && <FlashcardMode cards={data.flashcard} />}
      {activeMode === 'fillBlank' && <FillBlankMode items={data.fillBlank} />}
      {activeMode === 'quiz' && <QuizMode items={data.quiz} />}
      {activeMode === 'summary' && <SummaryMode items={data.summary} />}
      {activeMode === 'match' && <MatchMode items={data.match} />}
    </div>
  )
}

function FlashcardMode({ cards }: { cards: Array<{ front: string; back: string }> }) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (!cards.length) return <p className="text-sm text-white/40">Không có flashcard</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-white/40">
        <span>Thẻ {idx + 1}/{cards.length}</span>
        <span>Nhấn để lật</span>
      </div>
      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center transition-all hover:bg-white/[0.05]"
        style={{ minHeight: '200px' }}
      >
        <div className="mb-4 text-xs text-white/30">{flipped ? 'MẶT SAU' : 'MẶT TRƯỚC'}</div>
        <p className="text-lg leading-relaxed">{flipped ? cards[idx].back : cards[idx].front}</p>
      </button>
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={() => { setIdx(Math.max(0, idx - 1)); setFlipped(false) }}
          variant="ghost"
          disabled={idx === 0}
          className="text-white/50"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Trước
        </Button>
        <Button
          onClick={() => { setIdx(Math.min(cards.length - 1, idx + 1)); setFlipped(false) }}
          variant="ghost"
          disabled={idx === cards.length - 1}
          className="text-white/50"
        >
          Sau <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function FillBlankMode({ items }: { items: Array<{ sentence: string; answer: string; hint?: string }> }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  if (!items.length) return <p className="text-sm text-white/40">Không có câu hỏi điền chỗ trống</p>

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <p className="text-sm leading-relaxed text-white/70">{item.sentence}</p>
          {revealed.has(i) ? (
            <div className="mt-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
              Đáp án: {item.answer}
            </div>
          ) : (
            <button
              onClick={() => setRevealed((prev) => new Set(prev).add(i))}
              className="mt-2 text-xs text-white/30 transition-colors hover:text-white/60"
            >
              {item.hint ? `Gợi ý: ${item.hint}` : 'Nhấn để xem đáp án'}
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function QuizMode({ items }: { items: Array<{ question: string; options: string[]; correct: number; explanation: string }> }) {
  const [selected, setSelected] = useState<Record<number, number>>({})

  if (!items.length) return <p className="text-sm text-white/40">Không có câu trắc nghiệm</p>

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const userAnswer = selected[i]
        const isAnswered = userAnswer !== undefined
        return (
          <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <p className="mb-3 text-sm font-medium">{i + 1}. {item.question}</p>
            <div className="space-y-2">
              {item.options.map((opt, j) => {
                let cls = 'border-white/5 bg-white/[0.02] hover:border-white/10'
                if (isAnswered) {
                  if (j === item.correct) cls = 'border-emerald-500/30 bg-emerald-500/5'
                  else if (j === userAnswer && j !== item.correct) cls = 'border-red-500/30 bg-red-500/5'
                }
                return (
                  <button
                    key={j}
                    onClick={() => !isAnswered && setSelected((prev) => ({ ...prev, [i]: j }))}
                    disabled={isAnswered}
                    className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${cls}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {isAnswered && (
              <div className={`mt-3 rounded-lg p-3 text-xs ${userAnswer === item.correct ? 'bg-emerald-500/5 text-emerald-400' : 'bg-red-500/5 text-red-400'}`}>
                {userAnswer === item.correct ? '✓ Chính xác!' : '✗ Chưa đúng.'} {item.explanation}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function SummaryMode({ items }: { items: Array<{ point: string; detail: string }> }) {
  if (!items.length) return <p className="text-sm text-white/40">Không có tóm tắt</p>

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-xs text-white/40">
            {i + 1}
          </div>
          <div>
            <p className="text-sm font-medium">{item.point}</p>
            <p className="mt-1 text-xs text-white/40">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function MatchMode({ items }: { items: Array<{ term: string; definition: string }> }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  if (!items.length) return <p className="text-sm text-white/40">Không có câu nối cặp</p>

  return (
    <div className="space-y-3">
      <p className="text-xs text-white/30">Nhấn vào mỗi cặp để xem đáp án nối</p>
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => setRevealed((prev) => new Set(prev).add(i))}
          className="flex w-full items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left transition-all hover:bg-white/[0.04]"
        >
          <div className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-sm">{item.term}</div>
          <div className="text-white/20">
            {revealed.has(i) ? '⟷' : '→'}
          </div>
          <div className={`flex-1 rounded-lg px-3 py-2 text-sm ${revealed.has(i) ? 'bg-amber-500/10 text-amber-400' : 'bg-white/[0.02] text-white/20'}`}>
            {revealed.has(i) ? item.definition : '???'}
          </div>
        </button>
      ))}
    </div>
  )
}
