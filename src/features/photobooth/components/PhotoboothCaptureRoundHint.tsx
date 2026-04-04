'use client'

import { useEffect, useState } from 'react'
import {
  getPhotoboothCaptureRoundLabel,
  readPhotoboothRuntimeSession,
} from '@/src/features/photobooth/utils/runtimeSession'

export default function PhotoboothCaptureRoundHint() {
  const [roundLabel, setRoundLabel] = useState('')

  useEffect(() => {
    const session = readPhotoboothRuntimeSession()
    const nextLabel = getPhotoboothCaptureRoundLabel(session)

    setRoundLabel(nextLabel)
  }, [])

  if (!roundLabel) {
    return null
  }

  return (
    <div className="mt-1 text-center text-[12px] font-medium leading-none text-[#7A7A7A]">
      {roundLabel}
    </div>
  )
}