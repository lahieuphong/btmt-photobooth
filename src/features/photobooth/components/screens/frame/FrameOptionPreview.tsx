import PhotoboothFrameArtwork from '@/src/features/photobooth/components/flow/frame/FrameArtwork'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

type FrameOptionPreviewProps = {
  mode: PhotoboothLayoutPreviewMode
  photoSrc?: string | null
}

export default function FrameOptionPreview({
  mode,
  photoSrc,
}: FrameOptionPreviewProps) {
  return (
    <div className="aspect-[110/148] w-full rounded-[12px]">
      <PhotoboothFrameArtwork
        mode={mode}
        compact
        overlayAlt="Khung ảnh"
        imageSizes="140px"
        imagePriority={false}
        slotBackground="gradient"
        photoSrc={photoSrc}
      />
    </div>
  )
}
