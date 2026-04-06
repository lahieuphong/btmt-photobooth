'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import PhotoboothFrameArtwork from '@/src/features/photobooth/components/PhotoboothFrameArtwork'
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
  mode,
}: {
  mode: PhotoboothLayoutPreviewMode
}) {
  return (
    <div className="relative mx-auto aspect-[678/1018] w-full max-w-[678px]">
      <div className="absolute left-[2.1%] top-[1.9%] h-[96%] w-[96%] rotate-[1.65deg] rounded-[clamp(18px,2.7cqw,28px)] bg-[#E8E3D1] shadow-[0_10px_24px_rgba(34,30,4,0.10)]" />
      <div className="absolute left-[0.6%] top-[1.2%] h-[96%] w-[96%] -rotate-[2.13deg] rounded-[clamp(18px,2.7cqw,28px)] bg-[#DDD6C0] shadow-[0_10px_24px_rgba(34,30,4,0.10)]" />

      <div className="absolute inset-0 z-10 rounded-[clamp(18px,2.7cqw,28px)]">
        <FrameArtwork mode={mode} />
      </div>
    </div>
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
      <div className="flex min-h-[844px] flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[3.704%] pt-[1.45%] pb-[2.6%]">
          <div
            className="mx-auto flex w-full max-w-[920px] flex-col gap-[clamp(16px,2.4cqw,24px)]"
            style={{ containerType: 'inline-size' }}
          >
            <div className="grid grid-cols-[minmax(0,1fr)_clamp(84px,21.57%,169px)] items-start gap-[clamp(12px,2.6cqw,28px)]">
              <div className="min-w-0 flex flex-col items-center">
                <div
                  className="w-full max-w-[678px] touch-pan-y"
                  onTouchStart={handleStageTouchStart}
                  onTouchEnd={handleStageTouchEnd}
                  onMouseDown={handleStageMouseDown}
                  onMouseUp={handleStageMouseUp}
                  onMouseLeave={handleStageMouseLeave}
                >
                  <FrameStagePreview mode={activePreviewMode} />
                </div>

                <div className="mt-[clamp(16px,3cqw,30px)] w-full">
                  <FrameNavigation
                    label={activeImage?.label ?? 'Hình 1'}
                    canGoPrev={canGoPrev}
                    canGoNext={canGoNext}
                    onPrev={handlePrevImage}
                    onNext={handleNextImage}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <div className="max-h-[clamp(420px,95cqw,980px)] overflow-y-scroll pr-[8px] [scrollbar-gutter:stable] [scrollbar-width:auto] [scrollbar-color:#CFC8B8_#ECE8DE] [&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[2px] [&::-webkit-scrollbar-thumb]:border-[#ECE8DE] [&::-webkit-scrollbar-thumb]:bg-[#CFC8B8] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#ECE8DE]">
                  <div className="space-y-[clamp(14px,2.2cqw,22px)] pb-[8px]">
                    {frameOptions.map((item) => {
                      const isSelected = item.id === selectedFrameId

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedFrameId(item.id)}
                          className="flex w-full flex-col items-center text-center"
                        >
                          <div
                            className={[
                              'w-full rounded-[clamp(12px,1.8cqw,20px)] border bg-white/70 p-[3px] transition-all duration-200',
                              isSelected
                                ? 'border-[#F15A29] shadow-[0_0_0_1px_rgba(241,90,41,0.14),0_6px_14px_rgba(0,0,0,0.06)]'
                                : 'border-transparent',
                            ].join(' ')}
                          >
                            <FrameOptionPreview mode={activePreviewMode} />
                          </div>

                          <div
                            className={[
                              'mt-[6px] text-[clamp(12px,1.3cqw,14px)] leading-none',
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

            <div className="flex justify-center pb-[4px]">
              <PrimaryButton
                href={screen.nextHref}
                className="h-[clamp(56px,7.2cqw,78px)] min-w-[clamp(220px,44.35cqw,479px)] rounded-[999px] px-[clamp(28px,7.4cqw,80px)] text-[clamp(18px,2.35cqw,22px)] font-semibold shadow-[0_7px_18px_rgba(34,30,4,0.16)]"
              >
                {screen.primaryActionLabel}
              </PrimaryButton>
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
