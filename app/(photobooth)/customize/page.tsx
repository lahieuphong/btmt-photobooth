'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
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
const CUSTOMIZE_PREVIEW_CHARACTER_IMAGE =
  '/images/photobooth/customize/bg_removed.png'

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
  onClick,
}: {
  name: string
  previewClassName: string
  isSelected: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className="group flex w-[56px] flex-col items-center text-center transition-transform duration-200 ease-out active:scale-[0.97] sm:w-[62px]"
    >
      <div
        className={[
          'w-full overflow-hidden rounded-[6px] border bg-white aspect-[76/46]',
          'transition-[border-color,transform,box-shadow] duration-200 ease-out',
          isSelected
            ? 'border-[#F15A29] shadow-[0_5px_12px_rgba(241,90,41,0.16)]'
            : 'border-transparent group-hover:scale-[1.02]',
        ].join(' ')}
      >
        <div className={`h-full w-full rounded-[4px] ${previewClassName}`} />
      </div>

      <div
        className={[
          'mt-1 w-full text-[clamp(7px,0.75vw,9px)] leading-[1.15] transition-colors duration-200',
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

const FILTER_STYLE_MAP: Record<string, string> = {
  original: 'none',
  bright: 'brightness(1.08) saturate(1.2) contrast(1.04)',
  classic: 'sepia(0.28) contrast(0.95) saturate(0.82)',
  nature: 'saturate(1.18) hue-rotate(-8deg) contrast(1.02)',
  bw: 'grayscale(1) contrast(1.06)',
  sunset: 'saturate(1.2) hue-rotate(-12deg) brightness(1.02)',
  cool: 'saturate(1.08) hue-rotate(14deg) contrast(1.02)',
}
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

  const selectedFilterStyle = FILTER_STYLE_MAP[selectedFilterId] ?? 'none'

  useEffect(() => {
    const session = readPhotoboothRuntimeSession()
    setSelectedLayoutId(session.selectedLayoutId)
    setCurrentRound(getCurrentPhotoboothCaptureRound(session))
  }, [])

  useEffect(() => {
    if (!hasPreviewInteractedRef.current) {
      hasPreviewInteractedRef.current = true
      return
    }

    setIsPreviewTransitioning(true)

    const timeoutId = window.setTimeout(() => {
      setIsPreviewTransitioning(false)
    }, 180)

    return () => {
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
          languageLabel="VI"
          titleBottomSlot={<PhotoboothCaptureRoundHint />}
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[5.278%] pt-[2.2%] pb-[calc(10px+env(safe-area-inset-bottom))]">
          <div className="mx-auto flex min-h-full w-full max-w-[900px] flex-col">
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
                        onClick={() => setSelectedFilterId(item.id)}
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

            <div className="mt-auto pt-[clamp(12px,1.6vw,18px)] grid grid-cols-[auto_1fr] items-center gap-[12px] sm:grid-cols-[auto_1fr_auto] sm:gap-[16px]">
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
