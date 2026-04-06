'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import PhotoboothFrameArtwork from '@/src/features/photobooth/components/PhotoboothFrameArtwork'
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

type StackCardItem = {
  key: string
  mode: PhotoboothLayoutPreviewMode
  left: string
  top: string
  rotate: string
  width: string
  zIndex: number
}

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
    <div className="relative h-full w-full overflow-hidden rounded-[12px] bg-[#E1DCC8] shadow-[0_10px_24px_rgba(34,30,4,0.10)]">
      <CapturedFrameArtwork mode={mode} />
    </div>
  )
}

function buildCapturedStackItems(
  modes: PhotoboothLayoutPreviewMode[],
  currentIndex: number
): StackCardItem[] {
  const safeModes = modes.length > 0 ? modes : FALLBACK_CAPTURED_MODES
  const clampedIndex = Math.min(currentIndex, Math.max(safeModes.length - 1, 0))
  const activeMode = safeModes[clampedIndex]

  if (safeModes.length === 1) {
    return [
      {
        key: `active-${clampedIndex}`,
        mode: activeMode,
        left: '10%',
        top: '4%',
        rotate: '0deg',
        width: '80%',
        zIndex: 30,
      },
    ]
  }

  if (safeModes.length === 2) {
    const otherIndex = clampedIndex === 0 ? 1 : 0
    const otherMode = safeModes[otherIndex]

    return [
      {
        key: `back-${otherIndex}`,
        mode: otherMode,
        left: clampedIndex === 0 ? '20%' : '2%',
        top: clampedIndex === 0 ? '2%' : '7%',
        rotate: clampedIndex === 0 ? '7deg' : '-7deg',
        width: '78%',
        zIndex: 20,
      },
      {
        key: `active-${clampedIndex}`,
        mode: activeMode,
        left: '10%',
        top: '5%',
        rotate: '0deg',
        width: '80%',
        zIndex: 30,
      },
    ]
  }

  const otherIndices = safeModes
    .map((_, index) => index)
    .filter((index) => index !== clampedIndex)

  return [
    {
      key: `back-left-${otherIndices[0]}`,
      mode: safeModes[otherIndices[0]],
      left: '0%',
      top: '8%',
      rotate: '-6deg',
      width: '78%',
      zIndex: 10,
    },
    {
      key: `back-right-${otherIndices[1]}`,
      mode: safeModes[otherIndices[1]],
      left: '21%',
      top: '1%',
      rotate: '7deg',
      width: '78%',
      zIndex: 20,
    },
    {
      key: `active-${clampedIndex}`,
      mode: activeMode,
      left: '10%',
      top: '4%',
      rotate: '0deg',
      width: '80%',
      zIndex: 30,
    },
  ]
}

function CapturedFrameStack({
  modes,
  currentIndex,
}: {
  modes: PhotoboothLayoutPreviewMode[]
  currentIndex: number
}) {
  const stackItems = buildCapturedStackItems(modes, currentIndex)

  return (
    <div className="relative mx-auto h-[clamp(320px,54vh,430px)] w-[clamp(250px,84vw,360px)] max-w-full">
      {stackItems.map((item) => (
        <div
          key={item.key}
          className="absolute aspect-[678/1018]"
          style={{
            left: item.left,
            top: item.top,
            width: item.width,
            transform: `rotate(${item.rotate})`,
            zIndex: item.zIndex,
          }}
        >
          <CapturedFrameCard mode={item.mode} />
        </div>
      ))}
    </div>
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
      <div className="flex min-h-[844px] flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[5%] pt-[2%] pb-[3%]">
          <div
            className="mx-auto flex w-full max-w-[920px] flex-1 flex-col"
            style={{ containerType: 'inline-size' }}
          >
            <div className="flex flex-1 flex-col items-center">
              <div className="w-full max-w-[430px]">
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

            <div className="mt-auto grid grid-cols-2 gap-[clamp(12px,2cqw,16px)] pt-[clamp(24px,4cqw,36px)]">
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
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
