'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/flow/round/CaptureRoundHint'
import PhotoboothDualActionBar from '@/src/features/photobooth/components/flow/actions/DualActionBar'
import PreviewLayoutBlock from '@/src/features/photobooth/components/screens/preview/PreviewLayoutBlock'
import { PHOTOBOOTH_LAYOUT_OPTIONS } from '@/src/features/photobooth/constants/layouts'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { PHOTOBOOTH_ROUTES } from '@/src/features/photobooth/config/routes'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import {
  clearPhotoboothSingleRetake,
  commitPhotoboothSingleRetake,
  completePhotoboothCaptureRound,
  getPreviewNextRoute,
  readPhotoboothRuntimeSession,
  setPhotoboothRetakeDraftImageDataUrl,
  startPhotoboothSingleRetake,
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
  const [capturedRoundImageDataUrls, setCapturedRoundImageDataUrls] = useState<
    Array<Array<string | null>>
  >([])
  const [retakeTargetRoundIndex, setRetakeTargetRoundIndex] = useState<number | null>(null)
  const [retakeTargetSlotIndex, setRetakeTargetSlotIndex] = useState<number | null>(null)
  const [retakeDraftImageDataUrl, setRetakeDraftImageDataUrl] = useState<string | null>(null)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const session = readPhotoboothRuntimeSession()
      setSelectedLayoutId(session.selectedLayoutId)
      setCaptureRoundsRequired(session.captureRoundsRequired)
      setCaptureRoundsCompleted(session.captureRoundsCompleted)
      setCapturedRoundImageDataUrls(session.capturedRoundImageDataUrls || [])
      setRetakeTargetRoundIndex(session.retakeTargetRoundIndex)
      setRetakeTargetSlotIndex(session.retakeTargetSlotIndex)
      setRetakeDraftImageDataUrl(session.retakeDraftImageDataUrl)
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
    if (retakeTargetRoundIndex !== null && retakeTargetSlotIndex !== null) {
      commitPhotoboothSingleRetake()
      setRetakeTargetRoundIndex(null)
      setRetakeTargetSlotIndex(null)
      setRetakeDraftImageDataUrl(null)
      const session = readPhotoboothRuntimeSession()
      setCapturedRoundImageDataUrls(session.capturedRoundImageDataUrls || [])
      return
    }

    const updatedSession = completePhotoboothCaptureRound()
    const nextRoute = getPreviewNextRoute(updatedSession)

    router.push(nextRoute)
  }

  function handleRetakeAll() {
    if (retakeTargetRoundIndex !== null && retakeTargetSlotIndex !== null) {
      setPhotoboothRetakeDraftImageDataUrl(null)
      setRetakeDraftImageDataUrl(null)
      router.push(PHOTOBOOTH_ROUTES.CAPTURE)
      return
    }

    clearPhotoboothSingleRetake()
    router.push(screen.secondaryActionHref ?? '/capture')
  }

  function handleRetakeSingleImage(slotIndex: number) {
    startPhotoboothSingleRetake(currentRoundIndex, slotIndex)
    setRetakeTargetRoundIndex(currentRoundIndex)
    setRetakeTargetSlotIndex(slotIndex)
    setRetakeDraftImageDataUrl(null)
    router.push(PHOTOBOOTH_ROUTES.CAPTURE)
  }

  // Determine slot count for current layout
  const slotCount = useMemo(() => {
    const layout = PHOTOBOOTH_LAYOUT_OPTIONS.find((item) => item.id === selectedLayoutId)
    return layout?.slots || 1
  }, [selectedLayoutId])

  const currentRoundIndex = useMemo(() => {
    return Math.min(captureRoundsCompleted, Math.max(captureRoundsRequired - 1, 0))
  }, [captureRoundsCompleted, captureRoundsRequired])

  // Preview only the currently captured round.
  const previewImages = useMemo(() => {
    const currentRoundImages =
      capturedRoundImageDataUrls[currentRoundIndex]?.slice(0, slotCount) ?? []

    return Array.from({ length: slotCount }, (_, index) => currentRoundImages[index] ?? null)
  }, [slotCount, capturedRoundImageDataUrls, currentRoundIndex])

  const isRetakeReviewMode =
    retakeTargetRoundIndex !== null &&
    retakeTargetSlotIndex !== null &&
    !!retakeDraftImageDataUrl

  const previewRetakeImages = useMemo(() => {
    if (!isRetakeReviewMode || retakeTargetSlotIndex === null) {
      return previewImages
    }

    return Array.from({ length: slotCount }, (_, index) =>
      index === retakeTargetSlotIndex ? retakeDraftImageDataUrl : null
    )
  }, [isRetakeReviewMode, retakeTargetSlotIndex, retakeDraftImageDataUrl, slotCount, previewImages])

  const resolvedSecondaryLabel = isRetakeReviewMode
    ? 'Chụp lại ảnh này'
    : screen.secondaryActionLabel
  const resolvedPrimaryLabel = isRetakeReviewMode ? 'Tiếp tục' : primaryActionLabel

  return (
    <PhotoboothScreenShell>
      <div className="flex h-full min-h-0 flex-col">
        <PhotoboothPageHeader
          title={isRetakeReviewMode ? 'XEM LẠI ẢNH ĐÃ CHỤP' : screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          showLanguageDropdown={screen.showLanguageDropdown}
          languageLabel="VI"
          titleBottomSlot={captureRoundsRequired > 1 ? <PhotoboothCaptureRoundHint /> : null}
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-hidden px-[4.8%] pt-[1.8%] pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div
            className="mx-auto flex min-h-0 w-full max-w-[900px] flex-1 flex-col"
            style={{ containerType: 'inline-size' }}
          >
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="mt-3 min-h-0 flex-1 overflow-hidden pt-1 sm:pt-2 pb-2">
                {isRetakeReviewMode ? (
                  <div className="mx-auto flex h-full items-center justify-center">
                    <div className="relative aspect-[3/4] w-[min(78vw,320px)] overflow-hidden rounded-[12px] bg-[#E8E5CC] shadow-[0_10px_26px_rgba(34,30,4,0.12)]">
                      {retakeDraftImageDataUrl ? (
                        <Image
                          src={retakeDraftImageDataUrl}
                          alt="Ảnh vừa chụp lại"
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 78vw, 320px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <PreviewLayoutBlock
                    mode={previewMode}
                    previewImages={previewRetakeImages}
                    onRetakeImage={handleRetakeSingleImage}
                    enableRetake
                  />
                )}
              </div>

              <PhotoboothDualActionBar
                secondaryLabel={resolvedSecondaryLabel}
                primaryLabel={resolvedPrimaryLabel}
                onSecondaryClick={handleRetakeAll}
                onPrimaryClick={handleConfirmPreview}
                secondaryIconSrc={getAssetPath(
                  '/images/photobooth/preview/arrow-rotate-left.svg'
                )}
                primaryIconSrc={getAssetPath('/images/photobooth/preview/arrow-right.svg')}
                hideSecondary={isRetakeReviewMode}
              />
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
