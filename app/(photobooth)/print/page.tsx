'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import PhotoboothFrameSwipePreview from '@/src/features/photobooth/components/flow/frame/FrameSwipePreview'
import PrintFrameCard from '@/src/features/photobooth/components/screens/print/PrintFrameCard'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import {
  buildPhotoboothPreviewRoundItemsFromSession,
  type PhotoboothPreviewRoundItem,
} from '@/src/features/photobooth/constants/framePreview'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import { type PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

const PRINT_QR_CODE_SRC = '/images/illustrations/qr_code.svg'
const FALLBACK_PRINT_MODES: PhotoboothLayoutPreviewMode[] = ['grid-4']

export default function PrintPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.print

  const [printRoundItems] = useState<PhotoboothPreviewRoundItem[]>(() =>
    buildPhotoboothPreviewRoundItemsFromSession()
  )
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const visiblePrintModes = useMemo<PhotoboothLayoutPreviewMode[]>(() => {
    return printRoundItems.length > 0
      ? printRoundItems.map((item) => item.previewMode)
      : FALLBACK_PRINT_MODES
  }, [printRoundItems])

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
          showLanguageDropdown={screen.showLanguageDropdown}
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col items-center overflow-hidden px-[4.5%] pt-[1.2%] pb-[1.6%] max-[480px]:px-4 max-[480px]:pt-1 max-[480px]:pb-2">
          <div
            className="mx-auto flex h-full min-h-0 max-h-full w-full max-w-[920px] flex-col items-center"
            style={{ containerType: 'inline-size' }}
          >
            <div className="w-full min-h-0 flex-1 overflow-hidden">
              <div className="flex h-full w-full flex-col items-center justify-center gap-[clamp(4px,0.8svh,10px)]">
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
                    renderCard={(mode, options) => (
                      <PrintFrameCard
                        mode={mode}
                        priority
                        photoSrcs={printRoundItems[options.originalIndex]?.imageSrcs ?? []}
                      />
                    )}
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
                {screen.primaryActionLabel === 'Tiếp tục' ? (
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span>Tiếp tục</span>
                    <Image
                      src={getAssetPath('/icons/arrow-right.svg')}
                      alt=""
                      aria-hidden="true"
                      width={14}
                      height={14}
                      className="h-[14px] w-[14px] shrink-0"
                    />
                  </span>
                ) : (
                  screen.primaryActionLabel
                )}
              </PrimaryButton>
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
