import { NextRequest } from 'next/server'

const MODE_PROMPTS: Record<string, string> = {
  chat: `Bạn là Habibi — trợ lý AI thân thiện, thông minh của P-ShareHub. Bạn trả lời bằng tiếng Việt, giải thích dễ hiểu, ngắn gọn nhưng đầy đủ. Bạn luôn lịch sự, nhiệt tình và sẵn sàng giúp đỡ. Nếu người dùng hỏi về lập trình, bạn viết code rõ ràng có chú thích. Nếu hỏi kiến thức chung, bạn trả lời chính xác, có cấu trúc. Bạn có thể sử dụng emoji nhẹ nhàng để tạo sự thân thiện.`,

  'build-web': `Bạn là Habibi — chuyên gia xây dựng website. Nhiệm vụ DUY NHẤT của bạn là giúp người dùng xây website. Bạn chỉ trả lời về: HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS, Node.js, thiết kế web, UI/UX, deploy, hosting, domain. Khi người dùng hỏi ngoài lĩnh vực web, bạn lịch sự từ chối và hướng họ về chủ đề web. Bạn luôn đưa ra code mẫu cụ thể, giải thích từng bước, và gợi ý best practices. Trả lời bằng tiếng Việt.`,

  study: `Bạn là Habibi — gia sư AI chuyên biệt cho việc học tập. Nhiệm vụ DUY NHẤT của bạn là giúp người dùng HỌC: giải thích khái niệm, tạo bài tập, soạn flashcard, tóm tắt nội dung, luyện tập, ôn tập. Khi người dùng hỏi ngoài học tập, bạn lịch sự từ chối và hướng họ về việc học. Bạn luôn giải thích theo cách dễ hiểu nhất, dùng ví dụ thực tế, so sánh, và phép ẩn dụ. Bạn tạo bài tập từ cơ bản đến nâng cao. Trả lời bằng tiếng Việt.`,

  create: `Bạn là Habibi — chuyên gia sáng tạo nội dung AI. Nhiệm vụ DUY NHẤT của bạn là giúp người dùng SÁNG TẠO: viết thơ, truyện, kịch bản, bài hát, slogan, nội dung marketing, thiết kế concept, brainstorm ý tưởng. Khi người dùng hỏi ngoài sáng tạo, bạn lịch sự từ chối và hướng họ về sáng tạo. Bạn luôn đưa ra nhiều lựa chọn, phong cách đa dạng, và khuyến khích sự sáng tạo. Trả lời bằng tiếng Việt.`,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, mode = 'chat', history = [] } = body

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.chat

    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()

    const messages: Array<{ role: string; content: string }> = [
      { role: 'assistant', content: systemPrompt },
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    // Try streaming first, fallback to non-streaming
    try {
      const stream = await zai.chat.completions.create({
        messages,
        stream: true,
      })

      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          let thinkingContent = ''
          let isThinking = true
          let buffer = ''

          try {
            for await (const chunk of stream) {
              // Convert chunk to string
              let text = ''
              if (typeof chunk === 'string') {
                text = chunk
              } else if (chunk && typeof chunk === 'object') {
                // Handle char-code indexed objects (SDK streaming format)
                if ('0' in chunk) {
                  const vals = Object.values(chunk) as number[]
                  text = String.fromCharCode(...vals)
                } else if (Buffer.isBuffer(chunk)) {
                  text = chunk.toString('utf-8')
                } else if (typeof chunk.toString === 'function') {
                  const str = chunk.toString()
                  if (str !== '[object Object]') {
                    text = str
                  }
                }
              }

              if (!text) continue
              buffer += text
              const lines = buffer.split('\n')
              buffer = lines.pop() || ''

              for (const line of lines) {
                const trimmed = line.trim()
                if (!trimmed || !trimmed.startsWith('data: ')) continue

                const data = trimmed.slice(6)
                if (data === '[DONE]') continue

                try {
                  const parsed = JSON.parse(data)
                  const delta = parsed.choices?.[0]?.delta
                  if (!delta) continue

                  const thinking = delta.reasoning_content || delta.thinking_content
                  if (thinking) {
                    thinkingContent += thinking
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: 'thinking', content: thinking, fullThinking: thinkingContent })}\n\n`
                      )
                    )
                  }

                  if (delta.content) {
                    if (isThinking) {
                      isThinking = false
                      controller.enqueue(
                        encoder.encode(
                          `data: ${JSON.stringify({ type: 'thinking_end', fullThinking: thinkingContent })}\n\n`
                        )
                      )
                    }
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: 'content', content: delta.content })}\n\n`
                      )
                    )
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }

            // Process remaining buffer
            if (buffer.trim().startsWith('data: ')) {
              const data = buffer.trim().slice(6)
              if (data !== '[DONE]') {
                try {
                  const parsed = JSON.parse(data)
                  const delta = parsed.choices?.[0]?.delta
                  if (delta?.content) {
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ type: 'content', content: delta.content })}\n\n`
                      )
                    )
                  }
                } catch {
                  // Skip
                }
              }
            }

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
            )
          } catch (err) {
            console.error('Stream processing error:', err)
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'error', content: 'Đã xảy ra lỗi khi tạo phản hồi.' })}\n\n`
              )
            )
          }

          controller.close()
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    } catch {
      // Streaming failed, try non-streaming as fallback
      console.log('Streaming failed, trying non-streaming fallback')
    }

    // Non-streaming fallback
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    })

    const content = completion.choices?.[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.'

    return new Response(JSON.stringify({ content }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    console.error('Chat API error:', error)
    const msg = error instanceof Error ? error.message : 'Unknown error'
    const isRateLimit = msg.includes('429')
    return new Response(
      JSON.stringify({
        error: isRateLimit
          ? 'AI đang quá tải, vui lòng thử lại sau vài giây.'
          : 'Không thể kết nối đến AI. Vui lòng thử lại.',
      }),
      {
        status: isRateLimit ? 429 : 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
