'use client'

import { useEffect, useMemo, useState } from 'react'
import PhotoboothFrameArtwork from '@/src/features/photobooth/components/flow/frame/FrameArtwork'
import PhotoboothFrameSwipePreview from '@/src/features/photobooth/components/flow/frame/FrameSwipePreview'
import FrameOptionPreview from '@/src/features/photobooth/components/screens/frame/FrameOptionPreview'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { PHOTOBOOTH_FRAME_OPTIONS } from '@/src/features/photobooth/constants/frames'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import {
  getDefaultPhotoboothRuntimeSession,
  getPhotoboothRoundImageDataUrls,
  getPhotoboothRoundLayoutIds,
  readPhotoboothRuntimeSession,
} from '@/src/features/photobooth/utils/runtimeSession'
import {
  getPhotoboothLayoutPreviewMode,
  type PhotoboothLayoutPreviewMode,
} from '@/src/features/photobooth/utils/layoutPreview'

type FrameImageItem = {
  imageIndex: number
  label: string
  layoutId: string
  previewMode: PhotoboothLayoutPreviewMode
  captureImageSrcs: Array<string | null>
}

function buildFrameImageItems(
  layoutIds: string[],
  roundImageDataUrls: Array<Array<string | null>> = []
): FrameImageItem[] {
  return layoutIds.map((layoutId, index) => ({
    imageIndex: index,
    label: `Hình ${index + 1}`,
    layoutId,
    previewMode: getPhotoboothLayoutPreviewMode(layoutId),
    captureImageSrcs: roundImageDataUrls[index] ?? [],
  }))
}

function FrameArtwork({
  mode,
  compact = false,
  photoSrcs = [],
}: {
  mode: PhotoboothLayoutPreviewMode
  compact?: boolean
  photoSrcs?: Array<string | null>
}) {
  return (
    <PhotoboothFrameArtwork
      mode={mode}
      compact={compact}
      overlayAlt="Khung ảnh"
      imageSizes={compact ? '140px' : '(max-width: 768px) 72vw, 680px'}
      imagePriority={!compact}
      slotBackground="gradient"
      photoSrcs={photoSrcs}
    />
  )
}

export default function FramePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.frame

  const [selectedFrameId, setSelectedFrameId] = useState(
    PHOTOBOOTH_DEFAULT_SESSION.selectedFrameId
  )
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [frameImages, setFrameImages] = useState<FrameImageItem[]>(() => {
    const fallbackSession = getDefaultPhotoboothRuntimeSession()
    return buildFrameImageItems(
      getPhotoboothRoundLayoutIds(fallbackSession),
      getPhotoboothRoundImageDataUrls(fallbackSession)
    )
  })

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const session = readPhotoboothRuntimeSession()
      const nextFrameImages = buildFrameImageItems(
        getPhotoboothRoundLayoutIds(session),
        getPhotoboothRoundImageDataUrls(session)
      )

      setFrameImages(nextFrameImages)
      setSelectedImageIndex((prev) =>
        Math.min(prev, Math.max(nextFrameImages.length - 1, 0))
      )
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
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

  return (
    <PhotoboothScreenShell>
      <div className="flex h-full min-h-0 flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          showLanguageDropdown={screen.showLanguageDropdown}
          languageLabel="VI"
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-[3.704%] pt-[1.45%] pb-[calc(16px+env(safe-area-inset-bottom))]">
          <div
            className="mx-auto grid h-full min-h-0 w-full max-w-[920px] flex-1 grid-rows-[minmax(0,1fr)_auto]"
            style={{ containerType: 'inline-size' }}
          >
            <div className="flex min-h-0 flex-1 items-center">
              <div className="grid min-h-0 w-full grid-cols-[minmax(0,1fr)_clamp(64px,15%,112px)] items-stretch gap-[clamp(12px,2.6cqw,28px)] overflow-hidden">
                <div className="min-w-0 flex min-h-0 flex-col items-center">
                  <PhotoboothFrameSwipePreview
                    modes={stagePreviewModes}
                    currentIndex={selectedImageIndex}
                    label={activeImage?.label ?? 'Hình 1'}
                    canGoPrev={canGoPrev}
                    canGoNext={canGoNext}
                    onPrev={handlePrevImage}
                    onNext={handleNextImage}
                    renderCard={(mode, options) => (
                      <div className="relative h-full w-full overflow-hidden rounded-[clamp(6px,1cqw,9px)] border border-[#CFC8B3] bg-[#E1DCC8] shadow-[0_10px_24px_rgba(34,30,4,0.10)]">
                        <FrameArtwork
                          mode={mode}
                          photoSrcs={
                            frameImages[options.originalIndex]?.captureImageSrcs ?? []
                          }
                        />
                      </div>
                    )}
                  />
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
                              <FrameOptionPreview
                                mode={activePreviewMode}
                                photoSrcs={activeImage?.captureImageSrcs ?? []}
                              />
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
