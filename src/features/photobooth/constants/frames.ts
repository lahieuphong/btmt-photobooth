export type PhotoboothFrameOption = {
  id: string
  name: string
  previewMode: 'grid-4' | 'vertical-4' | 'grid-6'
}

export const PHOTOBOOTH_FRAME_OPTIONS: PhotoboothFrameOption[] = [
  {
    id: 'new-year',
    name: 'Năm mới',
    previewMode: 'grid-4',
  },
  {
    id: 'festival-1',
    name: 'Lễ hội',
    previewMode: 'grid-4',
  },
  {
    id: 'festival-2',
    name: 'Lễ hội',
    previewMode: 'grid-4',
  },
  {
    id: 'festival-3',
    name: 'Lễ hội',
    previewMode: 'grid-4',
  },
  {
    id: 'festival-4',
    name: 'Lễ hội',
    previewMode: 'grid-4',
  },
]