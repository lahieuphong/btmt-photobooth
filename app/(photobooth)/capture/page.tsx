'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/flow/round/CaptureRoundHint'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import CaptureCameraLoadingFrame from '@/src/features/photobooth/components/screens/capture/CaptureCameraLoadingFrame'
import {
  PHOTOBOOTH_CAPTURE_GUIDE_TEXT,
  PHOTOBOOTH_COUNTDOWN_OPTIONS,
  type PhotoboothCountdownOption,
} from '@/src/features/photobooth/constants/capture'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import { setPhotoboothCaptureRoundImageDataUrl } from '@/src/features/photobooth/utils/runtimeSession'

export default function CapturePage() {
  const router = useRouter()
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.capture
  const [selectedCountdown, setSelectedCountdown] = useState<PhotoboothCountdownOption>(
    PHOTOBOOTH_DEFAULT_SESSION.selectedCountdown
  )
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const isMobileDevice = useMemo(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false
    }

    const mobileUaRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    const hasTouch = navigator.maxTouchPoints > 1

    return mobileUaRegex.test(navigator.userAgent) || hasTouch
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return
    }

    let isMounted = true
    let stream: MediaStream | null = null

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('CAMERA_API_NOT_SUPPORTED')
      }

      const preferredFacingMode = isMobileDevice ? 'environment' : 'user'

      const constraintsWithFacingMode: MediaStreamConstraints = {
        audio: false,
        video: {
          facingMode: { ideal: preferredFacingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      }

      const fallbackConstraints: MediaStreamConstraints = {
        audio: false,
        video: true,
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia(constraintsWithFacingMode)
      } catch {
        stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints)
      }

      if (!isMounted || !videoRef.current || !stream) {
        stream?.getTracks().forEach((track) => track.stop())
        return
      }

      videoRef.current.srcObject = stream

      try {
        await videoRef.current.play()
        if (isMounted) {
          setIsCameraReady(true)
          setCameraError(null)
        }
      } catch {
        if (isMounted) {
          setCameraError(
            'Không thể tự phát camera. Vui lòng chạm vào vùng camera để tiếp tục.'
          )
        }
      }
    }

    void startCamera().catch((error: unknown) => {
      if (isMounted) {
        const errorMessage =
          error instanceof Error ? error.message : 'CAMERA_OPEN_FAILED'

        if (errorMessage === 'CAMERA_API_NOT_SUPPORTED') {
          setCameraError(
            'Thiết bị hoặc trình duyệt này chưa hỗ trợ camera. Vui lòng thử trình duyệt khác.'
          )
          return
        }

        setCameraError('Không thể mở camera. Hãy cấp quyền camera cho website rồi thử lại.')
      }
    })

    return () => {
      isMounted = false
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [isMobileDevice])

  const resolvedCameraError = cameraError

  function captureCurrentFrame() {
    const video = videoRef.current

    if (!video || video.videoWidth <= 0 || video.videoHeight <= 0) {
      return null
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')

    if (!context) {
      return null
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.92)
  }

  function handleCapture() {
    const capturedDataUrl = captureCurrentFrame()
    setPhotoboothCaptureRoundImageDataUrl(capturedDataUrl)
    router.push(screen.nextHref ?? '/preview')
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
          titleBottomSlot={<PhotoboothCaptureRoundHint />}
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[5.278%] pt-[2.2%] pb-[calc(10px+env(safe-area-inset-bottom))]">
          <div className="mx-auto flex min-h-full w-full max-w-[900px] flex-col">
            <div className="relative mx-auto w-full max-w-[820px] overflow-hidden rounded-[8px] bg-[linear-gradient(180deg,#9CC0E9_0%,#E7C95F_45%,#D9B54D_100%)] sm:rounded-[10px]">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                aria-label="Camera preview"
                className={[
                  'absolute inset-0 z-0 h-full w-full object-cover transition-opacity duration-300',
                  isCameraReady ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              />

              <div className="aspect-[0.74] w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_45%)] sm:aspect-[0.82]" />

              {isCameraReady ? (
                <>
                  <div className="absolute left-1/2 top-4 z-40 w-fit -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-center text-[11px] text-[#2E2A26] shadow-sm">
                    {PHOTOBOOTH_CAPTURE_GUIDE_TEXT}
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 top-[24%] bottom-[24%] z-30 border-2 border-[#FF8A3D]" />

                  <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[24%] bg-black/35 backdrop-blur-[1px]" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[24%] bg-black/35 backdrop-blur-[1px]" />
                </>
              ) : (
                <CaptureCameraLoadingFrame />
              )}

              {resolvedCameraError ? (
                <div className="absolute inset-0 z-50 flex items-center justify-center px-5 text-center text-[11px] text-white sm:text-[12px]">
                  <p className="rounded-md bg-black/45 px-3 py-2">{resolvedCameraError}</p>
                </div>
              ) : null}

              <div className="pointer-events-none absolute inset-0 z-10 bg-black/10" />
            </div>

            <div className="mt-auto pt-[clamp(16px,2.6vh,34px)]">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                {PHOTOBOOTH_COUNTDOWN_OPTIONS.map((value) => {
                  const isSelected = value === selectedCountdown

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedCountdown(value)}
                      aria-pressed={isSelected}
                      className={[
                        'flex h-[30px] min-w-[58px] transform-gpu items-center justify-center gap-1 rounded-[9px] px-2 text-[10px] font-medium leading-none text-white transition-[transform,background-color,border-color,box-shadow,opacity] duration-220 ease-out active:scale-95 sm:h-[32px] sm:min-w-[64px] sm:text-[11px]',
                        isSelected
                          ? 'scale-105 border-2 border-[#FF5A2A] bg-[#15181F] shadow-[0_0_10px_rgba(255,90,42,0.28)]'
                          : 'scale-90 bg-[#75777B]',
                      ].join(' ')}
                    >
                      <Image
                        src={getAssetPath('/images/photobooth/capture/stopwatch.svg')}
                        alt=""
                        aria-hidden="true"
                        width={11}
                        height={11}
                        className={[
                          'shrink-0 transition-all duration-150',
                          isSelected
                            ? 'h-[12px] w-[12px] opacity-100 drop-shadow-[0_0_0.25px_rgba(255,255,255,0.95)] sm:h-[13px] sm:w-[13px]'
                            : 'h-[11px] w-[11px] opacity-85 sm:h-[12px] sm:w-[12px]',
                        ].join(' ')}
                      />
                      <span
                        className={[
                          'text-[13px] sm:text-[14px]',
                          isSelected ? 'font-semibold' : 'font-medium',
                        ].join(' ')}
                      >
                        {value}s
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleCapture}
                  className="flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full bg-[#F56F58] text-white shadow-[0_12px_28px_rgba(245,111,88,0.38)] sm:h-[92px] sm:w-[92px]"
                >
              <Image
                src={getAssetPath('/images/photobooth/capture/camera-sparkles.svg')}
                alt=""
                aria-hidden="true"
                width={22}
                height={22}
                    className="h-[22px] w-[22px] sm:h-[24px] sm:w-[24px]"
                  />
                  <span className="mt-1 text-[14px] font-semibold leading-none text-white sm:text-[16px]">
                    {screen.primaryActionLabel}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
