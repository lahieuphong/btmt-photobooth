'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/PhotoboothCaptureRoundHint'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import {
  completePhotoboothCaptureRound,
  getPreviewNextRoute,
  readPhotoboothRuntimeSession,
} from '@/src/features/photobooth/utils/runtimeSession'
import {
  getPhotoboothLayoutPreviewMode,
  type PhotoboothLayoutPreviewMode,
} from '@/src/features/photobooth/utils/layoutPreview'

function PreviewPhotoCard({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={[
        'overflow-hidden rounded-[18px] sm:rounded-[22px] md:rounded-[24px]',
        'bg-[linear-gradient(180deg,#9CC0E9_0%,#D5D2B2_28%,#E7C95F_62%,#D9B54D_100%)]',
        className,
      ].join(' ')}
    >
      <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_46%)]" />
    </div>
  )
}

function PreviewLayoutBlock({
  mode,
}: {
  mode: PhotoboothLayoutPreviewMode
}) {
  if (mode === 'vertical-4') {
    return (
      <div className="mx-auto w-full max-w-[280px] sm:max-w-[340px] md:max-w-[430px]">
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <PreviewPhotoCard key={index} className="aspect-[430/260]" />
          ))}
        </div>
      </div>
    )
  }

  if (mode === 'grid-6') {
    return (
      <div className="mx-auto w-full max-w-[340px] sm:max-w-[430px] md:max-w-[760px]">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <PreviewPhotoCard key={index} className="aspect-[430/372]" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[340px] sm:max-w-[430px] md:max-w-[760px]">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <PreviewPhotoCard key={index} className="aspect-[430/578]" />
        ))}
      </div>
    </div>
  )
}

export default function PreviewPage() {
  const router = useRouter()
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.preview

  const [selectedLayoutId, setSelectedLayoutId] = useState(
    PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId
  )
  const [captureRoundsRequired, setCaptureRoundsRequired] = useState(1)
  const [captureRoundsCompleted, setCaptureRoundsCompleted] = useState(0)

  useEffect(() => {
    const session = readPhotoboothRuntimeSession()

    setSelectedLayoutId(session.selectedLayoutId)
    setCaptureRoundsRequired(session.captureRoundsRequired)
    setCaptureRoundsCompleted(session.captureRoundsCompleted)
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
      <div className="flex min-h-[844px] flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
          titleBottomSlot={<PhotoboothCaptureRoundHint />}
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[4.8%] pt-[1.8%] pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div
            className="mx-auto flex w-full max-w-[900px] flex-1 flex-col"
            style={{ containerType: 'inline-size' }}
          >
            <div className="flex flex-1 flex-col">
              <div className="flex-1 pt-1 sm:pt-2">
                <PreviewLayoutBlock mode={previewMode} />
              </div>

              <div className="sticky bottom-0 z-10 mt-4 bg-[#F4F4F4]/95 pt-4 pb-[calc(4px+env(safe-area-inset-bottom))] backdrop-blur-[2px]">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                  <PrimaryButton
                    variant="secondary"
                    fullWidth
                    onClick={handleRetakeAll}
                    className="h-[48px] sm:h-[52px] text-[14px] sm:text-[15px]"
                  >
                    {screen.secondaryActionLabel}
                  </PrimaryButton>

                  <PrimaryButton
                    fullWidth
                    onClick={handleConfirmPreview}
                    className="h-[48px] sm:h-[52px] text-[14px] sm:text-[15px]"
                  >
                    {primaryActionLabel}
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}