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
  photoSrc?: string | null
  photoSrcs?: Array<string | null>
}

function getFramePhotoBounds(
  mode: PhotoboothLayoutPreviewMode,
  compact: boolean
) {
  if (mode === 'grid-4') {
    return 'absolute inset-0'
  }

  if (mode === 'vertical-4') {
    return 'absolute left-[5.083%] right-[5.167%] top-[5.62%] bottom-[7.407%]'
  }

  if (mode === 'grid-6') {
    return 'absolute left-[7.667%] right-[7.667%] top-[5.62%] bottom-[7.407%]'
  }

  return compact
    ? 'absolute left-[12%] right-[12%] top-[11%] bottom-[16%]'
    : 'absolute left-[9%] right-[9%] top-[8%] bottom-[12%]'
}

function FramePhotoSlot({
  className = '',
  imageClassName = '',
  slotBackground = 'solid',
  photoSrc,
}: {
  className?: string
  imageClassName?: string
  slotBackground?: 'solid' | 'gradient'
  photoSrc?: string | null
}) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[clamp(3px,0.55cqw,6px)] border border-[#C4BCA3]',
        slotBackground === 'gradient'
          ? 'bg-[linear-gradient(180deg,#EAE5D0_0%,#E7E1C9_100%)]'
          : 'bg-[#E7E1C9]',
        className,
      ].join(' ')}
    >
      {photoSrc ? (
        <Image
          src={photoSrc}
          alt="Ảnh đã chụp"
          fill
          unoptimized
          sizes="(max-width: 768px) 40vw, 220px"
          className={['object-cover', imageClassName].join(' ')}
        />
      ) : null}
    </div>
  )
}

function FramePhotoLayout({
  mode,
  compact,
  slotBackground,
  photoSrc,
  photoSrcs = [],
}: {
  mode: PhotoboothLayoutPreviewMode
  compact: boolean
  slotBackground?: 'solid' | 'gradient'
  photoSrc?: string | null
  photoSrcs?: Array<string | null>
}) {
  function resolveSlotPhotoSrc(slotIndex: number) {
    return photoSrcs[slotIndex] ?? photoSrc ?? null
  }

  if (mode === 'grid-4') {
    return (
      <div className="flex h-full w-full items-start justify-center px-[clamp(4px,1.45cqw,12px)] pt-[clamp(7px,2.05cqw,17px)] pb-[clamp(5px,1.75cqw,14px)]">
        <div className="grid w-full grid-cols-2 gap-0">
          {Array.from({ length: 4 }).map((_, index) => (
            <FramePhotoSlot
              key={index}
              className={[
                'aspect-[430/578] rounded-none border-0 bg-white/75',
                index % 2 === 0 ? 'mr-[-1px]' : 'ml-[-1px]',
                index >= 2 ? 'z-10 mt-[-10px]' : '',
              ].join(' ')}
              imageClassName="object-center scale-[1.04]"
              slotBackground={slotBackground}
              photoSrc={resolveSlotPhotoSrc(index)}
            />
          ))}
        </div>
      </div>
    )
  }

  if (mode === 'vertical-4') {
    return (
      <div
        className="grid h-full w-full grid-cols-2 grid-rows-[320fr_320fr_320fr_320fr] gap-x-[11.513%] gap-y-[2.007%]"
      >
        {Array.from({ length: 8 }).map((_, index) => {
          const sourceSlotIndex = Math.floor(index / 2)

          return (
            <FramePhotoSlot
              key={index}
              className="h-full rounded-none border-0"
              slotBackground={slotBackground}
              photoSrc={resolveSlotPhotoSrc(sourceSlotIndex)}
            />
          )
        })}
      </div>
    )
  }

  if (mode === 'grid-6') {
    return (
      <div
        className="grid h-full grid-cols-2 grid-rows-[466fr_466fr_430fr] content-stretch gap-x-[6.496%] gap-y-0"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <FramePhotoSlot
            key={index}
            className="h-full rounded-none border-0"
            imageClassName={
              index >= 4 ? 'scale-[1.08] -translate-y-[2%]' : 'scale-[1.04]'
            }
            slotBackground={slotBackground}
            photoSrc={resolveSlotPhotoSrc(index)}
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
          ? 'gap-x-[clamp(2px,0.4cqw,4px)] gap-y-[clamp(2px,0.4cqw,4px)]'
          : 'gap-x-[clamp(10px,1.2cqw,16px)] gap-y-[clamp(12px,1.5cqw,18px)]',
      ].join(' ')}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <FramePhotoSlot
          key={index}
          className="aspect-[182/240]"
          slotBackground={slotBackground}
          photoSrc={resolveSlotPhotoSrc(index)}
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
  photoSrc,
  photoSrcs = [],
}: PhotoboothFrameArtworkProps) {
  const overlaySrc = getPhotoboothFrameOverlaySrc(mode)
  const photoBoundsClass = getFramePhotoBounds(mode, compact)
  const isTopAlignedFrame =
    mode === 'grid-4' || mode === 'vertical-4' || mode === 'grid-6'

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
      <div
        className={
          isTopAlignedFrame
            ? 'absolute left-0 top-0 w-full aspect-[1200/1566]'
            : 'absolute inset-0'
        }
      >
        <div className={`${photoBoundsClass} z-0`}>
          <FramePhotoLayout
            mode={mode}
            compact={compact}
            slotBackground={slotBackground}
            photoSrc={photoSrc}
            photoSrcs={photoSrcs}
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <Image
            src={getAssetPath(overlaySrc)}
            alt={overlayAlt}
            fill
            sizes={imageSizes}
            className={isTopAlignedFrame ? 'object-fill' : 'object-contain'}
            priority={imagePriority}
            loading={imagePriority ? 'eager' : 'lazy'}
          />
        </div>
      </div>
    </div>
  )
}
