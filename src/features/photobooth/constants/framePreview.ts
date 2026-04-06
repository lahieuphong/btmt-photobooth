import {
  getPhotoboothLayoutPreviewMode,
  type PhotoboothLayoutPreviewMode,
} from '@/src/features/photobooth/utils/layoutPreview'
import {
  getPhotoboothRoundLayoutIds,
  readPhotoboothRuntimeSession,
} from '@/src/features/photobooth/utils/runtimeSession'

export const PHOTOBOOTH_FRAME_OVERLAY_BY_MODE: Record<PhotoboothLayoutPreviewMode, string> = {
  'grid-4': '/images/photobooth/frame/frame_1.png',
  'vertical-4': '/images/photobooth/frame/frame_2.png',
  'grid-6': '/images/photobooth/frame/frame_3.png',
}

export const PHOTOBOOTH_FRAME_ARROW_SRC = '/images/photobooth/frame/angle-right.png'

export function getPhotoboothFrameOverlaySrc(mode: PhotoboothLayoutPreviewMode) {
  return PHOTOBOOTH_FRAME_OVERLAY_BY_MODE[mode] ?? PHOTOBOOTH_FRAME_OVERLAY_BY_MODE['grid-4']
}

export function buildPhotoboothPreviewModesFromSession(): PhotoboothLayoutPreviewMode[] {
  const session = readPhotoboothRuntimeSession()

  return getPhotoboothRoundLayoutIds(session).map((layoutId) =>
    getPhotoboothLayoutPreviewMode(layoutId)
  )
}
