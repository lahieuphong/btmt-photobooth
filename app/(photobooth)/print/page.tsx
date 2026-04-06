'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import PhotoboothFrameArtwork from '@/src/features/photobooth/components/PhotoboothFrameArtwork'
import { PHOTOBOOTH_PAYMENT_MOCK } from '@/src/features/photobooth/constants/payment'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import {
  getDefaultPhotoboothRuntimeSession,
  getPhotoboothRoundLayoutIds,
} from '@/src/features/photobooth/utils/runtimeSession'
import {
  getPhotoboothLayoutPreviewMode,
  type PhotoboothLayoutPreviewMode,
} from '@/src/features/photobooth/utils/layoutPreview'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import { buildPhotoboothPreviewModesFromSession } from '@/src/features/photobooth/constants/framePreview'

const PRINT_QR_CODE_SRC = '/images/photobooth/print/qr_code.png'
const FALLBACK_PRINT_MODES: PhotoboothLayoutPreviewMode[] = ['grid-4']

type StackPosition = {
  left: string
  top: string
  rotate: string
  zIndex: number
}

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
