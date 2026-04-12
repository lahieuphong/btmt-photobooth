import { PHOTOBOOTH_ROUTES } from '@/src/features/photobooth/config/routes'
import { PHOTOBOOTH_PACKAGE_OPTIONS } from '@/src/features/photobooth/constants/packages'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'

export type PhotoboothRuntimeSession = {
  selectedPackageId: string
  selectedLayoutId: string
  selectedFilterId: string
  captureRoundsRequired: number
  captureRoundsCompleted: number
  completedRoundLayoutIds: string[]
  latestCaptureDataUrl: string | null
  capturedRoundImageDataUrls: Array<Array<string | null>>
  retakeTargetRoundIndex: number | null
  retakeTargetSlotIndex: number | null
  retakeDraftImageDataUrl: string | null
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

function sanitizeCompletedRoundLayoutIds(value: unknown, maxLength: number) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((item): item is string => typeof item === 'string' && item.length > 0)
    .slice(0, maxLength)
}

function sanitizeLatestCaptureDataUrl(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : null
}

function sanitizeCapturedRoundImageDataUrls(
  value: unknown,
  maxRounds: number
): Array<Array<string | null>> {
  const sanitized: Array<Array<string | null>> = Array.from(
    { length: maxRounds },
    () => []
  )

  if (!Array.isArray(value)) {
    return sanitized
  }

  for (let round = 0; round < maxRounds; round += 1) {
    if (!Array.isArray(value[round])) {
      continue
    }

    sanitized[round] = value[round].map((slotValue: unknown) =>
      sanitizeLatestCaptureDataUrl(slotValue)
    )
  }

  return sanitized
}

function sanitizeRetakeTargetIndex(value: unknown, maxValue: number) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    return null
  }

  if (maxValue < 0) {
    return null
  }

  return Math.min(value, maxValue)
}

