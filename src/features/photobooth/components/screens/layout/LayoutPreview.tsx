import Image from 'next/image'
import type { ReactNode } from 'react'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

const LAYOUT_PLACEHOLDER_IMAGE = '/images/photobooth/layouts/vector.png'

function LayoutPreviewCard({
  className = '',
  mode,
  isDisabled = false,
}: {
  className?: string
  mode: PhotoboothLayoutPreviewMode
  isDisabled?: boolean
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
            loading="eager"
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
  children: ReactNode
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
  mode: PhotoboothLayoutPreviewMode
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
          className={cardAspectClassName}
        />
      ))}
    </div>
  )
}

export default function LayoutPreview({
  mode,
}: {
  mode: PhotoboothLayoutPreviewMode
}) {
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
