/**
 * Study Engine — Open-source text analysis algorithms (NO AI)
 * 
 * Generates study materials from text content using:
 * - TF-IDF-inspired keyword extraction
 * - Sentence scoring (TextRank-like)
 * - Definition pattern matching
 * - Cloze deletion (fill-in-the-blank)
 * - Distractor generation for quizzes
 * 
 * All processing happens client-side. No data is sent to any server.
 */

// ─── Types ───

export type Difficulty = 'easy' | 'medium' | 'hard'
export type StudyMode = 'flashcard' | 'fillBlank' | 'quiz' | 'summary' | 'match'

export interface StudyData {
  title: string
  flashcard: Array<{ front: string; back: string }>
  fillBlank: Array<{ sentence: string; answer: string; hint?: string }>
  quiz: Array<{ question: string; options: string[]; correct: number; explanation: string }>
  summary: Array<{ point: string; detail: string }>
  match: Array<{ term: string; definition: string }>
}

interface SentenceInfo {
  text: string
  index: number
  score: number
  words: string[]
}

// ─── Vietnamese Stop Words ───

const STOP_WORDS = new Set([
  'và', 'của', 'là', 'được', 'có', 'không', 'những', 'các', 'một', 'đã',
  'để', 'với', 'từ', 'cũng', 'này', 'đó', 'cho', 'về', 'như', 'khi',
  'nếu', 'mà', 'thì', 'bị', 'bởi', 'rất', 'nhiều', 'ít', 'nữa', 'ra',
  'vào', 'lên', 'xuống', 'qua', 'tới', 'đến', 'trong', 'ngoài', 'trên',
  'dưới', 'giữa', 'sau', 'trước', 'nhưng', 'mà', 'hay', 'hoặc', 'vì',
  'nên', 'do', 'tuy', 'dù', 'cả', 'mỗi', 'tất', 'cả', 'vẫn', 'đang',
  'sẽ', 'phải', 'nên', 'thể', 'đây', 'kia', 'thế', 'sao', 'nào', 'đâu',
  'ai', 'gì', 'nào', 'bao', 'lúc', 'làm', 'đi', 'để', 'ông', 'bà',
  'anh', 'chị', 'em', 'ta', 'mình', 'chúng', 'họ', 'nó', 'cái',
  'việc', 'cách', 'nơi', 'ngày', 'năm', 'tháng', 'thời', 'khoảng',
  'hơn', 'khoảng', 'chỉ', 'cùng', 'theo', 'qua', 'về', 'lại', 'mới',
  'đây', 'này', 'kia', 'đó', 'thế', 'nhé', 'ạ', 'ờ', 'ùm',
  'also', 'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare',
  'it', 'its', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we',
  'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'they', 'them',
  'their', 'what', 'which', 'who', 'whom', 'where', 'when', 'how', 'why',
  'and', 'or', 'but', 'not', 'no', 'nor', 'for', 'yet', 'so', 'in', 'on',
  'at', 'to', 'of', 'by', 'with', 'from', 'as', 'into', 'through',
])

// ─── Text Preprocessing ───

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/giu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
}

function splitSentences(text: string): string[] {
  // Split on sentence-ending punctuation, keeping Vietnamese context
  return text
    .replace(/\n{2,}/g, '.\n')
    .split(/(?<=[.!?。！？])\s+|\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15) // skip very short fragments
}

// ─── TF-IDF-inspired Scoring ───

function computeWordFrequency(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>()
  for (const t of tokens) {
    freq.set(t, (freq.get(t) || 0) + 1)
  }
  return freq
}

function scoreSentences(
  sentences: string[],
  wordFreq: Map<string, number>
): SentenceInfo[] {
  return sentences.map((text, index) => {
    const words = tokenize(text)
    const score = words.reduce((sum, w) => sum + (wordFreq.get(w) || 0), 0) / Math.max(words.length, 1)
    return { text, index, score, words }
  })
}

// ─── Definition Pattern Extraction ───

interface DefinitionPair {
  term: string
  definition: string
  confidence: number
}

