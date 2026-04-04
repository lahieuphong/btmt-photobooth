'use client'

import { useRouter } from 'next/navigation'
import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/PhotoboothCaptureRoundHint'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_CAPTURED_PHOTOS_MOCK } from '@/src/features/photobooth/constants/captured'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import {
  completePhotoboothCaptureRound,
  getPreviewNextRoute,
} from '@/src/features/photobooth/utils/runtimeSession'

export default function PreviewPage() {
  const router = useRouter()
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.preview
  const photos = PHOTOBOOTH_CAPTURED_PHOTOS_MOCK

  function handleConfirmPreview() {
    const updatedSession = completePhotoboothCaptureRound()
    const nextRoute = getPreviewNextRoute(updatedSession)

    router.push(nextRoute)
  }

  function handleRetakeAll() {
    router.push(screen.secondaryActionHref ?? '/capture')
  }

  return (
    <PhotoboothScreenShell>
      <div className="flex min-h-[844px] flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
          titleBottomSlot={<PhotoboothCaptureRoundHint />}
        />

        <PhotoboothPageBody className="flex flex-1 flex-col">
          <div className="grid grid-cols-2 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-[0.78] rounded-[18px] bg-[linear-gradient(180deg,#9CC0E9_0%,#E7C95F_45%,#D9B54D_100%)] shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
              />
            ))}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 pt-8">
            <PrimaryButton variant="secondary" fullWidth onClick={handleRetakeAll}>
              {screen.secondaryActionLabel}
            </PrimaryButton>

            <PrimaryButton fullWidth onClick={handleConfirmPreview}>
              {screen.primaryActionLabel}
            </PrimaryButton>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}