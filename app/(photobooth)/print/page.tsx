'use client'

import Image from 'next/image'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import PhotoboothFrameArtwork from '@/src/features/photobooth/components/PhotoboothFrameArtwork'
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

const STACK_DRAG_LIMIT = 10
const STACK_SWIPE_DISTANCE = 14
const STACK_SWIPE_VELOCITY = 0.24

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
    1: [{ left: '12%', top: '8%', rotate: '0deg', zIndex: 30 }],
    2: [
      { left: '8%', top: '11%', rotate: '0deg', zIndex: 30 },
      { left: '20%', top: '4%', rotate: '7deg', zIndex: 20 },
    ],
    3: [
      { left: '8%', top: '12%', rotate: '0deg', zIndex: 30 },
      { left: '20%', top: '7%', rotate: '6deg', zIndex: 20 },
      { left: '32%', top: '3%', rotate: '10deg', zIndex: 10 },
    ],
  }

  const positions = positionsByCount[visibleModes.length] ?? positionsByCount[1]

  return (
    <div className="relative mx-auto w-[clamp(150px,min(56vw,30svh),270px)] aspect-[74/100] max-w-full">
      {visibleModes.map((mode, index) => {
        const position = positions[index]

        return (
          <div
            key={`${mode}-${index}`}
            className="absolute aspect-[678/1018] w-[76%]"
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
  const stackTrackRef = useRef<HTMLDivElement | null>(null)
  const stackSwipeRef = useRef<HTMLDivElement | null>(null)
  const swipeStartXRef = useRef<number | null>(null)
  const swipeLastXRef = useRef<number>(0)
  const swipeStartTimeRef = useRef<number>(0)
  const isDraggingRef = useRef(false)
  const pendingOffsetXRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)
  const switchTimerRef = useRef<number | null>(null)

  const [printModes, setPrintModes] = useState<PhotoboothLayoutPreviewMode[]>(() => {
    const fallbackSession = getDefaultPhotoboothRuntimeSession()
    return getPhotoboothRoundLayoutIds(fallbackSession).map((layoutId) =>
      getPhotoboothLayoutPreviewMode(layoutId)
    )
  })
  const [activeModeIndex, setActiveModeIndex] = useState(0)

  useEffect(() => {
    setPrintModes(buildPrintModesFromSession())
  }, [])

  const visiblePrintModes = useMemo<PhotoboothLayoutPreviewMode[]>(() => {
    return printModes.length > 0 ? printModes : FALLBACK_PRINT_MODES
  }, [printModes])
  const swipeModeCount = Math.min(3, visiblePrintModes.length)

  useEffect(() => {
    setActiveModeIndex((prev) => {
      if (swipeModeCount === 0) return 0
      return prev % swipeModeCount
    })
  }, [swipeModeCount])

  const swipeableModes = useMemo<PhotoboothLayoutPreviewMode[]>(() => {
    const baseModes = visiblePrintModes.slice(0, swipeModeCount)
    if (baseModes.length <= 1) return baseModes

    return baseModes.map(
      (_, offset) => baseModes[(activeModeIndex + offset) % baseModes.length]
    )
  }, [activeModeIndex, swipeModeCount, visiblePrintModes])

  function goNextMode() {
    if (swipeModeCount <= 1) return
    setActiveModeIndex((prev) => (prev + 1) % swipeModeCount)
  }

  function goPrevMode() {
    if (swipeModeCount <= 1) return
    setActiveModeIndex(
      (prev) => (prev - 1 + swipeModeCount) % swipeModeCount
    )
  }

  function applyTrackOffset(offsetX: number, transition: string) {
    if (!stackTrackRef.current) return
    stackTrackRef.current.style.transition = transition
    stackTrackRef.current.style.transform = `translate3d(${offsetX}px, 0, 0)`
  }

  function flushOffsetFrame() {
    rafIdRef.current = null
    applyTrackOffset(pendingOffsetXRef.current, 'none')
  }

  function queueOffsetFrame(offsetX: number) {
    pendingOffsetXRef.current = offsetX
    if (rafIdRef.current !== null) return
    rafIdRef.current = window.requestAnimationFrame(flushOffsetFrame)
  }

  function handleSwipeEnd(endX: number | null) {
    const startX = swipeStartXRef.current
    const lastX = swipeLastXRef.current
    const startTime = swipeStartTimeRef.current
    swipeStartXRef.current = null
    swipeLastXRef.current = 0
    swipeStartTimeRef.current = 0
    isDraggingRef.current = false

    if (startX === null || typeof endX !== 'number') return
    if (swipeModeCount <= 1) return

    const deltaX = endX - startX
    const elapsedMs = Math.max(1, performance.now() - startTime)
    const velocityX = (endX - lastX) / elapsedMs
    const shouldSwitch =
      Math.abs(deltaX) >= STACK_SWIPE_DISTANCE ||
      Math.abs(velocityX) >= STACK_SWIPE_VELOCITY

    if (!shouldSwitch) {
      applyTrackOffset(0, 'transform 220ms cubic-bezier(0.22, 0.61, 0.36, 1)')
      return
    }

    const direction = deltaX < 0 ? -1 : 1
    const outgoingOffsetX = direction * 10
    const incomingOffsetX = -direction * 5

    applyTrackOffset(
      outgoingOffsetX,
      'transform 120ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    )

    if (switchTimerRef.current !== null) {
      window.clearTimeout(switchTimerRef.current)
    }

    switchTimerRef.current = window.setTimeout(() => {
      if (direction < 0) {
        goNextMode()
      } else {
        goPrevMode()
      }

      applyTrackOffset(incomingOffsetX, 'none')
      window.requestAnimationFrame(() => {
        applyTrackOffset(
          0,
          'transform 180ms cubic-bezier(0.22, 0.61, 0.36, 1)'
        )
      })
    }, 120)
  }

  function handleStackPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    if (swipeModeCount <= 1) return

    if (switchTimerRef.current !== null) {
      window.clearTimeout(switchTimerRef.current)
      switchTimerRef.current = null
    }

    if (rafIdRef.current !== null) {
      window.cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    swipeStartXRef.current = event.clientX
    swipeLastXRef.current = event.clientX
    swipeStartTimeRef.current = performance.now()
    isDraggingRef.current = true
    applyTrackOffset(0, 'none')
    stackSwipeRef.current = event.currentTarget
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handleStackPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return
    const startX = swipeStartXRef.current
    if (startX === null) return

    const deltaX = event.clientX - startX
    swipeLastXRef.current = event.clientX
    const clampedDeltaX = Math.max(-STACK_DRAG_LIMIT, Math.min(STACK_DRAG_LIMIT, deltaX))
    queueOffsetFrame(clampedDeltaX)
  }

  function handleStackPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    handleSwipeEnd(event.clientX)
    if (stackSwipeRef.current?.hasPointerCapture(event.pointerId)) {
      stackSwipeRef.current.releasePointerCapture(event.pointerId)
    }
  }

  function handleStackPointerCancel() {
    swipeStartXRef.current = null
    swipeLastXRef.current = 0
    swipeStartTimeRef.current = 0
    isDraggingRef.current = false
    applyTrackOffset(0, 'transform 180ms ease-out')
  }

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current)
      }

      if (switchTimerRef.current !== null) {
        window.clearTimeout(switchTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isDraggingRef.current) {
      applyTrackOffset(0, 'none')
    }
  }, [activeModeIndex])

  return (
    <PhotoboothScreenShell>
      <div className="flex h-full min-h-0 flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col items-center overflow-hidden px-[4.5%] pt-[1.8%] pb-[2.2%] max-[480px]:px-4 max-[480px]:pt-1 max-[480px]:pb-2">
          <div
            className="mx-auto flex h-full max-h-full w-full max-w-[920px] flex-col items-center"
            style={{ containerType: 'inline-size' }}
          >
            <div className="w-full shrink-0 flex flex-col items-center gap-[clamp(6px,1.1svh,14px)]">
              <div className="max-w-full shrink-0 whitespace-nowrap text-center text-[clamp(11px,1.95cqw,18px)] font-medium leading-[1.3] text-[#2E2A26]">
                Hình ảnh đang được in, vui lòng chờ giây lát
              </div>

              <div
                className="flex w-full shrink-0 touch-pan-y items-start justify-center pt-[clamp(6px,1.1svh,16px)]"
                onPointerDown={handleStackPointerDown}
                onPointerMove={handleStackPointerMove}
                onPointerUp={handleStackPointerUp}
                onPointerCancel={handleStackPointerCancel}
                onPointerLeave={handleStackPointerCancel}
              >
                <div ref={stackTrackRef} className="will-change-transform">
                  <PrintFrameStack modes={swipeableModes} />
                </div>
              </div>

              <div className="relative mt-[clamp(12px,2svh,22px)] h-[clamp(70px,10svh,104px)] w-[clamp(70px,10svh,104px)] shrink-0 overflow-hidden rounded-[12px] bg-white">
                <Image
                  src={getAssetPath(PRINT_QR_CODE_SRC)}
                  alt="QR code nhận file online"
                  fill
                  sizes="110px"
                  className="object-contain p-[8px]"
                />
              </div>

              <div className="shrink-0 text-center text-[clamp(11px,1.75cqw,15px)] text-[#2E2A26]">
                Quét mã QR để nhận file online
              </div>
            </div>

            <div className="mt-auto w-full max-w-[260px] shrink-0 pb-0.5 pt-[clamp(6px,1svh,14px)]">
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
