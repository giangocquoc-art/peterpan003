import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { content, difficulty = 'medium', questionCount = 5, studyModes = ['flashcard'] } = body

    if (!content || typeof content !== 'string') {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const difficultyLabels: Record<string, string> = {
      easy: 'dễ (cơ bản, phù hợp người mới bắt đầu)',
      medium: 'trung bình (phù hợp người đã có nền tảng)',
      hard: 'khó (nâng cao, yêu cầu hiểu sâu)',
    }

    const modeDescriptions: Record<string, string> = {
      flashcard: 'Flashcard (thẻ ghi nhớ): Mỗi thẻ có mặt trước (câu hỏi/thuật ngữ) và mặt sau (đáp án/định nghĩa). Tạo flashcard giúp ghi nhớ nhanh.',
      fillBlank: 'Điền chỗ trống: Tạo các câu có chỗ trống cần điền, kèm đáp án.',
      quiz: 'Trắc nghiệm: Câu hỏi trắc nghiệm với 4 lựa chọn A-B-C-D, chỉ 1 đáp án đúng. Ghi rõ đáp án và giải thích.',
      summary: 'Tóm tắt nội dung: Tóm tắt ý chính thành các bullet point ngắn gọn, dễ nhớ.',
      match: 'Nối cặp: Tạo danh sách các cặp thuật ngữ - định nghĩa để người dùng nối.',
    }

    const selectedModes = studyModes
      .map((m: string) => modeDescriptions[m])
      .filter(Boolean)
      .join('\n- ')

    const prompt = `Bạn là một chuyên gia sư phạm. Dựa trên nội dung sau, hãy tạo tài liệu học tập.

NỘI DUNG:
${content}

YÊU CẦU:
- Mức độ: ${difficultyLabels[difficulty] || difficultyLabels.medium}
- Số lượng câu hỏi: ${questionCount}
- Các loại bài học cần tạo:
- ${selectedModes}

Hãy trả về kết quả theo format JSON sau (KHÔNG thêm markdown code block, chỉ trả về JSON thuần):
{
  "title": "Tiêu đề bài học",
  "flashcard": [
    {"front": "Câu hỏi/thuật ngữ", "back": "Đáp án/định nghĩa"}
  ],
  "fillBlank": [
    {"sentence": "Câu với ___ để điền", "answer": "đáp án", "hint": "gợi ý (nếu có)"}
  ],
  "quiz": [
    {"question": "Câu hỏi", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correct": 0, "explanation": "Giải thích"}
  ],
  "summary": [
    {"point": "Ý chính", "detail": "Chi tiết ngắn gọn"}
  ],
  "match": [
    {"term": "Thuật ngữ", "definition": "Định nghĩa"}
  ]
}

Chỉ tạo các loại bài học được yêu cầu. Các loại không được yêu cầu để mảng rỗng [].
Số lượng câu hỏi cho mỗi loại khoảng ${questionCount} mục.`

    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'Bạn là chuyên gia sư phạm, tạo tài liệu học tập chất lượng cao theo format JSON yêu cầu.' },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    })

    let responseText = completion.choices?.[0]?.message?.content || ''

    // Clean up markdown code blocks if present
    responseText = responseText.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '').trim()

    try {
      const parsed = JSON.parse(responseText)
      return new Response(JSON.stringify({ success: true, data: parsed }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse AI response', raw: responseText }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  } catch (error) {
    console.error('Study tool API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
