import PhotoboothFrameArtwork from '@/src/features/photobooth/components/flow/frame/FrameArtwork'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

type CapturedFrameCardProps = {
  mode: PhotoboothLayoutPreviewMode
}

export default function CapturedFrameCard({
  mode,
}: CapturedFrameCardProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[clamp(6px,1cqw,9px)] border border-[#CFC8B3] bg-[#E1DCC8] shadow-[0_10px_24px_rgba(34,30,4,0.10)]">
      <PhotoboothFrameArtwork
        mode={mode}
        overlayAlt="Khung ảnh đã chụp"
        imageSizes="(max-width: 480px) 76vw, (max-width: 768px) 340px, 390px"
        imagePriority
        slotBackground="solid"
      />
    </div>
  )
}
