'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const StudyTool = dynamic(() => import('@/components/study/StudyTool'), { ssr: false })

export default function StudyPage() {
  const router = useRouter()

  return <StudyTool onBack={() => router.push('/')} />
}
