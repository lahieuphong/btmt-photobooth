'use client'

import { useEffect, useState } from 'react'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/flow/round/CaptureRoundHint'
import LayoutPreview from '@/src/features/photobooth/components/screens/layout/LayoutPreview'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { PHOTOBOOTH_LAYOUT_OPTIONS } from '@/src/features/photobooth/constants/layouts'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import {
  readPhotoboothRuntimeSession,
  setPhotoboothSelectedLayoutId,
} from '@/src/features/photobooth/utils/runtimeSession'

export default function LayoutPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.layout
  const defaultLayoutId = PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId

  const [activeLayoutId, setActiveLayoutId] = useState(defaultLayoutId)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const session = readPhotoboothRuntimeSession()
      setActiveLayoutId(session.selectedLayoutId)
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  const activeLayout =
    PHOTOBOOTH_LAYOUT_OPTIONS.find((item) => item.id === activeLayoutId) ??
    PHOTOBOOTH_LAYOUT_OPTIONS[0]

  function handleSelectLayout(layoutId: string) {
    setActiveLayoutId(layoutId)
    setPhotoboothSelectedLayoutId(layoutId)
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
          titleClassName="text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em] text-[#212121]"
        />

        <PhotoboothPageBody className="flex min-h-0 flex-1 flex-col overflow-hidden px-[5.278%] pt-[2.8%] pb-[calc(10px+env(safe-area-inset-bottom))]">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mx-auto w-[89.444%] shrink-0" style={{ containerType: 'inline-size' }}>
              <div className="flex w-full items-center gap-[2.484%]">
                {PHOTOBOOTH_LAYOUT_OPTIONS.map((item) => {
                  const isSelected = item.id === activeLayoutId

                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleSelectLayout(item.id)}
                      className={[
                        'flex w-[31.677%] shrink-0 aspect-[306/80] items-center justify-center rounded-[6px] border transition-all duration-200',
                        isSelected
                          ? 'border-[#FF4D27] bg-[#1A1A1A] shadow-[0_2px_6px_rgba(255,77,39,0.14)]'
                          : 'border-transparent bg-[#797979]',
                      ].join(' ')}
                    >
                      <span
                        className="inline-flex h-[60%] min-w-[49.346%] items-center justify-center whitespace-nowrap text-center font-medium leading-[150%] text-white"
                        style={{ fontSize: 'clamp(12px, 3.31cqw, 18px)' }}
                      >
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-hidden">
              <LayoutPreview mode={activeLayout.previewMode} />
            </div>

            <div className="mt-2 shrink-0 flex justify-center pb-[calc(2px+env(safe-area-inset-bottom))]">
              <PrimaryButton href={screen.nextHref} className="min-w-[142px]">
                {screen.primaryActionLabel}
              </PrimaryButton>
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}
