import Image from 'next/image'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'

function PreviewPhotoCard({
  className = '',
  imageSrc,
  slotIndex,
  onRetakeImage,
  canRetake = false,
}: {
  className?: string
  imageSrc?: string | null
  slotIndex: number
  onRetakeImage?: (slotIndex: number) => void
  canRetake?: boolean
}) {
  return (
    <div
      className={[
        'group relative overflow-hidden rounded-xl',
        'bg-[#E8E5CC]',
        className,
      ].join(' ')}
    >
      {imageSrc && typeof imageSrc === 'string' && imageSrc.trim() !== '' ? (
        <Image
          src={imageSrc}
          alt="Ảnh vừa chụp"
          fill
          unoptimized
          sizes="(max-width: 768px) 45vw, 280px"
          className="absolute inset-0 object-cover"
        />
      ) : null}
      <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_52%)]" />

      {canRetake && imageSrc ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/8 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onRetakeImage?.(slotIndex)}
            className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FF5A2A] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(255,90,42,0.35)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Image
              src={getAssetPath('/images/photobooth/preview/arrow-rotate-left.svg')}
              alt=""
              aria-hidden="true"
              width={12}
              height={12}
              className="h-3 w-3"
            />
            Chụp lại
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function PreviewLayoutBlock({
  mode,
  previewImages = [],
  onRetakeImage,
  enableRetake = false,
}: {
  mode: PhotoboothLayoutPreviewMode
  previewImages?: (string | null)[]
  onRetakeImage?: (slotIndex: number) => void
  enableRetake?: boolean
}) {
  const frameClassName = 'mx-auto h-full w-auto max-w-full aspect-[900/1196]'

  const frameContentClassName = 'flex h-full w-full items-center justify-center'

  const frameInnerClassName = 'w-[97.7778%] max-w-full'

  if (mode === 'vertical-4') {
    return (
      <div className={frameClassName}>
        <div className={frameContentClassName}>
          <div className={frameInnerClassName}>
            <div className="mx-auto grid w-[48%] grid-cols-1 gap-3.5">
              {Array.from({ length: 4 }).map((_, index) => (
                <PreviewPhotoCard
                  key={index}
                  className="aspect-430/260"
                  imageSrc={previewImages[index] || null}
                  slotIndex={index}
                  onRetakeImage={onRetakeImage}
                  canRetake={enableRetake}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'grid-6') {
    return (
      <div className={frameClassName}>
        <div className={frameContentClassName}>
          <div className={frameInnerClassName}>
            <div className="grid grid-cols-2 gap-3.5">
              {Array.from({ length: 6 }).map((_, index) => (
                <PreviewPhotoCard
                  key={index}
                  className="aspect-430/372"
                  imageSrc={previewImages[index] || null}
                  slotIndex={index}
                  onRetakeImage={onRetakeImage}
                  canRetake={enableRetake}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default: grid-4 or single
  return (
    <div className={frameClassName}>
      <div className={frameContentClassName}>
        <div className={frameInnerClassName}>
          <div className="grid grid-cols-2 gap-3.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <PreviewPhotoCard
                key={index}
                className="aspect-430/578"
                imageSrc={previewImages[index] || null}
                slotIndex={index}
                onRetakeImage={onRetakeImage}
                canRetake={enableRetake}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
