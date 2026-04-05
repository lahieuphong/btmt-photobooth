'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_PAYMENT_MOCK } from '@/src/features/photobooth/constants/payment'
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

const FRAME_OVERLAY_BY_MODE: Record<PhotoboothLayoutPreviewMode, string> = {
  'grid-4': '/images/photobooth/frame/frame_1.png',
  'vertical-4': '/images/photobooth/frame/frame_2.png',
  'grid-6': '/images/photobooth/frame/frame_3.png',
}

const PRINT_QR_CODE_SRC = '/images/photobooth/print/qr_code.png'
const FALLBACK_PRINT_MODES: PhotoboothLayoutPreviewMode[] = ['grid-4']

type StackPosition = {
  left: string
  top: string
  rotate: string
  zIndex: number
}

function getFrameOverlaySrc(mode: PhotoboothLayoutPreviewMode) {
  return FRAME_OVERLAY_BY_MODE[mode] ?? FRAME_OVERLAY_BY_MODE['grid-4']
}

function buildPrintModesFromSession(): PhotoboothLayoutPreviewMode[] {
  const session = readPhotoboothRuntimeSession()
  return getPhotoboothRoundLayoutIds(session).map((layoutId) =>
    getPhotoboothLayoutPreviewMode(layoutId)
  )
}

function FramePhotoSlot({ className = '' }: { className?: string }) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[clamp(6px,0.95cqw,10px)]',
        'bg-[#E7E1C9]',
        className,
      ].join(' ')}
    />
  )
}

function getFramePhotoBounds(
  mode: PhotoboothLayoutPreviewMode,
  compact: boolean
) {
  if (mode === 'vertical-4') {
    return compact
      ? 'absolute left-[26%] right-[26%] top-[11%] bottom-[16%]'
      : 'absolute left-[23%] right-[23%] top-[8.8%] bottom-[12.2%]'
  }

  if (mode === 'grid-6') {
    return compact
      ? 'absolute left-[12%] right-[12%] top-[11.5%] bottom-[15.5%]'
      : 'absolute left-[9.5%] right-[9.5%] top-[9.2%] bottom-[11.8%]'
  }

  return compact
    ? 'absolute left-[12%] right-[12%] top-[11%] bottom-[16%]'
    : 'absolute left-[9%] right-[9%] top-[8%] bottom-[12%]'
}

function FramePhotoLayout({
  mode,
  compact = false,
}: {
  mode: PhotoboothLayoutPreviewMode
  compact?: boolean
}) {
  if (mode === 'vertical-4') {
    return (
      <div
        className={[
          'mx-auto grid h-full content-start grid-cols-1',
          compact
            ? 'w-[56%] gap-[clamp(5px,0.7cqw,9px)]'
            : 'w-[54%] gap-[clamp(8px,1.1cqw,14px)]',
        ].join(' ')}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <FramePhotoSlot key={index} className="aspect-[185/98]" />
        ))}
      </div>
    )
  }

  if (mode === 'grid-6') {
    return (
      <div
        className={[
          'grid h-full grid-cols-2 content-start',
          compact
            ? 'gap-x-[clamp(6px,0.9cqw,10px)] gap-y-[clamp(6px,0.9cqw,10px)]'
            : 'gap-x-[clamp(8px,1.1cqw,14px)] gap-y-[clamp(8px,1.1cqw,14px)]',
        ].join(' ')}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <FramePhotoSlot key={index} className="aspect-[175/150]" />
        ))}
      </div>
    )
  }

  return (
    <div
      className={[
        'grid h-full grid-cols-2 content-start',
        compact
          ? 'gap-x-[clamp(7px,1cqw,12px)] gap-y-[clamp(9px,1.2cqw,14px)]'
          : 'gap-x-[clamp(10px,1.2cqw,16px)] gap-y-[clamp(12px,1.5cqw,18px)]',
      ].join(' ')}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <FramePhotoSlot key={index} className="aspect-[182/240]" />
      ))}
    </div>
  )
}

