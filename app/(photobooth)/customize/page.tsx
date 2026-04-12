'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/flow/round/CaptureRoundHint'
import CustomizeLayoutStackPreview from '@/src/features/photobooth/components/screens/customize/CustomizeLayoutStackPreview'
import CustomizeOptionCard from '@/src/features/photobooth/components/screens/customize/CustomizeOptionCard'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import {
  PHOTOBOOTH_BACKGROUND_OPTIONS,
  PHOTOBOOTH_FILTER_OPTIONS,
} from '@/src/features/photobooth/constants/customize'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { getPhotoboothFilterCssValue } from '@/src/features/photobooth/constants/filterStyle'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import {
  getCurrentPhotoboothCaptureRound,
  readPhotoboothRuntimeSession,
  setPhotoboothSelectedFilterId,
} from '@/src/features/photobooth/utils/runtimeSession'

const CUSTOMIZE_PREVIEW_CHARACTER_IMAGE =
  '/images/illustrations/bg_removed.svg'

const FALLBACK_BACKGROUND_CLASS_NAME =
  'bg-[linear-gradient(180deg,#9CC0E9_0%,#D5D2B2_28%,#E7C95F_62%,#D9B54D_100%)]'

export default function CustomizePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.customize
  const [selectedFilterId, setSelectedFilterId] = useState(
    PHOTOBOOTH_DEFAULT_SESSION.selectedFilterId
  )
  const [selectedBackgroundId, setSelectedBackgroundId] = useState(
    PHOTOBOOTH_DEFAULT_SESSION.selectedBackgroundId
  )
  const [selectedLayoutId, setSelectedLayoutId] = useState(
    PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId
  )
  const [currentRound, setCurrentRound] = useState(1)
  const [isPreviewTransitioning, setIsPreviewTransitioning] = useState(false)
  const hasPreviewInteractedRef = useRef(false)

  const selectedBackgroundClassName =
    PHOTOBOOTH_BACKGROUND_OPTIONS.find((item) => item.id === selectedBackgroundId)
      ?.previewClassName ?? FALLBACK_BACKGROUND_CLASS_NAME

  const selectedFilterStyle = getPhotoboothFilterCssValue(selectedFilterId)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const session = readPhotoboothRuntimeSession()
      setSelectedLayoutId(session.selectedLayoutId)
      setSelectedFilterId(session.selectedFilterId)
      setCurrentRound(getCurrentPhotoboothCaptureRound(session))
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    if (!hasPreviewInteractedRef.current) {
      hasPreviewInteractedRef.current = true
      return
    }

    const startTimerId = window.setTimeout(() => {
      setIsPreviewTransitioning(true)
    }, 0)

    const timeoutId = window.setTimeout(() => {
      setIsPreviewTransitioning(false)
    }, 180)

    return () => {
      window.clearTimeout(startTimerId)
      window.clearTimeout(timeoutId)
    }
  }, [selectedFilterId, selectedBackgroundId])

  return (
    <PhotoboothScreenShell>
      <div className="flex h-full min-h-0 flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          showLanguageDropdown={screen.showLanguageDropdown}
          languageLabel="VI"
          titleBottomSlot={<PhotoboothCaptureRoundHint />}
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[5.278%] pt-[2.2%] pb-[calc(10px+env(safe-area-inset-bottom))]">
          <div className="mx-auto flex min-h-full w-full max-w-[900px] flex-col">
            <div className="flex flex-1 flex-col justify-center">
              <div className="mx-auto w-full max-w-[820px] overflow-hidden rounded-[8px]">
                <div
                  className={`relative aspect-[900/655] w-full overflow-hidden ${selectedBackgroundClassName} [@media(min-height:980px)]:aspect-[900/715]`}
                  style={{
                    filter: selectedFilterStyle,
                    transition: 'filter 260ms ease-out, transform 260ms ease-out, opacity 260ms ease-out',
                    transform: isPreviewTransitioning ? 'scale(0.993)' : 'scale(1)',
                    opacity: isPreviewTransitioning ? 0.94 : 1,
                  }}
                >
                  <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_46%)]" />

                  <div className="pointer-events-none absolute inset-0 z-[2] flex items-end justify-center">
                    <Image
                      src={getAssetPath(CUSTOMIZE_PREVIEW_CHARACTER_IMAGE)}
                      alt="Nhân vật xem trước"
                      width={1046}
                      height={1569}
                      priority
                      className="h-[clamp(585px,126%,980px)] w-auto max-w-[75%] translate-y-[28%] object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.22)]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-[clamp(10px,1.5vw,16px)]">
                <div className="text-[clamp(13px,1.4vw,14px)] font-semibold text-[#2E2A26]">
                  Bộ lọc màu
                </div>

                <div className="mt-2 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C8C8C8]">
                  <div className="grid min-w-max grid-flow-col auto-cols-[56px] gap-2 pr-1 sm:auto-cols-[62px] sm:gap-2.5">
                    {PHOTOBOOTH_FILTER_OPTIONS.map((item) => (
                      <div key={item.id} className="shrink-0">
                        <CustomizeOptionCard
                          name={item.name}
                          previewClassName={item.previewClassName}
                          isSelected={item.id === selectedFilterId}
                          onClick={() => {
                            setSelectedFilterId(item.id)
                            setPhotoboothSelectedFilterId(item.id)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-[clamp(10px,1.5vw,16px)]">
                <div className="text-[clamp(13px,1.4vw,14px)] font-semibold text-[#2E2A26]">
                  Phông nền
                </div>

                <div className="mt-2 overflow-x-auto overflow-y-hidden pb-2 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C8C8C8]">
                  <div className="grid min-w-max grid-flow-col auto-cols-[56px] gap-2 pr-1 sm:auto-cols-[62px] sm:gap-2.5">
                    {PHOTOBOOTH_BACKGROUND_OPTIONS.map((item) => (
                      <div key={item.id} className="shrink-0">
                        <CustomizeOptionCard
                          name={item.name}
                          previewClassName={item.previewClassName}
                          isSelected={item.id === selectedBackgroundId}
                          onClick={() => setSelectedBackgroundId(item.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-[clamp(12px,1.6vw,18px)] grid grid-cols-[auto_1fr] items-center gap-[12px] sm:grid-cols-[auto_1fr_auto] sm:gap-[16px]">
              <CustomizeLayoutStackPreview
                selectedLayoutId={selectedLayoutId}
                currentRound={currentRound}
              />

              <div className="flex justify-center">
                <PrimaryButton href={screen.nextHref} className="min-w-[142px] shrink-0">
                  {screen.primaryActionLabel}
                </PrimaryButton>
              </div>

              <div className="hidden h-[1px] w-[82px] sm:block" aria-hidden="true" />
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
