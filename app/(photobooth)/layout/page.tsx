'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/PhotoboothCaptureRoundHint'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_LAYOUT_OPTIONS } from '@/src/features/photobooth/constants/layouts'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import {
  readPhotoboothRuntimeSession,
  setPhotoboothSelectedLayoutId,
} from '@/src/features/photobooth/utils/runtimeSession'

type LayoutPreviewMode = 'grid-4' | 'vertical-4' | 'grid-6'

const LAYOUT_PLACEHOLDER_IMAGE = '/images/photobooth/layouts/vector.png'

function LayoutPreviewCard({
  className = '',
  mode,
  isDisabled = false,
  loading = 'lazy',
}: {
  className?: string
  mode: LayoutPreviewMode
  isDisabled?: boolean
  loading?: 'lazy' | 'eager'
}) {
  const iconWrapperClass =
    mode === 'grid-4'
      ? 'absolute inset-x-0 top-[33.045%] flex justify-center'
      : 'absolute inset-0 flex items-center justify-center'

  const iconWidthClass =
    mode === 'grid-4'
      ? 'w-[47.674%]'
      : mode === 'grid-6'
        ? 'w-[30%]'
        : 'w-[34%]'

  return (
    <div
      aria-disabled={isDisabled}
      className={[
        'relative overflow-hidden rounded-[12px] bg-[rgba(196,196,196,0.20)] transition-opacity duration-200',
        isDisabled ? 'cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      <div className={iconWrapperClass}>
        <div
          className={[
            `relative ${iconWidthClass} aspect-[205/196] transition-opacity duration-200`,
            isDisabled ? 'opacity-20' : 'opacity-100',
          ].join(' ')}
        >
          <Image
            src={getAssetPath(LAYOUT_PLACEHOLDER_IMAGE)}
            alt=""
            fill
            loading={loading}
            sizes="(max-width: 768px) 96px, 205px"
            className="object-contain"
          />
        </div>
      </div>

      {isDisabled ? (
        <div className="absolute inset-0 bg-white/18" aria-hidden="true" />
      ) : null}
    </div>
  )
}

function LayoutPreviewFrame({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto h-full w-auto max-w-full aspect-[900/1196]">
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-[97.7778%] max-w-full">{children}</div>
      </div>
    </div>
  )
}

function LayoutPreviewGrid({
  mode,
  count,
  cardAspectClassName,
  disabledIndices = [],
  gapClassName = 'gap-[14px]',
}: {
  mode: LayoutPreviewMode
  count: number
  cardAspectClassName: string
  disabledIndices?: number[]
  gapClassName?: string
}) {
  return (
    <div className={`grid grid-cols-2 ${gapClassName}`}>
      {Array.from({ length: count }).map((_, index) => (
        <LayoutPreviewCard
          key={index}
          mode={mode}
          isDisabled={disabledIndices.includes(index)}
          loading={index === 0 ? 'eager' : 'lazy'}
          className={cardAspectClassName}
        />
      ))}
    </div>
  )
}

function LayoutPreview({ mode }: { mode: LayoutPreviewMode }) {
  if (mode === 'vertical-4') {
    return (
      <LayoutPreviewFrame>
        <LayoutPreviewGrid
          mode={mode}
          count={8}
          disabledIndices={[1, 3, 5, 7]}
          cardAspectClassName="aspect-[430/260]"
        />
      </LayoutPreviewFrame>
    )
  }

  if (mode === 'grid-6') {
    return (
      <LayoutPreviewFrame>
        <LayoutPreviewGrid
          mode={mode}
          count={6}
          cardAspectClassName="aspect-[430/372]"
        />
      </LayoutPreviewFrame>
    )
  }

  return (
    <LayoutPreviewFrame>
      <LayoutPreviewGrid
        mode={mode}
        count={4}
        cardAspectClassName="aspect-[430/578]"
      />
    </LayoutPreviewFrame>
  )
}

export default function LayoutPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.layout
  const defaultLayoutId = PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId

  const [activeLayoutId, setActiveLayoutId] = useState(defaultLayoutId)

  useEffect(() => {
    const session = readPhotoboothRuntimeSession()
    setActiveLayoutId(session.selectedLayoutId)
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
