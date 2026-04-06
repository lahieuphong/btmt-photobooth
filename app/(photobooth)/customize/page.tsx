'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/PhotoboothCaptureRoundHint'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import {
  PHOTOBOOTH_BACKGROUND_OPTIONS,
  PHOTOBOOTH_FILTER_OPTIONS,
} from '@/src/features/photobooth/constants/customize'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import {
  getCurrentPhotoboothCaptureRound,
  readPhotoboothRuntimeSession,
} from '@/src/features/photobooth/utils/runtimeSession'

const CUSTOMIZE_LAYOUT_PREVIEW_IMAGES: Record<string, string> = {
  'layout-grid-4': '/images/photobooth/customize/photo-grid-2x2.png',
  'layout-vertical-4': '/images/photobooth/customize/photo-stack-4.png',
  'layout-grid-6': '/images/photobooth/customize/photo-grid-2x3.png',
}

function getCustomizePreviewImage(selectedLayoutId: string) {
  return (
    CUSTOMIZE_LAYOUT_PREVIEW_IMAGES[selectedLayoutId] ??
    CUSTOMIZE_LAYOUT_PREVIEW_IMAGES['layout-grid-4']
  )
}

function CustomizeOptionCard({
  name,
  previewClassName,
  isSelected,
}: {
  name: string
  previewClassName: string
  isSelected: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className="flex flex-col items-center text-center transition-all duration-200"
    >
      <div
        className={[
          'w-full overflow-hidden rounded-[10px] border bg-white aspect-[76/46]',
          isSelected ? 'border-[#F15A29]' : 'border-transparent',
        ].join(' ')}
      >
        <div className={`h-full w-full rounded-[8px] ${previewClassName}`} />
      </div>

      <div
        className={[
          'mt-1 text-[clamp(9px,1vw,10px)] leading-[1.2]',
          isSelected ? 'text-[#F15A29]' : 'text-[#5B5B5B]',
        ].join(' ')}
      >
        {name}
      </div>
    </button>
  )
}

function CustomizeLayoutStackPreview({
  selectedLayoutId,
  currentRound,
}: {
  selectedLayoutId: string
  currentRound: number
}) {
  const previewImage = getCustomizePreviewImage(selectedLayoutId)
  const stackCount = Math.max(1, Math.min(currentRound, 3))

  const layerOffsets = [0, 5, 10]
  const layerRotations = [0, 1.2, 2.4]

  return (
    <div className="relative h-[88px] w-[74px] shrink-0 overflow-visible">
      {Array.from({ length: stackCount }).map((_, renderIndex) => {
        const depth = stackCount - 1 - renderIndex
        const offset = layerOffsets[depth] ?? 0
        const rotation = layerRotations[depth] ?? 0

        return (
          <div
            key={`${selectedLayoutId}-${currentRound}-${renderIndex}`}
            className="absolute origin-bottom-left"
            style={{
              left: `${offset}px`,
              bottom: `${offset}px`,
              width: '60px',
              height: '80px',
              transform: `rotate(${rotation}deg)`,
              zIndex: renderIndex + 1,
            }}
          >
            <Image
              src={getAssetPath(previewImage)}
              alt="Bố cục đã chọn"
              fill
              sizes="60px"
              className="object-contain drop-shadow-[0_3px_8px_rgba(0,0,0,0.12)]"
            />
          </div>
        )
      })}

      <div className="absolute right-0 top-0 z-[40] flex h-6 w-6 items-center justify-center rounded-full bg-[#171717] text-[11px] font-semibold text-white shadow-[0_4px_10px_rgba(0,0,0,0.18)]">
        {currentRound}
      </div>
    </div>
  )
}

export default function CustomizePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.customize
  const [selectedFilterId] = useState(PHOTOBOOTH_DEFAULT_SESSION.selectedFilterId)
  const [selectedBackgroundId] = useState(PHOTOBOOTH_DEFAULT_SESSION.selectedBackgroundId)
  const [selectedLayoutId, setSelectedLayoutId] = useState(
    PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId
  )
  const [currentRound, setCurrentRound] = useState(1)

  useEffect(() => {
    const session = readPhotoboothRuntimeSession()
    setSelectedLayoutId(session.selectedLayoutId)
    setCurrentRound(getCurrentPhotoboothCaptureRound(session))
  }, [])

  return (
    <PhotoboothScreenShell>
      <div className="flex min-h-[844px] flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
          titleBottomSlot={<PhotoboothCaptureRoundHint />}
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[5.278%] pt-[2.2%] pb-[2.8%]">
          <div className="mx-auto w-full max-w-[900px] origin-top [@media(max-height:920px)]:scale-[0.93] [@media(max-height:860px)]:scale-[0.88]">
            <div className="mx-auto w-full max-w-[820px] overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#9CC0E9_0%,#D5D2B2_28%,#E7C95F_62%,#D9B54D_100%)]">
              <div className="aspect-[900/620] w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_46%)] [@media(min-height:980px)]:aspect-[900/680]"></div>
            </div>

            <div className="mt-[clamp(10px,1.5vw,16px)]">
              <div className="text-[clamp(13px,1.4vw,14px)] font-semibold text-[#2E2A26]">
                Bộ lọc màu
              </div>

              <div className="mt-2 grid grid-cols-5 gap-[clamp(8px,1.2vw,12px)]">
                {PHOTOBOOTH_FILTER_OPTIONS.map((item) => (
                  <CustomizeOptionCard
                    key={item.id}
                    name={item.name}
                    previewClassName={item.previewClassName}
                    isSelected={item.id === selectedFilterId}
                  />
                ))}
              </div>
            </div>

            <div className="mt-[clamp(10px,1.5vw,16px)]">
              <div className="text-[clamp(13px,1.4vw,14px)] font-semibold text-[#2E2A26]">
                Phông nền
              </div>

              <div className="mt-2 grid grid-cols-5 gap-[clamp(8px,1.2vw,12px)]">
                {PHOTOBOOTH_BACKGROUND_OPTIONS.map((item) => (
                  <CustomizeOptionCard
                    key={item.id}
                    name={item.name}
                    previewClassName={item.previewClassName}
                    isSelected={item.id === selectedBackgroundId}
                  />
                ))}
              </div>
            </div>

            <div className="mt-[clamp(12px,1.6vw,18px)] grid grid-cols-[auto_1fr_auto] items-center gap-[16px]">
              <CustomizeLayoutStackPreview
                selectedLayoutId={selectedLayoutId}
                currentRound={currentRound}
              />

              <div className="flex justify-center">
                <PrimaryButton href={screen.nextHref} className="min-w-[142px] shrink-0">
                  {screen.primaryActionLabel}
                </PrimaryButton>
              </div>

              <div className="h-[1px] w-[82px]" aria-hidden="true" />
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
