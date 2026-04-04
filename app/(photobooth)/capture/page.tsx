import Link from 'next/link'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import {
  PHOTOBOOTH_CAPTURE_GUIDE_TEXT,
  PHOTOBOOTH_COUNTDOWN_OPTIONS,
} from '@/src/features/photobooth/constants/capture'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function CapturePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.capture
  const selectedCountdown = PHOTOBOOTH_DEFAULT_SESSION.selectedCountdown

  return (
    <PhotoboothScreenShell>
      <div className="flex min-h-211 flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex flex-1 flex-col">
          <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#9CC0E9_0%,#E7C95F_45%,#D9B54D_100%)]">
            <div className="aspect-[0.92] w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_45%)]" />

            <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[11px] text-[#2E2A26] shadow-sm">
              {PHOTOBOOTH_CAPTURE_GUIDE_TEXT}
            </div>

            <div className="absolute inset-x-3 top-1/2 h-[36%] -translate-y-1/2 border-2 border-[#FF8A3D]" />

            <div className="absolute inset-0 bg-black/15" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            {PHOTOBOOTH_COUNTDOWN_OPTIONS.map((value) => {
              const isSelected = value === selectedCountdown

              return (
                <button
                  key={value}
                  type="button"
                  className={[
                    'rounded-[10px] px-4 py-2 text-[14px] font-medium text-white',
                    isSelected
                      ? 'border-2 border-[#FF5A2A] bg-[#171717]'
                      : 'bg-[#767676]',
                  ].join(' ')}
                >
                  {value}s
                </button>
              )
            })}
          </div>

          <div className="mt-4 flex justify-center">
            <Link
              href={screen.nextHref}
              className="flex h-22 w-22 flex-col items-center justify-center rounded-full bg-[#FF5A2A] text-white shadow-[0_10px_24px_rgba(255,90,42,0.25)]"
            >
              <span className="text-[20px] leading-none">📸</span>
              <span className="mt-1 text-[16px] font-medium">{screen.primaryActionLabel}</span>
            </Link>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}