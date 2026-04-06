'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import PhotoboothFrameArtwork from '@/src/features/photobooth/components/PhotoboothFrameArtwork'
import PhotoboothFrameStack from '@/src/features/photobooth/components/PhotoboothFrameStack'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import {
  getDefaultPhotoboothRuntimeSession,
  getPhotoboothRoundLayoutIds,
} from '@/src/features/photobooth/utils/runtimeSession'
import {
  getPhotoboothLayoutPreviewMode,
  type PhotoboothLayoutPreviewMode,
} from '@/src/features/photobooth/utils/layoutPreview'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import {
  buildPhotoboothPreviewModesFromSession,
  PHOTOBOOTH_FRAME_ARROW_SRC,
} from '@/src/features/photobooth/constants/framePreview'
const FALLBACK_CAPTURED_MODES: PhotoboothLayoutPreviewMode[] = ['grid-4']

function buildCapturedModesFromSession(): PhotoboothLayoutPreviewMode[] {
  return buildPhotoboothPreviewModesFromSession()
}

function CapturedFrameArtwork({
  mode,
}: {
  mode: PhotoboothLayoutPreviewMode
}) {
  return (
    <PhotoboothFrameArtwork
      mode={mode}
      overlayAlt="Khung ảnh đã chụp"
      imageSizes="(max-width: 480px) 76vw, (max-width: 768px) 340px, 390px"
      imagePriority
      slotBackground="solid"
    />
  )
}

function CapturedFrameCard({
  mode,
}: {
  mode: PhotoboothLayoutPreviewMode
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[clamp(6px,1cqw,9px)] border border-[#CFC8B3] bg-[#E1DCC8] shadow-[0_10px_24px_rgba(34,30,4,0.10)]">
      <CapturedFrameArtwork mode={mode} />
    </div>
  )
}

function CapturedFrameStack({
  modes,
  currentIndex,
}: {
  modes: PhotoboothLayoutPreviewMode[]
  currentIndex: number
}) {
  return (
    <PhotoboothFrameStack
      modes={modes}
      selectedIndex={currentIndex}
      renderCard={(mode) => <CapturedFrameCard mode={mode} />}
    />
  )
}

function CapturedNavigation({
  label,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: {
  label: string
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="mx-auto flex h-[56px] w-full max-w-[220px] items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label="Xem hình trước"
        className={[
          'flex h-[28px] w-[28px] shrink-0 items-center justify-center transition-opacity',
          canGoPrev ? 'opacity-100' : 'cursor-not-allowed opacity-35',
        ].join(' ')}
      >
        <div className="relative h-[14px] w-[14px] rotate-180">
          <Image
            src={getAssetPath(PHOTOBOOTH_FRAME_ARROW_SRC)}
            alt=""
            fill
            sizes="14px"
            className="object-contain"
          />
        </div>
      </button>

      <div className="min-w-[96px] text-center text-[clamp(16px,2cqw,18px)] font-medium leading-none text-[#2E2A26]">
        {label}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Xem hình tiếp theo"
        className={[
          'flex h-[28px] w-[28px] shrink-0 items-center justify-center transition-opacity',
          canGoNext ? 'opacity-100' : 'cursor-not-allowed opacity-35',
        ].join(' ')}
      >
        <div className="relative h-[14px] w-[14px]">
          <Image
            src={getAssetPath(PHOTOBOOTH_FRAME_ARROW_SRC)}
            alt=""
            fill
            sizes="14px"
            className="object-contain"
          />
        </div>
      </button>
    </div>
  )
}

export default function CapturedPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.captured

  const [capturedModes, setCapturedModes] = useState<PhotoboothLayoutPreviewMode[]>(() => {
    const fallbackSession = getDefaultPhotoboothRuntimeSession()
    return getPhotoboothRoundLayoutIds(fallbackSession).map((layoutId) =>
      getPhotoboothLayoutPreviewMode(layoutId)
    )
  })

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const nextModes = buildCapturedModesFromSession()
    setCapturedModes(nextModes)
    setCurrentImageIndex((prev) =>
      Math.min(prev, Math.max(nextModes.length - 1, 0))
    )
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
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-hidden px-[5%] pt-[2%] pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div
            className="mx-auto grid h-full min-h-0 w-full max-w-[920px] flex-1 grid-rows-[minmax(0,1fr)_auto]"
            style={{ containerType: 'inline-size' }}
          >
            <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto overflow-x-visible">
              <div className="w-full max-w-[min(430px,92vw)] px-[clamp(6px,1.2cqw,12px)] pt-[clamp(8px,1.6cqw,16px)]">
                <CapturedFrameStack
                  modes={visibleCapturedModes}
                  currentIndex={currentImageIndex}
                />
              </div>

              <div className="mt-[clamp(18px,3cqw,28px)] w-full">
                <CapturedNavigation
                  label={`Hình ${currentImageIndex + 1}`}
                  canGoPrev={canGoPrev}
                  canGoNext={canGoNext}
                  onPrev={handlePrevImage}
                  onNext={handleNextImage}
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
