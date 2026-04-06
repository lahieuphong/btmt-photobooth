'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/PhotoboothCaptureRoundHint'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import {
  PHOTOBOOTH_CAPTURE_GUIDE_TEXT,
  PHOTOBOOTH_COUNTDOWN_OPTIONS,
  type PhotoboothCountdownOption,
} from '@/src/features/photobooth/constants/capture'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function CapturePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.capture
  const [selectedCountdown, setSelectedCountdown] = useState<PhotoboothCountdownOption>(
    PHOTOBOOTH_DEFAULT_SESSION.selectedCountdown
  )

  return (
    <PhotoboothScreenShell>
      <div className="flex h-full min-h-0 flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
          titleBottomSlot={<PhotoboothCaptureRoundHint />}
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[5.278%] pt-[2.2%] pb-[calc(10px+env(safe-area-inset-bottom))]">
          <div className="mx-auto flex min-h-full w-full max-w-[900px] flex-col">
            <div className="relative mx-auto w-full max-w-[820px] overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#9CC0E9_0%,#E7C95F_45%,#D9B54D_100%)]">
              <div className="aspect-[0.92] w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_45%)]" />

              <div className="absolute left-1/2 top-4 w-fit -translate-x-1/2 whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-center text-[11px] text-[#2E2A26] shadow-sm">
                {PHOTOBOOTH_CAPTURE_GUIDE_TEXT}
              </div>

              <div className="absolute inset-x-3 top-1/2 h-[36%] -translate-y-1/2 border-2 border-[#FF8A3D]" />

              <div className="absolute inset-0 bg-black/15" />
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
                      className={[
                        'flex h-[30px] min-w-[58px] items-center justify-center gap-1 rounded-[9px] px-2 text-[10px] font-medium leading-none text-white transition-all duration-150 sm:h-[32px] sm:min-w-[64px] sm:text-[11px]',
                        isSelected
                          ? 'scale-105 border-2 border-[#FF5A2A] bg-[#15181F] shadow-[0_0_10px_rgba(255,90,42,0.28)]'
                          : 'scale-90 bg-[#75777B]',
                      ].join(' ')}
                    >
                      <Image
                        src="/images/photobooth/capture/stopwatch.svg"
                        alt=""
                        aria-hidden="true"
                        width={8}
                        height={8}
                        className="h-[8px] w-[8px] sm:h-[9px] sm:w-[9px]"
                      />
                      <span>{value}s</span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-4 flex justify-center">
                <Link
                  href={screen.nextHref}
                  className="flex h-[84px] w-[84px] flex-col items-center justify-center rounded-full bg-[#FD856E] text-white shadow-[0_10px_24px_rgba(253,133,110,0.25)] sm:h-[92px] sm:w-[92px]"
                >
                  <Image
                    src="/images/photobooth/capture/camera-sparkles.svg"
                    alt=""
                    aria-hidden="true"
                    width={22}
                    height={22}
                    className="h-[22px] w-[22px] sm:h-[24px] sm:w-[24px]"
                  />
                  <span className="mt-1 text-[14px] font-medium leading-none text-white sm:text-[16px]">
                    {screen.primaryActionLabel}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
