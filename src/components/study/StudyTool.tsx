'use client'

import { useState, useCallback, useRef } from 'react'
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
  FileText,
  Type,
  FileUp,
  X,
  AlertCircle,
  Check,
  RotateCcw,
  Shuffle,
  Sparkles,
  Download,
  Brain,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  generateStudy,
  extractTextFromPDF,
  extractTextFromFile,
  type StudyData,
  type Difficulty,
  type StudyMode,
} from '@/lib/study-engine'

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

type InputMethod = 'paste' | 'file' | 'manual'
type Step = 'input' | 'config' | 'loading' | 'result'

export default function StudyTool({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>('input')
  const [content, setContent] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [questionCount, setQuestionCount] = useState(5)
  const [selectedModes, setSelectedModes] = useState<StudyMode[]>(['flashcard', 'quiz'])
  const [studyData, setStudyData] = useState<StudyData | null>(null)
  const [error, setError] = useState('')
  const [inputMethod, setInputMethod] = useState<InputMethod>('paste')
  const [fileName, setFileName] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processProgress, setProcessProgress] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleMode = (mode: StudyMode) => {
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    )
  }

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true)
    setError('')
    setFileName(file.name)

    try {
      let extractedText = ''

      if (file.type === 'application/pdf') {
        setProcessProgress('Đang đọc PDF...')
        extractedText = await extractTextFromPDF(file)
      } else if (
        file.type === 'text/plain' ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md')
      ) {
        setProcessProgress('Đang đọc file văn bản...')
        extractedText = await extractTextFromFile(file)
      } else {
        setError('Định dạng file không hỗ trợ. Vui lòng dùng PDF, TXT hoặc MD.')
        setIsProcessing(false)
        return
      }

      if (extractedText.trim().length < 20) {
        setError('Nội dung file quá ngắn hoặc không thể đọc. Vui lòng thử file khác hoặc dán text trực tiếp.')
        setIsProcessing(false)
        return
      }

      setContent(extractedText)
      setInputMethod('file')
      setIsProcessing(false)
      setProcessProgress('')
    } catch {
      setError('Không thể đọc file. Vui lòng thử lại hoặc dán text trực tiếp.')
      setIsProcessing(false)
      setProcessProgress('')
    }
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFileUpload(file)
    },
    [handleFileUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (file) handleFileUpload(file)
    },
    [handleFileUpload]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const generateStudyData = useCallback(() => {
    if (!content.trim() || selectedModes.length === 0) return

    setStep('loading')
    setError('')

    // Simulate brief processing delay for UX
    setTimeout(() => {
      try {
        const data = generateStudy(content, difficulty, questionCount, selectedModes)
        setStudyData(data)
        setStep('result')
      } catch {
        setError('Không thể phân tích nội dung. Vui lòng thử lại với nội dung khác.')
        setStep('config')
      }
    }, 600)
  }, [content, difficulty, questionCount, selectedModes])

  const resetAll = () => {
    setContent('')
    setFileName('')
    setStep('input')
    setStudyData(null)
    setError('')
    setInputMethod('paste')
    setSelectedModes(['flashcard', 'quiz'])
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const sentenceCount = content.split(/[.!?。！？]+/).filter((s) => s.trim().length > 5).length

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
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
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <h1 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                Biến tài liệu thành bài học
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step === 'result' && (
              <>
                <button
                  onClick={() => setStep('config')}
                  className="text-sm text-white/40 transition-colors hover:text-white"
                >
                  Cài đặt lại
                </button>
                <button
                  onClick={resetAll}
                  className="flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Tài liệu mới
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 mx-auto w-full max-w-4xl px-6 py-8">
        {/* Step: Input Content */}
        {step === 'input' && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400">
                <Brain className="h-3.5 w-3.5" />
                100% Client-side • Không dùng AI • Không lưu dữ liệu
              </div>
              <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
                Biến tài liệu thành bài học 📚
              </h2>
              <p className="mt-3 text-sm text-white/40 max-w-lg mx-auto">
                Dán nội dung, tải file PDF/TXT hoặc gõ trực tiếp — thuật toán mã nguồn mở sẽ phân tích và tạo bài học cho bạn. Không AI, không gửi dữ liệu lên server.
              </p>
            </div>

            {/* Input Method Tabs */}
            <div className="flex gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-1">
              {[
                { id: 'paste' as InputMethod, label: 'Dán text', icon: Type },
                { id: 'file' as InputMethod, label: 'Tải file', icon: FileUp },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setInputMethod(tab.id)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors ${
                      inputMethod === tab.id
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Paste Input */}
            {inputMethod === 'paste' && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dán nội dung bài học vào đây...&#10;&#10;Ví dụ:&#10;Hà Nội là thủ đô của Việt Nam, nằm ở phía Bắc đất nước. Hà Nội có hơn 1000 năm lịch sử...&#10;&#10;Hồ Chí Minh là thành phố lớn nhất Việt Nam, trung tâm kinh tế phía Nam..."
                  className="h-64 w-full resize-none rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-emerald-500/30 transition-colors"
                />
                {content.trim() && (
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/30">
                    <span>{wordCount} từ</span>
                    <span>{sentenceCount} câu</span>
                    <button onClick={() => setContent('')} className="text-white/20 hover:text-white/50 transition-colors">
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* File Upload */}
            {inputMethod === 'file' && (
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/[0.01] py-16 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]"
                >
                  {isProcessing ? (
                    <>
                      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
                      <p className="text-sm text-white/50">{processProgress}</p>
                    </>
                  ) : fileName ? (
                    <>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                        <Check className="h-6 w-6 text-emerald-400" />
                      </div>
                      <p className="text-sm text-white/70">{fileName}</p>
                      <p className="mt-1 text-xs text-white/30">{wordCount} từ đã trích xuất</p>
                      <p className="mt-3 text-xs text-emerald-400/60">Nhấn để đổi file khác</p>
                    </>
                  ) : (
                    <>
                      <Upload className="mb-4 h-10 w-10 text-white/20" />
                      <p className="text-sm text-white/50">Kéo thả file hoặc nhấn để chọn</p>
                      <p className="mt-2 text-xs text-white/30">Hỗ trợ PDF, TXT, MD</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* Show extracted text preview */}
                {content && fileName && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-white/30">Nội dung trích xuất</span>
                      <button
                        onClick={() => { setContent(''); setFileName('') }}
                        className="text-xs text-white/20 hover:text-white/50 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                    <div className="max-h-32 overflow-y-auto rounded-lg border border-white/5 bg-white/[0.01] p-3 text-xs text-white/40">
                      {content.substring(0, 500)}{content.length > 500 ? '...' : ''}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-xs text-white/30">
                      <span>{wordCount} từ</span>
                      <span>{sentenceCount} câu</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Privacy Notice */}
            <div className="flex items-center justify-center gap-6 text-[11px] text-white/20">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3 w-3" />
                Không dùng AI
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                Không gửi dữ liệu lên server
              </span>
              <span className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" />
                Chạy 100% trên trình duyệt
              </span>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => content.trim() ? setStep('config') : null}
                disabled={!content.trim() || isProcessing}
                className="rounded-full bg-emerald-500 px-8 py-3 text-black hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 transition-all"
              >
                Tiếp tục <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Configure */}
        {step === 'config' && (
          <div className="space-y-8">
            {/* Content Preview */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-white/40">Nội dung đã nhập</span>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>{wordCount} từ</span>
                  <span>{sentenceCount} câu</span>
                  {fileName && <span>📄 {fileName}</span>}
                </div>
              </div>
              <p className="text-xs text-white/25 line-clamp-2">
                {content.substring(0, 200)}...
              </p>
            </div>

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
                        ? 'border-emerald-500/30 bg-emerald-500/5'
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
                  className="flex-1 accent-emerald-500"
                />
                <span className="w-8 text-center text-lg font-semibold text-emerald-400">{questionCount}</span>
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
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                      }`}
                    >
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isSelected ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-emerald-400' : 'text-white/40'}`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{m.label}</div>
                        <div className="text-[11px] text-white/40">{m.desc}</div>
                      </div>
                      {isSelected && (
                        <Check className="ml-auto h-4 w-4 text-emerald-400" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
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
                onClick={generateStudyData}
                disabled={selectedModes.length === 0}
                className="rounded-full bg-emerald-500 px-8 py-3 text-black hover:bg-emerald-400 disabled:opacity-30 transition-all"
              >
                <Brain className="mr-2 h-4 w-4" />
                Tạo bài học
              </Button>
            </div>
          </div>
        )}

        {/* Step: Loading */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-6 h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
            <p className="text-lg text-white/50">Đang phân tích nội dung...</p>
            <p className="mt-2 text-sm text-white/30">Thuật toán đang trích xuất từ khóa, tạo câu hỏi</p>
            <div className="mt-6 flex items-center gap-2 text-xs text-white/20">
              <Zap className="h-3 w-3" />
              Xử lý hoàn toàn trên trình duyệt
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === 'result' && studyData && (
          <StudyResult data={studyData} selectedModes={selectedModes} onReset={resetAll} onReconfigure={() => setStep('config')} />
        )}
      </div>
    </div>
  )
}

/* ─── Study Result Container ─── */

function StudyResult({
  data,
  selectedModes,
  onReset,
  onReconfigure,
}: {
  data: StudyData
  selectedModes: StudyMode[]
  onReset: () => void
  onReconfigure: () => void
}) {
  const [activeMode, setActiveMode] = useState<StudyMode>(selectedModes[0] || 'flashcard')

  // Count items per mode
  const itemCounts: Record<StudyMode, number> = {
    flashcard: data.flashcard.length,
    fillBlank: data.fillBlank.length,
    quiz: data.quiz.length,
    summary: data.summary.length,
    match: data.match.length,
  }

  return (
    <div className="space-y-6">
      {/* Title + Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            {data.title || 'Bài học của bạn'}
          </h2>
          <p className="mt-1 text-xs text-white/30">
            {selectedModes.map((m) => {
              const info = STUDY_MODES.find((sm) => sm.id === m)
              return info ? `${info.label}: ${itemCounts[m]}` : ''
            }).filter(Boolean).join(' • ')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReconfigure}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            Cài đặt lại
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            Tài liệu mới
          </button>
        </div>
      </div>

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
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon className="h-4 w-4" />
              {modeInfo.label}
              <span className="text-[10px] opacity-50">({itemCounts[m]})</span>
            </button>
          )
        })}
      </div>

      {/* Empty state for mode */}
      {itemCounts[activeMode] === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <AlertCircle className="mb-4 h-8 w-8 text-white/20" />
          <p className="text-sm text-white/40">Không thể tạo bài học loại này từ nội dung</p>
          <p className="mt-1 text-xs text-white/20">Thử thêm nội dung chi tiết hơn hoặc chọn loại bài học khác</p>
        </div>
      )}

      {/* Content */}
      {activeMode === 'flashcard' && data.flashcard.length > 0 && <FlashcardMode cards={data.flashcard} />}
      {activeMode === 'fillBlank' && data.fillBlank.length > 0 && <FillBlankMode items={data.fillBlank} />}
      {activeMode === 'quiz' && data.quiz.length > 0 && <QuizMode items={data.quiz} />}
      {activeMode === 'summary' && data.summary.length > 0 && <SummaryMode items={data.summary} />}
      {activeMode === 'match' && data.match.length > 0 && <MatchMode items={data.match} />}
    </div>
  )
}

/* ─── Flashcard Mode ─── */

function FlashcardMode({ cards }: { cards: Array<{ front: string; back: string }> }) {
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set())

  const handleNext = () => {
    setFlipped(false)
    setIdx(Math.min(cards.length - 1, idx + 1))
  }
  const handlePrev = () => {
    setFlipped(false)
    setIdx(Math.max(0, idx - 1))
  }
  const handleKnown = () => {
    setKnownCards((prev) => new Set(prev).add(idx))
    handleNext()
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-white/40">
        <span>Thẻ {idx + 1}/{cards.length}</span>
        {knownCards.size > 0 && (
          <span className="text-emerald-400/70">✓ {knownCards.size} đã nhớ</span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/80 transition-all duration-300"
          style={{ width: `${((idx + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center transition-all hover:bg-white/[0.05] active:scale-[0.99]"
        style={{ minHeight: '200px' }}
      >
        <div className="mb-4 text-xs text-white/30">
          {flipped ? '✓ MẶT SAU — ĐÁP ÁN' : '📖 MẶT TRƯỚC — CÂU HỎI'}
        </div>
        <p className="text-lg leading-relaxed">{flipped ? cards[idx].back : cards[idx].front}</p>
        {!flipped && (
          <p className="mt-4 text-xs text-white/20">Nhấn để lật thẻ</p>
        )}
      </button>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={handlePrev}
          variant="ghost"
          disabled={idx === 0}
          className="text-white/50"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Trước
        </Button>
        {flipped && (
          <Button
            onClick={handleKnown}
            variant="ghost"
            className="text-emerald-400/70 hover:text-emerald-400"
          >
            ✓ Đã nhớ
          </Button>
        )}
        <Button
          onClick={handleNext}
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

/* ─── Fill-in-the-Blank Mode ─── */

function FillBlankMode({ items }: { items: Array<{ sentence: string; answer: string; hint?: string }> }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [userInput, setUserInput] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const handleCheck = (i: number) => {
    setChecked((prev) => new Set(prev).add(i))
  }

  const handleReveal = (i: number) => {
    setRevealed((prev) => new Set(prev).add(i))
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isChecked = checked.has(i)
        const isRevealed = revealed.has(i)
        const userAnswer = userInput[i]?.trim().toLowerCase()
        const correctAnswer = item.answer.trim().toLowerCase()
        const isCorrect = isChecked && userAnswer === correctAnswer

        return (
          <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
            <div className="mb-1 text-xs text-white/30">Câu {i + 1}</div>
            <p className="text-sm leading-relaxed text-white/70">
              {item.sentence.split('___').map((part, j, arr) => (
                <span key={j}>
                  {part}
                  {j < arr.length - 1 && (
                    <span className="inline-block min-w-[80px] border-b-2 border-dashed border-white/20 px-1">
                      {isRevealed ? (
                        <span className="text-emerald-400 font-medium">{item.answer}</span>
                      ) : (
                        <input
                          type="text"
                          value={userInput[i] || ''}
                          onChange={(e) => setUserInput((prev) => ({ ...prev, [i]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && userInput[i]?.trim() && handleCheck(i)}
                          placeholder={item.hint || '___'}
                          disabled={isChecked || isRevealed}
                          className="w-24 bg-transparent text-center text-emerald-400 outline-none placeholder:text-white/15 disabled:opacity-50"
                        />
                      )}
                    </span>
                  )}
                </span>
              ))}
            </p>

            {/* Actions */}
            <div className="mt-3 flex items-center gap-3">
              {!isChecked && !isRevealed && userInput[i]?.trim() && (
                <button
                  onClick={() => handleCheck(i)}
                  className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  Kiểm tra
                </button>
              )}
              {!isRevealed && (
                <button
                  onClick={() => handleReveal(i)}
                  className="text-xs text-white/20 transition-colors hover:text-white/40"
                >
                  Xem đáp án
                </button>
              )}
            </div>

            {/* Result */}
            {isChecked && !isRevealed && (
              <div className={`mt-2 rounded-lg p-2 text-xs ${
                isCorrect ? 'bg-emerald-500/5 text-emerald-400' : 'bg-amber-500/5 text-amber-400'
              }`}>
                {isCorrect ? '✓ Chính xác!' : `✗ Đáp án đúng: ${item.answer}`}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Quiz Mode ─── */

function QuizMode({ items }: { items: Array<{ question: string; options: string[]; correct: number; explanation: string }> }) {
  const [selected, setSelected] = useState<Record<number, number>>({})
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null)

  const allAnswered = Object.keys(selected).length === items.length

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (selected[qIdx] !== undefined) return
    setSelected((prev) => ({ ...prev, [qIdx]: optIdx }))
  }

  const handleFinish = () => {
    const correct = items.filter((item, i) => selected[i] === item.correct).length
    setScore({ correct, total: items.length })
  }

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
                    onClick={() => handleSelect(i, j)}
                    disabled={isAnswered}
                    className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-all ${cls}`}
                  >
                    <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 text-[10px]">
                      {String.fromCharCode(65 + j)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {isAnswered && (
              <div className={`mt-3 rounded-lg p-3 text-xs ${
                userAnswer === item.correct ? 'bg-emerald-500/5 text-emerald-400' : 'bg-red-500/5 text-red-400'
              }`}>
                {userAnswer === item.correct ? '✓ Chính xác!' : '✗ Chưa đúng.'} {item.explanation}
              </div>
            )}
          </div>
        )
      })}

      {/* Score */}
      {allAnswered && !score && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleFinish}
            className="rounded-full bg-emerald-500 px-6 py-2 text-black hover:bg-emerald-400"
          >
            Xem kết quả
          </Button>
        </div>
      )}

      {score && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
          <p className="text-3xl font-bold text-emerald-400">
            {score.correct}/{score.total}
          </p>
          <p className="mt-2 text-sm text-white/50">
            {score.correct === score.total
              ? '🎉 Hoàn hảo! Bạn đã trả lời đúng tất cả!'
              : score.correct >= score.total * 0.7
              ? '👍 Tốt lắm! Bạn nắm được phần lớn nội dung.'
              : '📚 Cần ôn lại thêm. Hãy thử lại nhé!'}
          </p>
          <Button
            onClick={() => { setSelected({}); setScore(null) }}
            variant="ghost"
            className="mt-4 text-emerald-400/70 hover:text-emerald-400"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Làm lại
          </Button>
        </div>
      )}
    </div>
  )
}

/* ─── Summary Mode ─── */

function SummaryMode({ items }: { items: Array<{ point: string; detail: string }> }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs text-emerald-400">
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

/* ─── Match Mode ─── */

function MatchMode({ items }: { items: Array<{ term: string; definition: string }> }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [shuffled, setShuffled] = useState(false)
  const [displayItems, setDisplayItems] = useState(items)
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set())
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [selectedRight, setSelectedRight] = useState<number | null>(null)

  const handleShuffle = () => {
    const shuffledDefs = [...items].sort(() => Math.random() - 0.5)
    setDisplayItems(shuffledDefs)
    setShuffled(true)
    setRevealed(new Set())
    setMatchedPairs(new Set())
    setSelectedLeft(null)
    setSelectedRight(null)
  }

  const handleLeftClick = (i: number) => {
    if (matchedPairs.has(i)) return
    setSelectedLeft(i)
    if (selectedRight !== null) {
      // Check if they match
      const leftTerm = displayItems[i].term
      const rightDef = displayItems[selectedRight].definition
      const originalItem = items.find((item) => item.term === leftTerm && item.definition === rightDef)
      if (originalItem) {
        setMatchedPairs((prev) => new Set(prev).add(i).add(selectedRight))
      }
      setSelectedRight(null)
    }
  }

  const handleRightClick = (i: number) => {
    if (matchedPairs.has(i)) return
    setSelectedRight(i)
    if (selectedLeft !== null) {
      // Check if they match
      const leftTerm = displayItems[selectedLeft].term
      const rightDef = displayItems[i].definition
      const originalItem = items.find((item) => item.term === leftTerm && item.definition === rightDef)
      if (originalItem) {
        setMatchedPairs((prev) => new Set(prev).add(selectedLeft).add(i))
      }
      setSelectedLeft(null)
    }
  }

  const allRevealed = revealed.size === items.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/30">
          {matchedPairs.size > 0
            ? `Đã nối ${matchedPairs.size / 2}/${items.length} cặp`
            : 'Nhấn để xem đáp án nối, hoặc nhấn 2 ô để nối cặp'}
        </p>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1 text-xs text-white/30 transition-colors hover:text-white/50"
        >
          <Shuffle className="h-3 w-3" /> Xáo trộn
        </button>
      </div>

      <div className="space-y-2">
        {displayItems.map((item, i) => {
          const isMatched = matchedPairs.has(i)
          const isRevealed = revealed.has(i)

          return (
            <button
              key={i}
              onClick={() => {
                if (!isRevealed) setRevealed((prev) => new Set(prev).add(i))
              }}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                isMatched
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div className={`flex-1 rounded-lg px-3 py-2 text-sm ${isMatched ? 'bg-emerald-500/10' : 'bg-white/5'}`}>
                {item.term}
              </div>
              <div className="text-white/20">
                {isRevealed || isMatched ? '⟷' : '→'}
              </div>
              <div className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                isRevealed || isMatched
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-white/[0.02] text-white/20'
              }`}>
                {(isRevealed || isMatched) ? item.definition : '???'}
              </div>
            </button>
          )
        })}
      </div>

      {allRevealed && (
        <div className="text-center text-xs text-emerald-400/50 pt-2">
          ✓ Đã xem tất cả đáp án
        </div>
      )}
    </div>
  )
}
