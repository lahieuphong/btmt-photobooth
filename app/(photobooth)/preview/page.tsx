'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/flow/round/CaptureRoundHint'
import PhotoboothDualActionBar from '@/src/features/photobooth/components/flow/actions/DualActionBar'
import PreviewLayoutBlock from '@/src/features/photobooth/components/screens/preview/PreviewLayoutBlock'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import {
  completePhotoboothCaptureRound,
  getPreviewNextRoute,
  readPhotoboothRuntimeSession,
} from '@/src/features/photobooth/utils/runtimeSession'
import { getPhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'

export default function PreviewPage() {
  const router = useRouter()
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.preview

  const [selectedLayoutId, setSelectedLayoutId] = useState(
    PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId
  )
  const [captureRoundsRequired, setCaptureRoundsRequired] = useState(1)
  const [captureRoundsCompleted, setCaptureRoundsCompleted] = useState(0)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const session = readPhotoboothRuntimeSession()

      setSelectedLayoutId(session.selectedLayoutId)
      setCaptureRoundsRequired(session.captureRoundsRequired)
      setCaptureRoundsCompleted(session.captureRoundsCompleted)
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  const previewMode = useMemo(
    () => getPhotoboothLayoutPreviewMode(selectedLayoutId),
    [selectedLayoutId]
  )

  const currentRound = useMemo(() => {
    return Math.min(captureRoundsCompleted + 1, captureRoundsRequired)
  }, [captureRoundsCompleted, captureRoundsRequired])

  const isLastPreviewRound = useMemo(() => {
    return currentRound >= captureRoundsRequired
  }, [currentRound, captureRoundsRequired])

  const primaryActionLabel = isLastPreviewRound
    ? screen.primaryActionLabel
    : screen.primaryActionContinueLabel

  function handleConfirmPreview() {
    const updatedSession = completePhotoboothCaptureRound()
    const nextRoute = getPreviewNextRoute(updatedSession)

    router.push(nextRoute)
  }

  function handleRetakeAll() {
    router.push(screen.secondaryActionHref ?? '/capture')
  }

  return (
    <PhotoboothScreenShell>
      <div className="flex h-full min-h-0 flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
          titleBottomSlot={<PhotoboothCaptureRoundHint />}
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-hidden px-[4.8%] pt-[1.8%] pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div
            className="mx-auto flex min-h-0 w-full max-w-[900px] flex-1 flex-col"
            style={{ containerType: 'inline-size' }}
          >
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="mt-3 min-h-0 flex-1 overflow-hidden pt-1 sm:pt-2 pb-2">
                <PreviewLayoutBlock mode={previewMode} />
              </div>

              <PhotoboothDualActionBar
                secondaryLabel={screen.secondaryActionLabel}
                primaryLabel={primaryActionLabel}
                onSecondaryClick={handleRetakeAll}
                onPrimaryClick={handleConfirmPreview}
                secondaryIconSrc={getAssetPath(
                  '/images/photobooth/preview/arrow-rotate-left.svg'
                )}
                primaryIconSrc={getAssetPath('/images/photobooth/preview/arrow-right.svg')}
              />
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
