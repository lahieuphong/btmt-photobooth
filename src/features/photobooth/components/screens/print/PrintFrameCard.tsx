import PhotoboothFrameArtwork from '@/src/features/photobooth/components/flow/frame/FrameArtwork'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

type PrintFrameCardProps = {
  mode: PhotoboothLayoutPreviewMode
  priority?: boolean
  photoSrc?: string | null
}

export default function PrintFrameCard({
  mode,
  priority = false,
  photoSrc,
}: PrintFrameCardProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[clamp(6px,1cqw,9px)] border border-[#CFC8B3] bg-[#E1DCC8] shadow-[0_10px_24px_rgba(34,30,4,0.10)]">
      <PhotoboothFrameArtwork
        mode={mode}
        overlayAlt="Khung ảnh in"
        imageSizes="(max-width: 480px) 72vw, (max-width: 768px) 300px, 320px"
        imagePriority={priority}
        slotBackground="solid"
        photoSrc={photoSrc}
      />
    </div>
  )
}