function extractDefinitions(text: string): DefinitionPair[] {
  const results: DefinitionPair[] = []

  // Pattern 1: "X là Y" (X is Y)
  const laPattern = /([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ-]{2,40}?)\s+là\s+(.+?)(?:\.|;|\n|$)/giu
  let match: RegExpExecArray | null
  while ((match = laPattern.exec(text)) !== null) {
    const term = match[1].trim()
    const definition = match[2].trim()
    if (term.length >= 2 && definition.length >= 5) {
      results.push({ term, definition, confidence: 0.9 })
    }
  }

  // Pattern 2: "X - Y" or "X: Y" (term - definition)
  const dashPattern = /(?:^|\n|•|-)\s*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẠẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ-]{2,35}?)\s*[-:–—]\s*(.+?)(?:\.|;|\n|$)/gimu
  while ((match = dashPattern.exec(text)) !== null) {
    const term = match[1].trim()
    const definition = match[2].trim()
    if (term.length >= 2 && definition.length >= 5 && !results.some((r) => r.term === term)) {
      results.push({ term, definition, confidence: 0.7 })
    }
  }

  // Pattern 3: "X được gọi là Y" (X is called Y)
  const goiLaPattern = /([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẠẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ-]{2,40}?)\s+được gọi là\s+(.+?)(?:\.|;|\n|$)/giu
  while ((match = goiLaPattern.exec(text)) !== null) {
    const term = match[1].trim()
    const definition = match[2].trim()
    if (term.length >= 2 && definition.length >= 5) {
      results.push({ term, definition, confidence: 0.85 })
    }
  }

  // Pattern 4: Numbered list items "1. X: Y" or "1) X - Y"
  const numberedPattern = /(?:^|\n)\s*\d+[.)]\s*([A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẠẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ-]{2,35}?)\s*[-:–—]\s*(.+?)(?:\.|;|\n|$)/gimu
  while ((match = numberedPattern.exec(text)) !== null) {
    const term = match[1].trim()
    const definition = match[2].trim()
    if (term.length >= 2 && definition.length >= 5 && !results.some((r) => r.term === term)) {
      results.push({ term, definition, confidence: 0.75 })
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence)
}

// ─── Keyword Extraction ───

function extractKeywords(text: string, count: number): string[] {
  const tokens = tokenize(text)
  const freq = computeWordFrequency(tokens)
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word)
}

function extractCapitalizedTerms(text: string): string[] {
  const terms = new Set<string>()
  // Match capitalized words/phrases (proper nouns in Vietnamese)
  const pattern = /[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẠẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][\wàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ-]+(?:\s+[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẠẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][\wàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ-]+)*/gu
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text)) !== null) {
    const term = match[0].trim()
    if (term.length >= 3 && term.length <= 50 && !STOP_WORDS.has(term.toLowerCase())) {
      terms.add(term)
    }
  }
  return Array.from(terms)
}

// ─── Title Extraction ───

function extractTitle(text: string): string {
  const firstLine = text.split('\n')[0]?.trim() || 'Bài học'
  if (firstLine.length <= 80) return firstLine
  return firstLine.substring(0, 77) + '...'
}

// ─── Generate Flashcards ───

function generateFlashcards(
  text: string,
  definitions: DefinitionPair[],
  count: number,
  difficulty: Difficulty
): Array<{ front: string; back: string }> {
  const cards: Array<{ front: string; back: string }> = []

  // First: use extracted definitions
  for (const def of definitions) {
    if (cards.length >= count) break
    cards.push({
      front: `${def.term} là gì?`,
      back: def.definition,
    })
  }

  // If not enough, create from sentences with keywords
  if (cards.length < count) {
    const sentences = splitSentences(text)
    const keywords = extractKeywords(text, 30)
    const capitalized = extractCapitalizedTerms(text)

    for (const sentence of sentences) {
      if (cards.length >= count) break

      // Find a keyword in the sentence to create a question
      const sentenceLower = sentence.toLowerCase()
      let foundKeyword = ''
      for (const kw of [...capitalized, ...keywords]) {
        if (sentenceLower.includes(kw.toLowerCase()) && kw.length >= 3) {
          foundKeyword = kw
          break
        }
      }

      if (foundKeyword && sentence.length > 20) {
        // Check if we already have this
        const front = `Định nghĩa: ${foundKeyword}`
        if (!cards.some((c) => c.front === front)) {
          const backText = difficulty === 'easy'
            ? sentence.split('.').slice(0, 2).join('.').trim()
            : sentence
          cards.push({
            front,
            back: backText.length > 200 ? backText.substring(0, 197) + '...' : backText,
          })
        }
      }
    }
  }

  return cards.slice(0, count)
}

// ─── Generate Fill-in-the-Blank (Cloze Deletion) ───

