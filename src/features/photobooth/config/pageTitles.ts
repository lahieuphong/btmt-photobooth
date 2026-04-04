export const PHOTOBOOTH_PAGE_TITLES = {
  PACKAGES: 'CHỌN GÓI CHỤP',
  PAYMENT: 'THANH TOÁN',
  LAYOUT: 'CHỌN LAYOUT',
  CUSTOMIZE: 'TÙY CHỈNH',
  CAPTURE: 'CHỤP HÌNH',
  PREVIEW: 'XEM TRƯỚC',
  FRAME: 'CHỌN KHUNG',
  PRINT: 'IN ẢNH',
  CAPTURED: 'HÌNH ĐÃ CHỤP',
} as const

export type PhotoboothPageTitle =
  (typeof PHOTOBOOTH_PAGE_TITLES)[keyof typeof PHOTOBOOTH_PAGE_TITLES]