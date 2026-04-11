import PhotoboothFrameArtwork from '@/src/features/photobooth/components/flow/frame/FrameArtwork'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

type FrameOptionPreviewProps = {
  mode: PhotoboothLayoutPreviewMode
  photoSrcs?: Array<string | null>
}

export default function FrameOptionPreview({
  mode,
  photoSrcs = [],
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
        photoSrcs={photoSrcs}
      />
    </div>
  )
}