function generateFillBlanks(
  text: string,
  definitions: DefinitionPair[],
  count: number,
  difficulty: Difficulty
): Array<{ sentence: string; answer: string; hint?: string }> {
  const items: Array<{ sentence: string; answer: string; hint?: string }> = []
  const sentences = splitSentences(text)
  const capitalized = extractCapitalizedTerms(text)
  const keywords = extractKeywords(text, 40)

  // Priority words to blank out
  const blankTargets = difficulty === 'easy'
    ? capitalized.slice(0, 20) // Easy: proper nouns
    : difficulty === 'medium'
    ? [...capitalized.slice(0, 10), ...keywords.slice(0, 20)] // Medium: proper nouns + keywords
    : keywords.slice(0, 30) // Hard: general keywords

  for (const sentence of sentences) {
    if (items.length >= count) break
    if (sentence.length < 25) continue

    const sentenceLower = sentence.toLowerCase()
    let blankWord = ''
    let hint = ''

    for (const target of blankTargets) {
      const targetLower = target.toLowerCase()
      if (sentenceLower.includes(targetLower) && target.length >= 3) {
        blankWord = target
        // Generate hint (first letter + ___)
        hint = target[0] + '_'.repeat(target.length - 1)
        break
      }
    }

    if (blankWord) {
      // Replace the word with ___ in the sentence (case-insensitive)
      const regex = new RegExp(blankWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      const blankedSentence = sentence.replace(regex, '___')

      if (blankedSentence !== sentence) { // Ensure replacement actually happened
        items.push({
          sentence: blankedSentence,
          answer: blankWord,
          hint: difficulty !== 'hard' ? hint : undefined,
        })
      }
    }
  }

  // Also use definitions for fill-in-the-blank
  for (const def of definitions) {
    if (items.length >= count) break
    if (def.definition.length < 15) continue

    const defLower = def.definition.toLowerCase()
    const termLower = def.term.toLowerCase()
    if (defLower.includes(termLower)) {
      const regex = new RegExp(def.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const blanked = def.definition.replace(regex, '___')
      if (blanked !== def.definition) {
        items.push({
          sentence: blanked,
          answer: def.term,
          hint: def.term[0] + '_'.repeat(def.term.length - 1),
        })
      }
    }
  }

  return items.slice(0, count)
}

// ─── Generate Quizzes ───

function generateQuizzes(
  text: string,
  definitions: DefinitionPair[],
  count: number,
  difficulty: Difficulty
): Array<{ question: string; options: string[]; correct: number; explanation: string }> {
  const quizzes: Array<{ question: string; options: string[]; correct: number; explanation: string }> = []

  // Use definitions to create quizzes
  const availableDefs = definitions.filter((d) => d.definition.length >= 10)

  for (let i = 0; i < Math.min(availableDefs.length, count); i++) {
    const def = availableDefs[i]

    // Generate distractors from other definitions
    const distractors = availableDefs
      .filter((d) => d.term !== def.term)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((d) => d.definition.length > 60 ? d.definition.substring(0, 57) + '...' : d.definition)

    // If not enough distractors from definitions, create generic ones
    while (distractors.length < 3) {
      distractors.push('Không có thông tin liên quan')
    }

    const correctAnswer = def.definition.length > 60
      ? def.definition.substring(0, 57) + '...'
      : def.definition

    // Shuffle options
    const options = [correctAnswer, ...distractors]
    const correct = Math.floor(Math.random() * options.length)
    // Swap correct to random position
    ;[options[0], options[correct]] = [options[correct], options[0]]

    quizzes.push({
      question: `${def.term} là gì?`,
      options: options.map((o) => o.substring(0, 100)),
      correct,
      explanation: `${def.term}: ${def.definition.substring(0, 150)}`,
    })
  }

  // If not enough from definitions, create True/False style from sentences
  if (quizzes.length < count) {
    const sentences = splitSentences(text).filter((s) => s.length > 30 && s.length < 200)
    const capitalized = extractCapitalizedTerms(text)

    for (const sentence of sentences) {
      if (quizzes.length >= count) break

      // Create a "Which is correct?" style question
      const sentenceLower = sentence.toLowerCase()
      let foundTerm = ''
      for (const term of capitalized) {
        if (sentenceLower.includes(term.toLowerCase()) && term.length >= 3) {
          foundTerm = term
          break
        }
      }

      if (!foundTerm) continue

      // Create question by removing the term
      const regex = new RegExp(foundTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const question = sentence.replace(regex, '___')

      // Create wrong options by using other terms
      const wrongOptions = capitalized
        .filter((t) => t !== foundTerm)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      while (wrongOptions.length < 3) {
        wrongOptions.push('Không xác định')
      }

      const options = [foundTerm, ...wrongOptions]
      const correct = Math.floor(Math.random() * options.length)
      ;[options[0], options[correct]] = [options[correct], options[0]]

      quizzes.push({
        question: `Điền vào chỗ trống: ${question}`,
        options,
        correct,
        explanation: `Đáp án đúng: ${foundTerm}. ${sentence.substring(0, 100)}`,
      })
    }
  }

  return quizzes.slice(0, count)
}

// ─── Generate Summary ───

function generateSummary(
  text: string,
  count: number,
  difficulty: Difficulty
): Array<{ point: string; detail: string }> {
  const sentences = splitSentences(text)
  const allTokens = tokenize(text)
  const wordFreq = computeWordFrequency(allTokens)
  const scored = scoreSentences(sentences, wordFreq)

  // Sort by score, take top N
  const topSentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count * 2)

  // Re-sort by original order for coherence
  const ordered = topSentences.sort((a, b) => a.index - b.index)

  return ordered.slice(0, count).map((s) => {
    const words = s.words
    const detailLength = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 80 : 120

    // Try to extract a key point (short phrase)
    let point = s.text
    if (s.text.includes(':')) {
      point = s.text.split(':')[0].trim()
    } else if (s.text.includes(' - ')) {
      point = s.text.split(' - ')[0].trim()
    } else if (s.text.length > 60) {
      // Find the first clause
      const commaIdx = s.text.indexOf(',')
      if (commaIdx > 10 && commaIdx < 60) {
        point = s.text.substring(0, commaIdx).trim()
      } else {
        point = s.text.substring(0, 55).trim() + '...'
      }
    }

    return {
      point: point.length > 80 ? point.substring(0, 77) + '...' : point,
      detail: s.text.length > detailLength
        ? s.text.substring(0, detailLength - 3) + '...'
        : s.text,
    }
  })
}

// ─── Generate Match Pairs ───

function generateMatchPairs(
  text: string,
  definitions: DefinitionPair[],
  count: number
): Array<{ term: string; definition: string }> {
  const pairs: Array<{ term: string; definition: string }> = []

  // Use definitions first
  for (const def of definitions) {
    if (pairs.length >= count) break
    pairs.push({
      term: def.term,
      definition: def.definition.length > 80
        ? def.definition.substring(0, 77) + '...'
        : def.definition,
    })
  }

  // If not enough, extract from capitalized terms + context
  if (pairs.length < count) {
    const sentences = splitSentences(text)
    const capitalized = extractCapitalizedTerms(text)

    for (const term of capitalized) {
      if (pairs.length >= count) break
      if (pairs.some((p) => p.term === term)) continue

      // Find a sentence containing this term
      const matchingSentence = sentences.find((s) =>
        s.toLowerCase().includes(term.toLowerCase()) && s.length > 20
      )

      if (matchingSentence) {
        pairs.push({
          term,
          definition: matchingSentence.length > 80
            ? matchingSentence.substring(0, 77) + '...'
            : matchingSentence,
        })
      }
    }
  }

  return pairs.slice(0, count)
}

// ─── Main Generate Function ───

export function generateStudy(
  content: string,
  difficulty: Difficulty,
  questionCount: number,
  studyModes: StudyMode[]
): StudyData {
  const text = content.trim()
  const definitions = extractDefinitions(text)
  const title = extractTitle(text)

  const data: StudyData = {
    title,
    flashcard: [],
    fillBlank: [],
    quiz: [],
    summary: [],
    match: [],
  }

  for (const mode of studyModes) {
    switch (mode) {
      case 'flashcard':
        data.flashcard = generateFlashcards(text, definitions, questionCount, difficulty)
        break
      case 'fillBlank':
        data.fillBlank = generateFillBlanks(text, definitions, questionCount, difficulty)
        break
      case 'quiz':
        data.quiz = generateQuizzes(text, definitions, questionCount, difficulty)
        break
      case 'summary':
        data.summary = generateSummary(text, questionCount, difficulty)
        break
      case 'match':
        data.match = generateMatchPairs(text, definitions, questionCount)
        break
    }
  }

  return data
}

// ─── PDF Text Extraction (Client-Side) ───

export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')

  if (typeof window !== 'undefined') {
    const workerUrl = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url)
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl.toString()
  }

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useWorkerFetch: false,
    disableFontFace: true,
  })
  const pdf = await loadingTask.promise

  const textParts: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent({ includeMarkedContent: false })
    const pageText = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (pageText) textParts.push(pageText)
  }

  const extracted = textParts.join('\n\n').trim()
  if (!extracted) {
    throw new Error('PDF này có thể là bản scan/ảnh nên không có lớp chữ để trích xuất. Vui lòng dùng PDF có text hoặc dán nội dung trực tiếp.')
  }

  return extracted
}

// ─── TXT/Text File Extraction ───

export async function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}
