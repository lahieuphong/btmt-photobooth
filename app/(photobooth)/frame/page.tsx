'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import PhotoboothFrameArtwork from '@/src/features/photobooth/components/PhotoboothFrameArtwork'
import PhotoboothFrameStack from '@/src/features/photobooth/components/PhotoboothFrameStack'
import { PHOTOBOOTH_FRAME_OPTIONS } from '@/src/features/photobooth/constants/frames'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import {
  getDefaultPhotoboothRuntimeSession,
  getPhotoboothRoundLayoutIds,
  readPhotoboothRuntimeSession,
} from '@/src/features/photobooth/utils/runtimeSession'
import {
  getPhotoboothLayoutPreviewMode,
  type PhotoboothLayoutPreviewMode,
} from '@/src/features/photobooth/utils/layoutPreview'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import { PHOTOBOOTH_FRAME_ARROW_SRC } from '@/src/features/photobooth/constants/framePreview'

type FrameImageItem = {
  imageIndex: number
  label: string
  layoutId: string
  previewMode: PhotoboothLayoutPreviewMode
}

function buildFrameImageItems(layoutIds: string[]): FrameImageItem[] {
  return layoutIds.map((layoutId, index) => ({
    imageIndex: index,
    label: `Hình ${index + 1}`,
    layoutId,
    previewMode: getPhotoboothLayoutPreviewMode(layoutId),
  }))
}

function FrameArtwork({
  mode,
  compact = false,
}: {
  mode: PhotoboothLayoutPreviewMode
  compact?: boolean
}) {
  return (
    <PhotoboothFrameArtwork
      mode={mode}
      compact={compact}
      overlayAlt="Khung ảnh"
      imageSizes={compact ? '140px' : '(max-width: 768px) 72vw, 680px'}
      imagePriority={!compact}
      slotBackground="gradient"
    />
  )
}

function FrameStagePreview({
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
      rootClassName="relative mr-auto -ml-[6%]"
      containerClassName="w-full max-w-[min(100%,500px)] aspect-[74/100]"
      itemClassName="aspect-[678/1018] w-[62%]"
      renderCard={(mode) => (
        <div className="relative h-full w-full overflow-hidden rounded-[clamp(6px,1cqw,9px)] border border-[#CFC8B3] bg-[#E1DCC8] shadow-[0_10px_24px_rgba(34,30,4,0.10)]">
          <FrameArtwork mode={mode} />
        </div>
      )}
    />
  )
}

function FrameOptionPreview({
  mode,
}: {
  mode: PhotoboothLayoutPreviewMode
}) {
  return (
    <div className="aspect-[110/148] w-full rounded-[12px]">
      <FrameArtwork mode={mode} compact />
    </div>
  )
}

function FrameNavigation({
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
    <div className="mx-auto flex h-[60px] w-full max-w-[533px] items-center justify-between">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        aria-label="Xem hình trước"
        className={[
          'flex h-[32px] w-[32px] shrink-0 items-center justify-center transition-opacity',
          canGoPrev ? 'opacity-100' : 'cursor-not-allowed opacity-35',
        ].join(' ')}
      >
        <div className="relative h-[18px] w-[18px] rotate-180">
          <Image
            src={getAssetPath(PHOTOBOOTH_FRAME_ARROW_SRC)}
            alt=""
            fill
            sizes="18px"
            className="object-contain"
          />
        </div>
      </button>

      <div className="min-w-[120px] text-center text-[clamp(18px,2.35cqw,20px)] font-medium leading-none text-[#2E2A26]">
        {label}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Xem hình tiếp theo"
        className={[
          'flex h-[32px] w-[32px] shrink-0 items-center justify-center transition-opacity',
          canGoNext ? 'opacity-100' : 'cursor-not-allowed opacity-35',
        ].join(' ')}
      >
        <div className="relative h-[18px] w-[18px]">
          <Image
            src={getAssetPath(PHOTOBOOTH_FRAME_ARROW_SRC)}
            alt=""
            fill
            sizes="18px"
            className="object-contain"
          />
        </div>
      </button>
    </div>
  )
}

