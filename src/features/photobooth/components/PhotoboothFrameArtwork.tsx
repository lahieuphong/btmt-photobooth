import Image from 'next/image'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'
import { getPhotoboothFrameOverlaySrc } from '@/src/features/photobooth/constants/framePreview'

type PhotoboothFrameArtworkProps = {
  mode: PhotoboothLayoutPreviewMode
  compact?: boolean
  overlayAlt: string
  imageSizes: string
  imagePriority?: boolean
  slotBackground?: 'solid' | 'gradient'
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

function FramePhotoSlot({
  className = '',
  slotBackground = 'solid',
}: {
  className?: string
  slotBackground?: 'solid' | 'gradient'
}) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[clamp(6px,0.95cqw,10px)]',
        slotBackground === 'gradient'
          ? 'bg-[linear-gradient(180deg,#EAE5D0_0%,#E7E1C9_100%)]'
          : 'bg-[#E7E1C9]',
        className,
      ].join(' ')}
    />
  )
}

function FramePhotoLayout({
  mode,
  compact,
  slotBackground,
}: {
  mode: PhotoboothLayoutPreviewMode
  compact: boolean
  slotBackground?: 'solid' | 'gradient'
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
          <FramePhotoSlot
            key={index}
            className="aspect-[185/98]"
            slotBackground={slotBackground}
          />
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
          <FramePhotoSlot
            key={index}
            className="aspect-[175/150]"
            slotBackground={slotBackground}
          />
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
        <FramePhotoSlot
          key={index}
          className="aspect-[182/240]"
          slotBackground={slotBackground}
        />
      ))}
    </div>
  )
}

export default function PhotoboothFrameArtwork({
  mode,
  compact = false,
  overlayAlt,
  imageSizes,
  imagePriority = false,
  slotBackground = 'solid',
}: PhotoboothFrameArtworkProps) {
  const overlaySrc = getPhotoboothFrameOverlaySrc(mode)
  const photoBoundsClass = getFramePhotoBounds(mode, compact)

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
      <div className={`${photoBoundsClass} z-0`}>
        <FramePhotoLayout
          mode={mode}
          compact={compact}
          slotBackground={slotBackground}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <Image
          src={getAssetPath(overlaySrc)}
          alt={overlayAlt}
          fill
          sizes={imageSizes}
          className="object-contain"
          priority={imagePriority}
        />
      </div>
    </div>
  )
}