export function getDefaultPhotoboothRuntimeSession(): PhotoboothRuntimeSession {
  const selectedPackageId = PHOTOBOOTH_DEFAULT_SESSION.selectedPackageId
  const selectedLayoutId = PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId

  return {
    selectedPackageId,
    selectedLayoutId,
    selectedFilterId: PHOTOBOOTH_DEFAULT_SESSION.selectedFilterId,
    captureRoundsRequired: getPackageCaptureRounds(selectedPackageId),
    captureRoundsCompleted: 0,
    completedRoundLayoutIds: [],
    latestCaptureDataUrl: null,
    capturedRoundImageDataUrls: [],
    retakeTargetRoundIndex: null,
    retakeTargetSlotIndex: null,
    retakeDraftImageDataUrl: null,
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
    const selectedFilterId =
      typeof parsedValue.selectedFilterId === 'string'
        ? parsedValue.selectedFilterId
        : fallback.selectedFilterId

    const captureRoundsRequired =
      typeof parsedValue.captureRoundsRequired === 'number' &&
      parsedValue.captureRoundsRequired > 0
        ? parsedValue.captureRoundsRequired
        : getPackageCaptureRounds(selectedPackageId)

    const captureRoundsCompleted =
      typeof parsedValue.captureRoundsCompleted === 'number' &&
      parsedValue.captureRoundsCompleted >= 0
        ? Math.min(parsedValue.captureRoundsCompleted, captureRoundsRequired)
        : 0

    const completedRoundLayoutIds = sanitizeCompletedRoundLayoutIds(
      parsedValue.completedRoundLayoutIds,
      captureRoundsRequired
    )
    const latestCaptureDataUrl = sanitizeLatestCaptureDataUrl(
      parsedValue.latestCaptureDataUrl
    )
    const capturedRoundImageDataUrls = sanitizeCapturedRoundImageDataUrls(
      parsedValue.capturedRoundImageDataUrls,
      captureRoundsRequired
    )
    const retakeTargetRoundIndex = sanitizeRetakeTargetIndex(
      parsedValue.retakeTargetRoundIndex,
      Math.max(captureRoundsRequired - 1, 0)
    )
    const roundSlotsCount =
      retakeTargetRoundIndex !== null
        ? (capturedRoundImageDataUrls[retakeTargetRoundIndex]?.length ?? 0)
        : 0
    const retakeTargetSlotIndex =
      retakeTargetRoundIndex !== null
        ? sanitizeRetakeTargetIndex(parsedValue.retakeTargetSlotIndex, roundSlotsCount - 1)
        : null
    const retakeDraftImageDataUrl =
      retakeTargetRoundIndex !== null && retakeTargetSlotIndex !== null
        ? sanitizeLatestCaptureDataUrl(parsedValue.retakeDraftImageDataUrl)
        : null

    return {
      selectedPackageId,
      selectedLayoutId,
      selectedFilterId,
      captureRoundsRequired,
      captureRoundsCompleted,
      completedRoundLayoutIds,
      latestCaptureDataUrl,
      capturedRoundImageDataUrls,
      retakeTargetRoundIndex,
      retakeTargetSlotIndex,
      retakeDraftImageDataUrl,
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
    selectedFilterId: PHOTOBOOTH_DEFAULT_SESSION.selectedFilterId,
    captureRoundsRequired: getPackageCaptureRounds(selectedPackageId),
    captureRoundsCompleted: 0,
    completedRoundLayoutIds: [],
    latestCaptureDataUrl: null,
    capturedRoundImageDataUrls: [],
    retakeTargetRoundIndex: null,
    retakeTargetSlotIndex: null,
    retakeDraftImageDataUrl: null,
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

export function setPhotoboothSelectedFilterId(selectedFilterId: string) {
  const currentValue = readPhotoboothRuntimeSession()

  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    selectedFilterId,
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function completePhotoboothCaptureRound() {
  const currentValue = readPhotoboothRuntimeSession()

  const currentRoundIndex = Math.min(
    currentValue.captureRoundsCompleted,
    Math.max(currentValue.captureRoundsRequired - 1, 0)
  )

  const nextCompletedRoundLayoutIds = [...currentValue.completedRoundLayoutIds]
  nextCompletedRoundLayoutIds[currentRoundIndex] = currentValue.selectedLayoutId

  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    captureRoundsCompleted: Math.min(
      currentValue.captureRoundsCompleted + 1,
      currentValue.captureRoundsRequired
    ),
    completedRoundLayoutIds: nextCompletedRoundLayoutIds.slice(
      0,
      currentValue.captureRoundsRequired
    ),
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function setPhotoboothLatestCaptureDataUrl(dataUrl: string | null) {
  const currentValue = readPhotoboothRuntimeSession()
  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    latestCaptureDataUrl: sanitizeLatestCaptureDataUrl(dataUrl),
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function setPhotoboothCaptureRoundImageDataUrl(
  dataUrl: string | null,
  slotIndex: number
) {
  const currentValue = readPhotoboothRuntimeSession()
  const currentRoundIndex = Math.min(
    currentValue.captureRoundsCompleted,
    Math.max(currentValue.captureRoundsRequired - 1, 0)
  )
  const safeSlotIndex = Math.max(0, slotIndex)

  const nextCapturedRoundImageDataUrls = sanitizeCapturedRoundImageDataUrls(
    currentValue.capturedRoundImageDataUrls,
    currentValue.captureRoundsRequired
  )
  const nextCurrentRoundSlots = [
    ...(nextCapturedRoundImageDataUrls[currentRoundIndex] ?? []),
  ]

  nextCurrentRoundSlots[safeSlotIndex] =
    sanitizeLatestCaptureDataUrl(dataUrl)
  nextCapturedRoundImageDataUrls[currentRoundIndex] = nextCurrentRoundSlots

  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    latestCaptureDataUrl: sanitizeLatestCaptureDataUrl(dataUrl),
    capturedRoundImageDataUrls: nextCapturedRoundImageDataUrls,
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function startPhotoboothSingleRetake(roundIndex: number, slotIndex: number) {
  const currentValue = readPhotoboothRuntimeSession()
  const safeRoundIndex = Math.min(
    Math.max(0, roundIndex),
    Math.max(currentValue.captureRoundsRequired - 1, 0)
  )
  const currentRoundSlots =
    currentValue.capturedRoundImageDataUrls[safeRoundIndex]?.length ?? 0
  const safeSlotIndex = Math.min(Math.max(0, slotIndex), Math.max(currentRoundSlots - 1, 0))

  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    retakeTargetRoundIndex: safeRoundIndex,
    retakeTargetSlotIndex: safeSlotIndex,
    retakeDraftImageDataUrl: null,
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function setPhotoboothRetakeDraftImageDataUrl(dataUrl: string | null) {
  const currentValue = readPhotoboothRuntimeSession()

  if (
    currentValue.retakeTargetRoundIndex === null ||
    currentValue.retakeTargetSlotIndex === null
  ) {
    return currentValue
  }

  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    retakeDraftImageDataUrl: sanitizeLatestCaptureDataUrl(dataUrl),
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function commitPhotoboothSingleRetake() {
  const currentValue = readPhotoboothRuntimeSession()

  if (
    currentValue.retakeTargetRoundIndex === null ||
    currentValue.retakeTargetSlotIndex === null ||
    !currentValue.retakeDraftImageDataUrl
  ) {
    return currentValue
  }

  const nextCapturedRoundImageDataUrls = sanitizeCapturedRoundImageDataUrls(
    currentValue.capturedRoundImageDataUrls,
    currentValue.captureRoundsRequired
  )
  const nextRoundImages = [
    ...(nextCapturedRoundImageDataUrls[currentValue.retakeTargetRoundIndex] ?? []),
  ]

  nextRoundImages[currentValue.retakeTargetSlotIndex] = currentValue.retakeDraftImageDataUrl
  nextCapturedRoundImageDataUrls[currentValue.retakeTargetRoundIndex] = nextRoundImages

  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    latestCaptureDataUrl: currentValue.retakeDraftImageDataUrl,
    capturedRoundImageDataUrls: nextCapturedRoundImageDataUrls,
    retakeTargetRoundIndex: null,
    retakeTargetSlotIndex: null,
    retakeDraftImageDataUrl: null,
  }

  writePhotoboothRuntimeSession(nextValue)

  return nextValue
}

export function clearPhotoboothSingleRetake() {
  const currentValue = readPhotoboothRuntimeSession()
  const nextValue: PhotoboothRuntimeSession = {
    ...currentValue,
    retakeTargetRoundIndex: null,
    retakeTargetSlotIndex: null,
    retakeDraftImageDataUrl: null,
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

  if (session.captureRoundsRequired <= 1) {
    return ''
  }

  return `Lần ${currentRound}`
}

export function getPhotoboothFrameImageCount(session: PhotoboothRuntimeSession) {
  return Math.max(1, session.captureRoundsRequired)
}

export function getPhotoboothRoundLayoutIds(session: PhotoboothRuntimeSession) {
  const totalRounds = Math.max(1, session.captureRoundsRequired)
  const fallbackLayoutId =
    session.selectedLayoutId || PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId

  return Array.from({ length: totalRounds }, (_, index) => {
    return session.completedRoundLayoutIds[index] ?? fallbackLayoutId
  })
}

export function getPhotoboothRoundImageDataUrls(session: PhotoboothRuntimeSession) {
  const totalRounds = Math.max(1, session.captureRoundsRequired)
  const sanitized = sanitizeCapturedRoundImageDataUrls(
    session.capturedRoundImageDataUrls,
    totalRounds
  )

  return Array.from({ length: totalRounds }, (_, index) => sanitized[index] ?? [])
}
