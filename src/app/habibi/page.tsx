'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const ChatHabibi = dynamic(() => import('@/components/chat/ChatHabibi'), { ssr: false })

export default function HabibiPage() {
  const router = useRouter()

  return <ChatHabibi onBack={() => router.push('/')} />
}
