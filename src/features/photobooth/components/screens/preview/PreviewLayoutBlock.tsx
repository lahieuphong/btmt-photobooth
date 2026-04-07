import Image from 'next/image'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

function PreviewPhotoCard({
  className = '',
  imageSrc,
}: {
  className?: string
  imageSrc?: string | null
}) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[12px]',
        'bg-[#E8E5CC]',
        className,
      ].join(' ')}
    >
      {imageSrc ? (
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
    </div>
  )
}

export default function PreviewLayoutBlock({
  mode,
  previewImageSrc = null,
}: {
  mode: PhotoboothLayoutPreviewMode
  previewImageSrc?: string | null
}) {
  const frameClassName = 'mx-auto h-full w-auto max-w-full aspect-[900/1196]'

  const frameContentClassName = 'flex h-full w-full items-center justify-center'

  const frameInnerClassName = 'w-[97.7778%] max-w-full'

  if (mode === 'vertical-4') {
    return (
      <div className={frameClassName}>
        <div className={frameContentClassName}>
          <div className={frameInnerClassName}>
            <div className="mx-auto grid w-[48%] grid-cols-1 gap-[14px]">
              {Array.from({ length: 4 }).map((_, index) => (
                <PreviewPhotoCard
                  key={index}
                  className="aspect-[430/260]"
                  imageSrc={previewImageSrc}
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
            <div className="grid grid-cols-2 gap-[14px]">
              {Array.from({ length: 6 }).map((_, index) => (
                <PreviewPhotoCard
                  key={index}
                  className="aspect-[430/372]"
                  imageSrc={previewImageSrc}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={frameClassName}>
      <div className={frameContentClassName}>
        <div className={frameInnerClassName}>
          <div className="grid grid-cols-2 gap-[14px]">
            {Array.from({ length: 4 }).map((_, index) => (
              <PreviewPhotoCard
                key={index}
                className="aspect-[430/578]"
                imageSrc={previewImageSrc}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
