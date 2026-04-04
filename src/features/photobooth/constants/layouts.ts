export type PhotoboothLayoutOption = {
  id: string
  label: string
  slots: number
  previewMode: 'grid-4' | 'vertical-4' | 'grid-6'
}

export const PHOTOBOOTH_LAYOUT_OPTIONS: PhotoboothLayoutOption[] = [
  {
    id: 'layout-grid-4',
    label: '4 ảnh lưới',
    slots: 4,
    previewMode: 'grid-4',
  },
  {
    id: 'layout-vertical-4',
    label: '4 ảnh dọc',
    slots: 4,
    previewMode: 'vertical-4',
  },
  {
    id: 'layout-grid-6',
    label: '6 ảnh',
    slots: 6,
    previewMode: 'grid-6',
  },
]