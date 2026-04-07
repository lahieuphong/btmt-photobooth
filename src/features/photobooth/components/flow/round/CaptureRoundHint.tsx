'use client'

import { useState } from 'react'
import {
  getPhotoboothCaptureRoundLabel,
  readPhotoboothRuntimeSession,
} from '@/src/features/photobooth/utils/runtimeSession'

export default function PhotoboothCaptureRoundHint() {
  const [roundLabel] = useState(() => {
    const session = readPhotoboothRuntimeSession()
    return getPhotoboothCaptureRoundLabel(session)
  })

  if (!roundLabel) {
    return null
  }

  return (
    <div className="mt-1 text-center text-[12px] font-medium leading-none text-[#7A7A7A]">
      {roundLabel}
    </div>
  )
}
