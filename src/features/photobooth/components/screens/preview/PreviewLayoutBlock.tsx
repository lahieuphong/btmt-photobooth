import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

function PreviewPhotoCard({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      className={[
        'overflow-hidden rounded-[12px]',
        'bg-[linear-gradient(180deg,#9CC0E9_0%,#D5D2B2_28%,#E7C95F_62%,#D9B54D_100%)]',
        className,
      ].join(' ')}
    >
      <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_46%)]" />
    </div>
  )
}

export default function PreviewLayoutBlock({
  mode,
}: {
  mode: PhotoboothLayoutPreviewMode
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
                <PreviewPhotoCard key={index} className="aspect-[430/260]" />
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
                <PreviewPhotoCard key={index} className="aspect-[430/372]" />
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
              <PreviewPhotoCard key={index} className="aspect-[430/578]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
