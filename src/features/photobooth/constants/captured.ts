export type PhotoboothCapturedPhoto = {
  id: string
  imageUrl: string
}

export const PHOTOBOOTH_CAPTURED_PHOTOS_MOCK: PhotoboothCapturedPhoto[] = [
  { id: 'photo-1', imageUrl: '/mock/photo-1.jpg' },
  { id: 'photo-2', imageUrl: '/mock/photo-2.jpg' },
  { id: 'photo-3', imageUrl: '/mock/photo-3.jpg' },
  { id: 'photo-4', imageUrl: '/mock/photo-4.jpg' },
]