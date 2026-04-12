export const PHOTOBOOTH_FILTER_CSS_BY_ID: Record<string, string> = {
  original: 'none',
  bright: 'brightness(1.08) saturate(1.2) contrast(1.04)',
  classic: 'sepia(0.28) contrast(0.95) saturate(0.82)',
  nature: 'saturate(1.18) hue-rotate(-8deg) contrast(1.02)',
  bw: 'grayscale(1) contrast(1.06)',
  sunset: 'saturate(1.2) hue-rotate(-12deg) brightness(1.02)',
  cool: 'saturate(1.08) hue-rotate(14deg) contrast(1.02)',
}

export function getPhotoboothFilterCssValue(filterId?: string | null) {
  if (!filterId) {
    return PHOTOBOOTH_FILTER_CSS_BY_ID.original
  }

  return PHOTOBOOTH_FILTER_CSS_BY_ID[filterId] ?? PHOTOBOOTH_FILTER_CSS_BY_ID.original
}
