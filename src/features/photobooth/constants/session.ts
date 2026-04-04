export type PhotoboothSessionState = {
  selectedPackageId: string
  selectedLayoutId: string
  selectedFilterId: string
  selectedBackgroundId: string
  selectedFrameId: string
  selectedCountdown: 5 | 10 | 15
  capturedPhotoIds: string[]
}

export const PHOTOBOOTH_DEFAULT_SESSION: PhotoboothSessionState = {
  selectedPackageId: 'basic',
  selectedLayoutId: 'layout-grid-4',
  selectedFilterId: 'original',
  selectedBackgroundId: 'scenery',
  selectedFrameId: 'new-year',
  selectedCountdown: 10,
  capturedPhotoIds: ['photo-1', 'photo-2', 'photo-3', 'photo-4'],
}