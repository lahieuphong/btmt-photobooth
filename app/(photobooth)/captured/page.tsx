'use client'

import { useEffect, useMemo, useState } from 'react'
import PhotoboothFrameSwipePreview from '@/src/features/photobooth/components/flow/frame/FrameSwipePreview'
import CapturedFrameCard from '@/src/features/photobooth/components/screens/captured/CapturedFrameCard'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import {
  buildPhotoboothPreviewRoundItemsFromSession,
} from '@/src/features/photobooth/constants/framePreview'
import {
  getDefaultPhotoboothRuntimeSession,
  getPhotoboothRoundImageDataUrls,
  getPhotoboothRoundLayoutIds,
} from '@/src/features/photobooth/utils/runtimeSession'
import {
  getPhotoboothLayoutPreviewMode,
  type PhotoboothLayoutPreviewMode,
} from '@/src/features/photobooth/utils/layoutPreview'

const FALLBACK_CAPTURED_MODES: PhotoboothLayoutPreviewMode[] = ['grid-4']

export default function CapturedPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.captured

  const [capturedModes, setCapturedModes] = useState<PhotoboothLayoutPreviewMode[]>(() => {
    const fallbackSession = getDefaultPhotoboothRuntimeSession()
    return getPhotoboothRoundLayoutIds(fallbackSession).map((layoutId) =>
      getPhotoboothLayoutPreviewMode(layoutId)
    )
  })
  const [capturedRoundImageSrcs, setCapturedRoundImageSrcs] = useState<
    Array<Array<string | null>>
  >(() => {
    const fallbackSession = getDefaultPhotoboothRuntimeSession()
    return getPhotoboothRoundImageDataUrls(fallbackSession)
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const nextRoundItems = buildPhotoboothPreviewRoundItemsFromSession()
      const nextModes = nextRoundItems.map((item) => item.previewMode)
      setCapturedModes(nextModes)
      setCapturedRoundImageSrcs(nextRoundItems.map((item) => item.imageSrcs))
      setCurrentImageIndex((prev) =>
        Math.min(prev, Math.max(nextModes.length - 1, 0))
      )
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  const visibleCapturedModes = useMemo<PhotoboothLayoutPreviewMode[]>(() => {
    return capturedModes.length > 0 ? capturedModes : FALLBACK_CAPTURED_MODES
  }, [capturedModes])

  const canGoPrev = currentImageIndex > 0
  const canGoNext = currentImageIndex < visibleCapturedModes.length - 1

  function handlePrevImage() {
    if (!canGoPrev) return
    setCurrentImageIndex((prev) => prev - 1)
  }

  function handleNextImage() {
    if (!canGoNext) return
    setCurrentImageIndex((prev) => prev + 1)
  }

  return (
    <PhotoboothScreenShell>
      <div className="flex h-full min-h-0 flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          showLanguageDropdown={screen.showLanguageDropdown}
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-hidden px-[5%] pt-[2%] pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div
            className="mx-auto grid h-full min-h-0 w-full max-w-[920px] flex-1 grid-rows-[minmax(0,1fr)_auto]"
            style={{ containerType: 'inline-size' }}
          >
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-visible">
              <div className="w-full max-w-[min(430px,92vw)] px-[clamp(6px,1.2cqw,12px)]">
                <PhotoboothFrameSwipePreview
                  modes={visibleCapturedModes}
                  currentIndex={currentImageIndex}
                  label={`Hình ${currentImageIndex + 1}`}
                  canGoPrev={canGoPrev}
                  canGoNext={canGoNext}
                  onPrev={handlePrevImage}
                  onNext={handleNextImage}
                  stackRootClassName="relative mx-auto"
                  renderCard={(mode, options) => (
                    <CapturedFrameCard
                      mode={mode}
                      photoSrcs={capturedRoundImageSrcs[options.originalIndex] ?? []}
                    />
                  )}
                />
              </div>
            </div>

            <div className="z-10 mt-2 shrink-0 pt-3 pb-[calc(4px+env(safe-area-inset-bottom))]">
              <div className="grid grid-cols-2 gap-[clamp(12px,2cqw,16px)]">
                <PrimaryButton
                  href={screen.secondaryActionHref}
                  variant="secondary"
                  fullWidth
                >
                  {screen.secondaryActionLabel}
                </PrimaryButton>

                <PrimaryButton href={screen.nextHref} fullWidth>
                  {screen.primaryActionLabel}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
