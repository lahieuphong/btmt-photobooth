'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import PhotoboothFrameArtwork from '@/src/features/photobooth/components/PhotoboothFrameArtwork'
import PhotoboothFrameSwipePreview from '@/src/features/photobooth/components/PhotoboothFrameSwipePreview'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { type PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import { buildPhotoboothPreviewModesFromSession } from '@/src/features/photobooth/constants/framePreview'

const PRINT_QR_CODE_SRC = '/images/photobooth/print/qr_code.png'
const FALLBACK_PRINT_MODES: PhotoboothLayoutPreviewMode[] = ['grid-4']

function buildPrintModesFromSession(): PhotoboothLayoutPreviewMode[] {
  return buildPhotoboothPreviewModesFromSession()
}

function PrintFrameArtwork({
  mode,
  priority = false,
}: {
  mode: PhotoboothLayoutPreviewMode
  priority?: boolean
}) {
  return (
    <PhotoboothFrameArtwork
      mode={mode}
      overlayAlt="Khung ảnh in"
      imageSizes="(max-width: 480px) 72vw, (max-width: 768px) 300px, 320px"
      imagePriority={priority}
      slotBackground="solid"
    />
  )
}

function PrintFrameCard({
  mode,
  priority = false,
}: {
  mode: PhotoboothLayoutPreviewMode
  priority?: boolean
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[clamp(6px,1cqw,9px)] border border-[#CFC8B3] bg-[#E1DCC8] shadow-[0_10px_24px_rgba(34,30,4,0.10)]">
      <PrintFrameArtwork mode={mode} priority={priority} />
    </div>
  )
}

export default function PrintPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.print

  const [printModes] = useState<PhotoboothLayoutPreviewMode[]>(() =>
    buildPrintModesFromSession()
  )
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const visiblePrintModes = useMemo<PhotoboothLayoutPreviewMode[]>(() => {
    return printModes.length > 0 ? printModes : FALLBACK_PRINT_MODES
  }, [printModes])

  const swipeableModes = useMemo<PhotoboothLayoutPreviewMode[]>(
    () => visiblePrintModes,
    [visiblePrintModes]
  )

  const hasMultipleModes = swipeableModes.length > 1
  const canGoPrev = hasMultipleModes
  const canGoNext = hasMultipleModes

  function handlePrevImage() {
    const total = swipeableModes.length
    if (total <= 1) return
    setCurrentImageIndex((prev) => (prev - 1 + total) % total)
  }

  function handleNextImage() {
    const total = swipeableModes.length
    if (total <= 1) return
    setCurrentImageIndex((prev) => (prev + 1) % total)
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

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col items-center overflow-hidden px-[4.5%] pt-[1.2%] pb-[1.6%] max-[480px]:px-4 max-[480px]:pt-1 max-[480px]:pb-2">
          <div
            className="mx-auto flex h-full min-h-0 max-h-full w-full max-w-[920px] flex-col items-center"
            style={{ containerType: 'inline-size' }}
          >
            <div className="w-full min-h-0 flex-1 overflow-hidden">
              <div className="flex w-full flex-col items-center gap-[clamp(4px,0.8svh,10px)]">
              <div className="max-w-full shrink-0 whitespace-nowrap text-center text-[clamp(11px,1.95cqw,18px)] font-medium leading-[1.3] text-[#2E2A26]">
                Hình ảnh đang được in, vui lòng chờ giây lát
              </div>

              <div className="flex w-full shrink-0 items-start justify-center pt-[clamp(4px,0.8svh,10px)]">
                <PhotoboothFrameSwipePreview
                  modes={swipeableModes}
                  currentIndex={currentImageIndex}
                  label={`Hình ${currentImageIndex + 1}`}
                  canGoPrev={canGoPrev}
                  canGoNext={canGoNext}
                  onPrev={handlePrevImage}
                  onNext={handleNextImage}
                  showNavigation={false}
                  wrapperClassName="w-[min(84vw,38svh)] max-w-[440px] min-w-[260px] flex flex-col items-center"
                  stackRootClassName="relative mx-auto"
                  renderCard={(mode) => <PrintFrameCard mode={mode} priority />}
                />
              </div>

              <div className="relative mt-[clamp(8px,1.2svh,14px)] h-[clamp(56px,8svh,88px)] w-[clamp(56px,8svh,88px)] shrink-0 overflow-hidden rounded-[10px] bg-white">
                <Image
                  src={getAssetPath(PRINT_QR_CODE_SRC)}
                  alt="QR code nhận file online"
                  fill
                  sizes="90px"
                  className="object-contain p-[6px]"
                />
              </div>

              <div className="shrink-0 text-center text-[clamp(10px,1.4cqw,14px)] text-[#2E2A26]">
                Quét mã QR để nhận file online
              </div>
            </div>
            </div>

            <div className="mt-auto flex w-full shrink-0 justify-center pt-[clamp(4px,0.6svh,8px)] pb-[calc(4px+env(safe-area-inset-bottom))]">
              <PrimaryButton
                href={screen.nextHref}
                className="h-[48px] rounded-full px-8 sm:h-[52px] sm:px-10 text-[13px] sm:text-[16px] font-semibold"
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