export default function FramePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.frame
  const swipeStartXRef = useRef<number | null>(null)

  const [selectedFrameId, setSelectedFrameId] = useState(
    PHOTOBOOTH_DEFAULT_SESSION.selectedFrameId
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [frameImages, setFrameImages] = useState<FrameImageItem[]>(() => {
    const fallbackSession = getDefaultPhotoboothRuntimeSession()
    return buildFrameImageItems(getPhotoboothRoundLayoutIds(fallbackSession))
  })

  useEffect(() => {
    const session = readPhotoboothRuntimeSession()
    const nextFrameImages = buildFrameImageItems(getPhotoboothRoundLayoutIds(session))

    setFrameImages(nextFrameImages)
    setSelectedImageIndex((prev) =>
      Math.min(prev, Math.max(nextFrameImages.length - 1, 0))
    )
  }, [])

  const activeImage = frameImages[selectedImageIndex] ?? frameImages[0]
  const activePreviewMode = activeImage?.previewMode ?? 'grid-4'
  const stagePreviewModes = useMemo<PhotoboothLayoutPreviewMode[]>(() => {
    return frameImages.length > 0
      ? frameImages.map((item) => item.previewMode)
      : ['grid-4']
  }, [frameImages])

  const canGoPrev = selectedImageIndex > 0
  const canGoNext = selectedImageIndex < frameImages.length - 1

  const frameOptions = useMemo(() => {
    return PHOTOBOOTH_FRAME_OPTIONS.map((item) => ({
      ...item,
    }))
  }, [])

  function handlePrevImage() {
    if (!canGoPrev) return
    setSelectedImageIndex((prev) => prev - 1)
  }

  function handleNextImage() {
    if (!canGoNext) return
    setSelectedImageIndex((prev) => prev + 1)
  }

  function handleSwipeEnd(endX: number | null) {
    const startX = swipeStartXRef.current
    swipeStartXRef.current = null

    if (startX === null || typeof endX !== 'number') return

    const deltaX = endX - startX
    const SWIPE_THRESHOLD = 42

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return

    if (deltaX < 0) {
      handleNextImage()
      return
    }

    handlePrevImage()
  }

  function handleStageTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    swipeStartXRef.current = event.touches[0]?.clientX ?? null
  }

  function handleStageTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    handleSwipeEnd(event.changedTouches[0]?.clientX ?? null)
  }

  function handleStageMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    swipeStartXRef.current = event.clientX
  }

  function handleStageMouseUp(event: React.MouseEvent<HTMLDivElement>) {
    handleSwipeEnd(event.clientX)
  }

  function handleStageMouseLeave() {
    swipeStartXRef.current = null
  }

  return (
    <PhotoboothScreenShell>
      <div className="flex h-full min-h-0 flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-[3.704%] pt-[1.45%] pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div
            className="mx-auto grid h-full min-h-0 w-full max-w-[920px] flex-1 grid-rows-[minmax(0,1fr)_auto]"
            style={{ containerType: 'inline-size' }}
          >
            <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_clamp(64px,15%,112px)] items-stretch gap-[clamp(12px,2.6cqw,28px)] overflow-hidden">
              <div className="min-w-0 flex min-h-0 flex-col items-center">
                <div
                  className="w-full max-w-[678px] touch-pan-y"
                  onTouchStart={handleStageTouchStart}
                  onTouchEnd={handleStageTouchEnd}
                  onMouseDown={handleStageMouseDown}
                  onMouseUp={handleStageMouseUp}
                  onMouseLeave={handleStageMouseLeave}
                >
                  <FrameStagePreview
                    modes={stagePreviewModes}
                    currentIndex={selectedImageIndex}
                  />
                </div>

                <div className="mt-[clamp(12px,2cqw,20px)] w-full">
                  <FrameNavigation
                    label={activeImage?.label ?? 'Hình 1'}
                    canGoPrev={canGoPrev}
                    canGoNext={canGoNext}
                    onPrev={handlePrevImage}
                    onNext={handleNextImage}
                  />
                </div>
              </div>

              <div className="min-w-0 min-h-0 h-full">
                <div className="h-full max-h-[clamp(320px,58vh,680px)] overflow-y-scroll overscroll-contain pr-[8px] [scrollbar-gutter:stable] [scrollbar-width:auto] [scrollbar-color:#CFC8B8_#ECE8DE] [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[2px] [&::-webkit-scrollbar-thumb]:border-[#ECE8DE] [&::-webkit-scrollbar-thumb]:bg-[#CFC8B8] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#ECE8DE]">
                  <div className="space-y-[clamp(14px,2.2cqw,22px)] pb-[8px]">
                    {frameOptions.map((item) => {
                      const isSelected = item.id === selectedFrameId

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedFrameId(item.id)}
                          className="group flex w-full flex-col items-center text-center transition-transform duration-200 ease-out hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.985]"
                        >
                          <div
                            className={[
                              'w-full rounded-[clamp(5px,0.9cqw,8px)] border bg-white/70 p-[3px] transition-all duration-200 ease-out',
                              isSelected
                                ? 'border-[#F15A29] shadow-[0_0_0_1px_rgba(241,90,41,0.14),0_6px_14px_rgba(0,0,0,0.06)]'
                                : 'border-[#E4DDCB] group-hover:border-[#D2C9AF] group-hover:shadow-[0_4px_10px_rgba(34,30,4,0.08)]',
                            ].join(' ')}
                          >
                            <FrameOptionPreview mode={activePreviewMode} />
                          </div>

                          <div
                            className={[
                              'mt-[6px] text-[clamp(12px,1.3cqw,14px)] leading-none transition-colors duration-200',
                              isSelected ? 'text-[#F15A29]' : 'text-[#2E2A26]',
                            ].join(' ')}
                          >
                            {item.name}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="z-10 mt-2 shrink-0 pt-3 pb-[calc(4px+env(safe-area-inset-bottom))]">
              <div className="flex justify-center">
                <PrimaryButton
                  href={screen.nextHref}
                  className="h-[48px] rounded-full px-8 sm:h-[52px] sm:px-10 text-[13px] sm:text-[16px] font-semibold shadow-[0_7px_18px_rgba(34,30,4,0.16)]"
                >
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
