import { PHOTOBOOTH_PAGE_TITLES } from '@/src/features/photobooth/config/pageTitles'
import { PHOTOBOOTH_ROUTES } from '@/src/features/photobooth/config/routes'

export type PhotoboothScreenState = {
  route: string
  title?: string
  showHeader: boolean
  showBackButton: boolean
  backHref?: string
  nextHref?: string
  primaryActionLabel?: string
  secondaryActionLabel?: string
  secondaryActionHref?: string
}

export const PHOTOBOOTH_SCREEN_STATE_MAP = {
  welcome: {
    route: PHOTOBOOTH_ROUTES.WELCOME,
    showHeader: false,
    showBackButton: false,
    nextHref: PHOTOBOOTH_ROUTES.PACKAGES,
    primaryActionLabel: 'Bắt đầu ngay',
  },

  packages: {
    route: PHOTOBOOTH_ROUTES.PACKAGES,
    title: PHOTOBOOTH_PAGE_TITLES.PACKAGES,
    showHeader: true,
    showBackButton: true,
    backHref: PHOTOBOOTH_ROUTES.WELCOME,
    nextHref: PHOTOBOOTH_ROUTES.PAYMENT,
    primaryActionLabel: 'Xác nhận',
  },

  payment: {
    route: PHOTOBOOTH_ROUTES.PAYMENT,
    title: PHOTOBOOTH_PAGE_TITLES.PAYMENT,
    showHeader: true,
    showBackButton: true,
    backHref: PHOTOBOOTH_ROUTES.PACKAGES,
    nextHref: PHOTOBOOTH_ROUTES.LAYOUT,
    primaryActionLabel: 'Giả lập thanh toán xong',
  },

  layout: {
    route: PHOTOBOOTH_ROUTES.LAYOUT,
    title: PHOTOBOOTH_PAGE_TITLES.LAYOUT,
    showHeader: true,
    showBackButton: true,
    backHref: PHOTOBOOTH_ROUTES.PAYMENT,
    nextHref: PHOTOBOOTH_ROUTES.CUSTOMIZE,
    primaryActionLabel: 'Tiếp tục',
  },

  customize: {
    route: PHOTOBOOTH_ROUTES.CUSTOMIZE,
    title: PHOTOBOOTH_PAGE_TITLES.CUSTOMIZE,
    showHeader: true,
    showBackButton: true,
    backHref: PHOTOBOOTH_ROUTES.LAYOUT,
    nextHref: PHOTOBOOTH_ROUTES.CAPTURE,
    primaryActionLabel: 'Sẵn sàng chụp',
  },

  capture: {
    route: PHOTOBOOTH_ROUTES.CAPTURE,
    title: PHOTOBOOTH_PAGE_TITLES.CAPTURE,
    showHeader: true,
    showBackButton: true,
    backHref: PHOTOBOOTH_ROUTES.CUSTOMIZE,
    nextHref: PHOTOBOOTH_ROUTES.PREVIEW,
    primaryActionLabel: 'Chụp',
  },

  preview: {
    route: PHOTOBOOTH_ROUTES.PREVIEW,
    title: PHOTOBOOTH_PAGE_TITLES.PREVIEW,
    showHeader: true,
    showBackButton: true,
    backHref: PHOTOBOOTH_ROUTES.CAPTURE,
    nextHref: PHOTOBOOTH_ROUTES.FRAME,
    primaryActionLabel: 'Chọn khung',
    secondaryActionLabel: 'Chụp lại tất cả',
    secondaryActionHref: PHOTOBOOTH_ROUTES.CAPTURE,
  },

  frame: {
    route: PHOTOBOOTH_ROUTES.FRAME,
    title: PHOTOBOOTH_PAGE_TITLES.FRAME,
    showHeader: true,
    showBackButton: true,
    backHref: PHOTOBOOTH_ROUTES.PREVIEW,
    nextHref: PHOTOBOOTH_ROUTES.PRINT,
    primaryActionLabel: 'Hoàn tất',
  },

  print: {
    route: PHOTOBOOTH_ROUTES.PRINT,
    title: PHOTOBOOTH_PAGE_TITLES.PRINT,
    showHeader: true,
    showBackButton: true,
    backHref: PHOTOBOOTH_ROUTES.FRAME,
    nextHref: PHOTOBOOTH_ROUTES.CAPTURED,
  },

  captured: {
    route: PHOTOBOOTH_ROUTES.CAPTURED,
    title: PHOTOBOOTH_PAGE_TITLES.CAPTURED,
    showHeader: true,
    showBackButton: true,
    backHref: PHOTOBOOTH_ROUTES.WELCOME,
    nextHref: PHOTOBOOTH_ROUTES.CAPTURE,
    primaryActionLabel: 'Chụp lại',
    secondaryActionLabel: 'Quay về',
    secondaryActionHref: PHOTOBOOTH_ROUTES.WELCOME,
  },
} as const