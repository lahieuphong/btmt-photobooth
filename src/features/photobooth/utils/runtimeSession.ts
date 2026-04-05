import { PHOTOBOOTH_ROUTES } from '@/src/features/photobooth/config/routes'
import { PHOTOBOOTH_PACKAGE_OPTIONS } from '@/src/features/photobooth/constants/packages'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'

export type PhotoboothRuntimeSession = {
  selectedPackageId: string
  selectedLayoutId: string
  captureRoundsRequired: number
  captureRoundsCompleted: number
}

const PHOTOBOOTH_RUNTIME_SESSION_KEY = 'photobooth_runtime_session'

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function getPackageCaptureRounds(packageId: string) {
  return (
    PHOTOBOOTH_PACKAGE_OPTIONS.find((item) => item.id === packageId)?.captureRounds ?? 1
  )
}

export function getDefaultPhotoboothRuntimeSession(): PhotoboothRuntimeSession {
  const selectedPackageId = PHOTOBOOTH_DEFAULT_SESSION.selectedPackageId
  const selectedLayoutId = PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId

  return {
    selectedPackageId,
    selectedLayoutId,
    captureRoundsRequired: getPackageCaptureRounds(selectedPackageId),
    captureRoundsCompleted: 0,
  }
}

export function readPhotoboothRuntimeSession(): PhotoboothRuntimeSession {
  const fallback = getDefaultPhotoboothRuntimeSession()

  if (!canUseSessionStorage()) {
    return fallback
  }

  try {
    const rawValue = window.sessionStorage.getItem(PHOTOBOOTH_RUNTIME_SESSION_KEY)

    if (!rawValue) {
      return fallback
    }

    const parsedValue = JSON.parse(rawValue) as Partial<PhotoboothRuntimeSession>

    const selectedPackageId =
      typeof parsedValue.selectedPackageId === 'string'
        ? parsedValue.selectedPackageId
        : fallback.selectedPackageId

    const selectedLayoutId =
      typeof parsedValue.selectedLayoutId === 'string'
        ? parsedValue.selectedLayoutId
        : fallback.selectedLayoutId

    const captureRoundsRequired =
      typeof parsedValue.captureRoundsRequired === 'number' &&
      parsedValue.captureRoundsRequired > 0
        ? parsedValue.captureRoundsRequired
        : getPackageCaptureRounds(selectedPackageId)

    const captureRoundsCompleted =
      typeof parsedValue.captureRoundsCompleted === 'number' &&
      parsedValue.captureRoundsCompleted >= 0
        ? parsedValue.captureRoundsCompleted
        : 0

    return {
      selectedPackageId,
      selectedLayoutId,
      captureRoundsRequired,
      captureRoundsCompleted,
    }
  } catch {
    return fallback
  }
}

export function writePhotoboothRuntimeSession(value: PhotoboothRuntimeSession) {
  if (!canUseSessionStorage()) {
    return
  }

  window.sessionStorage.setItem(
    PHOTOBOOTH_RUNTIME_SESSION_KEY,
    JSON.stringify(value)
  )
}

export function startPhotoboothRuntimeSession(selectedPackageId: string) {
  const nextValue: PhotoboothRuntimeSession = {
    selectedPackageId,
    selectedLayoutId: PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId,
    captureRoundsRequired: getPackageCaptureRounds(selectedPackageId),
    captureRoundsCompleted: 0,
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function setPhotoboothSelectedLayoutId(selectedLayoutId: string) {
  const currentValue = readPhotoboothRuntimeSession()

  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    selectedLayoutId,
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function completePhotoboothCaptureRound() {
  const currentValue = readPhotoboothRuntimeSession()

  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    captureRoundsCompleted: Math.min(
      currentValue.captureRoundsCompleted + 1,
      currentValue.captureRoundsRequired
    ),
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function getPreviewNextRoute(session: PhotoboothRuntimeSession) {
  if (session.captureRoundsCompleted < session.captureRoundsRequired) {
    return PHOTOBOOTH_ROUTES.LAYOUT
  }

  return PHOTOBOOTH_ROUTES.FRAME
}

export function getCurrentPhotoboothCaptureRound(session: PhotoboothRuntimeSession) {
  return Math.min(session.captureRoundsCompleted + 1, session.captureRoundsRequired)
}

export function getPhotoboothCaptureRoundLabel(session: PhotoboothRuntimeSession) {
  const currentRound = getCurrentPhotoboothCaptureRound(session)

  if (currentRound <= 1) {
    return ''
  }

  return `Lần ${currentRound}`
}

export function getPhotoboothFrameImageCount(session: PhotoboothRuntimeSession) {
  return Math.max(1, session.captureRoundsRequired)
}