import Image from 'next/image'
import PhotoboothFrameArtwork from '@/src/features/photobooth/components/flow/frame/FrameArtwork'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

type FrameOptionPreviewProps = {
  mode: PhotoboothLayoutPreviewMode
  photoSrcs?: Array<string | null>
  hasFrame?: boolean
}

export default function FrameOptionPreview({
  mode,
  photoSrcs = [],
  hasFrame = true,
}: FrameOptionPreviewProps) {
  if (!hasFrame) {
    const slotCount = mode === 'vertical-4' ? 8 : mode === 'grid-6' ? 6 : 4
    const slotAspectClassName =
      mode === 'vertical-4'
        ? 'aspect-[430/260]'
        : mode === 'grid-6'
          ? 'aspect-[430/372]'
          : 'aspect-[430/578]'

    return (
      <div className="flex aspect-[110/148] w-full items-start justify-center rounded-[12px] bg-[#E7E1C9] px-[5px] pt-[6px] pb-[5px]">
        <div className="grid w-full grid-cols-2 gap-[2px]">
          {Array.from({ length: slotCount }).map((_, index) => {
            const sourceSlotIndex = mode === 'vertical-4' ? Math.floor(index / 2) : index
            const photoSrc = photoSrcs[sourceSlotIndex]

            return (
              <div
                key={index}
                className={[
                  'relative overflow-hidden rounded-[3px] bg-white/75',
                  slotAspectClassName,
                ].join(' ')}
              >
                {photoSrc ? (
                  <Image
                    src={photoSrc}
                    alt="Ảnh đã chụp"
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover"
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-[110/148] w-full rounded-[12px]">
      <PhotoboothFrameArtwork
        mode={mode}
        compact
        overlayAlt="Khung ảnh"
        imageSizes="140px"
        imagePriority={false}
        slotBackground="gradient"
        photoSrcs={photoSrcs}
      />
    </div>
  )
}
