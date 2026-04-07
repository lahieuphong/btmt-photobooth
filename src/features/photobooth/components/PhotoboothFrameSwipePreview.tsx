import Image from 'next/image'
import type { MouseEvent, ReactNode, TouchEvent } from 'react'
import { useRef } from 'react'
import PhotoboothFrameStack from '@/src/features/photobooth/components/PhotoboothFrameStack'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import { PHOTOBOOTH_FRAME_ARROW_SRC } from '@/src/features/photobooth/constants/framePreview'

type PhotoboothFrameSwipePreviewProps = {
  modes: PhotoboothLayoutPreviewMode[]
  currentIndex: number
  label: string
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
  renderCard: (mode: PhotoboothLayoutPreviewMode) => ReactNode
  stackRootClassName?: string
  wrapperClassName?: string
  showNavigation?: boolean
}

function FrameStagePreview({
  modes,
  currentIndex,
  renderCard,
  stackRootClassName,
}: {
  modes: PhotoboothLayoutPreviewMode[]
  currentIndex: number
  renderCard: (mode: PhotoboothLayoutPreviewMode) => ReactNode
  stackRootClassName?: string
}) {
  const stageRootClassName =
    stackRootClassName ??
    (modes.length >= 3 ? 'relative mr-auto -ml-[6%]' : 'relative mx-auto')

  return (
    <PhotoboothFrameStack
      modes={modes}
      selectedIndex={currentIndex}
      rootClassName={stageRootClassName}
      containerClassName="w-full max-w-[min(100%,500px)] aspect-[74/100]"
      itemClassName="aspect-[678/1018] w-[62%]"
      renderCard={(mode) => renderCard(mode)}
    />
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

export default function PhotoboothFrameSwipePreview({
  modes,
  currentIndex,
  label,
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  renderCard,
  stackRootClassName,
  wrapperClassName = 'w-full',
  showNavigation = true,
}: PhotoboothFrameSwipePreviewProps) {
  const swipeStartXRef = useRef<number | null>(null)

  function handleSwipeEnd(endX: number | null) {
    const startX = swipeStartXRef.current
    swipeStartXRef.current = null

    if (startX === null || typeof endX !== 'number') return

    const deltaX = endX - startX
    const SWIPE_THRESHOLD = 42

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return

    if (deltaX < 0) {
      onNext()
      return
    }

    onPrev()
  }

  function handleStageTouchStart(event: TouchEvent<HTMLDivElement>) {
    swipeStartXRef.current = event.touches[0]?.clientX ?? null
  }

  function handleStageTouchEnd(event: TouchEvent<HTMLDivElement>) {
    handleSwipeEnd(event.changedTouches[0]?.clientX ?? null)
  }

  function handleStageMouseDown(event: MouseEvent<HTMLDivElement>) {
    swipeStartXRef.current = event.clientX
  }

  function handleStageMouseUp(event: MouseEvent<HTMLDivElement>) {
    handleSwipeEnd(event.clientX)
  }

  function handleStageMouseLeave() {
    swipeStartXRef.current = null
  }

  return (
    <div className={wrapperClassName}>
      <div
        className="w-full max-w-[678px] touch-pan-y"
        onTouchStart={handleStageTouchStart}
        onTouchEnd={handleStageTouchEnd}
        onMouseDown={handleStageMouseDown}
        onMouseUp={handleStageMouseUp}
        onMouseLeave={handleStageMouseLeave}
      >
        <FrameStagePreview
          modes={modes}
          currentIndex={currentIndex}
          renderCard={renderCard}
          stackRootClassName={stackRootClassName}
        />
      </div>

      {showNavigation ? (
        <div className="mt-[clamp(12px,2cqw,20px)] w-full">
          <FrameNavigation
            label={label}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrev={onPrev}
            onNext={onNext}
          />
        </div>
      ) : null}
    </div>
  )
}
