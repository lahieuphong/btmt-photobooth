import { PHOTOBOOTH_LAYOUT_OPTIONS } from '@/src/features/photobooth/constants/layouts'

export type PhotoboothLayoutPreviewMode = 'grid-4' | 'vertical-4' | 'grid-6'

export function getPhotoboothLayoutPreviewMode(
  layoutId?: string
): PhotoboothLayoutPreviewMode {
  return (
    PHOTOBOOTH_LAYOUT_OPTIONS.find((item) => item.id === layoutId)?.previewMode ??
    'grid-4'
  )
}