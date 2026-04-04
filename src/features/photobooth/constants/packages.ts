export type PhotoboothPackageOption = {
  id: string
  badge: string
  lines: string[]
  price: number
  captureRounds: number
}

export const PHOTOBOOTH_PACKAGE_OPTIONS: PhotoboothPackageOption[] = [
  {
    id: 'economy',
    badge: 'TIẾT KIỆM',
    lines: ['In 1 ảnh chất lượng cao', 'Nhận file ảnh online'],
    price: 59000,
    captureRounds: 1,
  },
  {
    id: 'basic',
    badge: 'CƠ BẢN',
    lines: ['In 2 ảnh chất lượng cao', 'Nhận file ảnh online'],
    price: 79000,
    captureRounds: 2,
  },
  {
    id: 'premium',
    badge: 'CAO CẤP',
    lines: ['In 3 ảnh chất lượng cao', 'Nhận file ảnh online'],
    price: 99000,
    captureRounds: 3,
  },
]