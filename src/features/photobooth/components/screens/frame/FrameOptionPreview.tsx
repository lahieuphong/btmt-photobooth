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
    return (
      <div className="flex aspect-[110/148] w-full items-start justify-center rounded-[12px] bg-[#E7E1C9] p-[6px]">
        <div className="grid w-full grid-cols-2 gap-[3px]">
          {Array.from({ length: mode === 'grid-6' ? 6 : 4 }).map((_, index) => (
            <div
              key={index}
              className={[
                'relative overflow-hidden rounded-[3px] bg-white/75',
                mode === 'grid-6' ? 'aspect-[430/372]' : 'aspect-[430/578]',
              ].join(' ')}
            >
              {photoSrcs[index] ? (
                <Image
                  src={photoSrcs[index]}
                  alt="Ảnh đã chụp"
                  fill
                  unoptimized
                  sizes="48px"
                  className="object-cover"
                />
              ) : null}
            </div>
          ))}
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