function PrintFrameArtwork({
  mode,
  priority = false,
}: {
  mode: PhotoboothLayoutPreviewMode
  priority?: boolean
}) {
  const overlaySrc = getFrameOverlaySrc(mode)
  const photoBoundsClass = getFramePhotoBounds(mode, false)

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
      <div className={`${photoBoundsClass} z-0`}>
        <FramePhotoLayout mode={mode} />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <Image
          src={getAssetPath(overlaySrc)}
          alt="Khung ảnh in"
          fill
          sizes="(max-width: 480px) 72vw, (max-width: 768px) 300px, 320px"
          className="object-contain"
          priority={priority}
        />
      </div>
    </div>
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
    <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-[#E1DCC8] shadow-[0_10px_24px_rgba(34,30,4,0.10)]">
      <PrintFrameArtwork mode={mode} priority={priority} />
    </div>
  )
}

function PrintFrameStack({
  modes,
}: {
  modes: PhotoboothLayoutPreviewMode[]
}) {
  const visibleModes = modes.slice(0, 3)

  const positionsByCount: Record<number, StackPosition[]> = {
    1: [{ left: '7%', top: '8%', rotate: '0deg', zIndex: 30 }],
    2: [
      { left: '7%', top: '10%', rotate: '0deg', zIndex: 30 },
      { left: '18%', top: '2%', rotate: '8deg', zIndex: 20 },
    ],
    3: [
      { left: '8%', top: '10%', rotate: '0deg', zIndex: 30 },
      { left: '16%', top: '4%', rotate: '-6deg', zIndex: 20 },
      { left: '27%', top: '0%', rotate: '9deg', zIndex: 10 },
    ],
  }

  const positions = positionsByCount[visibleModes.length] ?? positionsByCount[1]

  return (
    <div className="relative mx-auto h-[clamp(300px,48vh,390px)] w-[clamp(240px,76vw,320px)] max-w-full">
      {visibleModes.map((mode, index) => {
        const position = positions[index]

        return (
          <div
            key={`${mode}-${index}`}
            className="absolute aspect-[678/1018] w-[78%]"
            style={{
              left: position.left,
              top: position.top,
              transform: `rotate(${position.rotate})`,
              zIndex: position.zIndex,
            }}
          >
            <PrintFrameCard mode={mode} priority={index === 0} />
          </div>
        )
      })}
    </div>
  )
}

export default function PrintPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.print
  const paymentInfo = PHOTOBOOTH_PAYMENT_MOCK

  const [printModes, setPrintModes] = useState<PhotoboothLayoutPreviewMode[]>(() => {
    const fallbackSession = getDefaultPhotoboothRuntimeSession()
    return getPhotoboothRoundLayoutIds(fallbackSession).map((layoutId) =>
      getPhotoboothLayoutPreviewMode(layoutId)
    )
  })

  useEffect(() => {
    setPrintModes(buildPrintModesFromSession())
  }, [])

  const visiblePrintModes = useMemo<PhotoboothLayoutPreviewMode[]>(() => {
    return printModes.length > 0 ? printModes : FALLBACK_PRINT_MODES
  }, [printModes])

  return (
    <PhotoboothScreenShell>
      <div className="flex min-h-[844px] flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex flex-1 flex-col items-center overflow-y-auto px-[4.5%] pt-[1.8%] pb-[3.2%]">
          <div
            className="mx-auto flex w-full max-w-[920px] flex-col items-center gap-[clamp(16px,2.8cqw,28px)]"
            style={{ containerType: 'inline-size' }}
          >
            <div className="max-w-[300px] text-center text-[clamp(16px,2.35cqw,18px)] font-medium leading-[1.35] text-[#2E2A26]">
              Hình ảnh đang được in,
              <br />
              vui lòng chờ giây lát
            </div>

            <div className="w-full">
              <PrintFrameStack modes={visiblePrintModes} />
            </div>

            <div className="mt-4 relative h-[110px] w-[110px] overflow-hidden rounded-[12px] bg-white">
              <Image
                src={getAssetPath(PRINT_QR_CODE_SRC)}
                alt="QR code nhận file online"
                fill
                sizes="110px"
                className="object-contain p-[8px]"
              />
            </div>

            <div className="text-center text-[15px] text-[#2E2A26]">
              Quét mã QR để nhận file online
            </div>

            <div className="text-center text-[11px] text-[#7B7B7B]">
              {paymentInfo.qrText}
            </div>

            <div className="w-full max-w-[260px] pb-2">
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