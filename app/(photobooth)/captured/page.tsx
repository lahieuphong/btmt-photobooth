import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_CAPTURED_PHOTOS_MOCK } from '@/src/features/photobooth/constants/captured'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function CapturedPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.captured
  const photos = PHOTOBOOTH_CAPTURED_PHOTOS_MOCK

  return (
    <PhotoboothScreenShell>
      <div className="flex min-h-[844px] flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex flex-1 flex-col">
          <div className="relative mx-auto h-[360px] w-[290px]">
            <div className="absolute left-[8px] top-[24px] h-[282px] w-[210px] -rotate-[7deg] rounded-[3px] bg-[#EEE6CC]" />
            <div className="absolute left-[56px] top-[10px] h-[282px] w-[210px] rotate-[7deg] rounded-[3px] bg-[#E8E1C7]" />

            <div className="absolute left-[38px] top-[22px] h-[300px] w-[230px] rounded-[3px] bg-[#E8E1C7] p-4 shadow-[0_8px_20px_rgba(0,0,0,0.10)]">
              <div className="grid grid-cols-2 gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-[0.78] rounded-[2px] bg-[linear-gradient(180deg,#D7A489_0%,#F2D6BC_20%,#C99642_100%)]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-8 text-[#364152]">
            <button type="button" className="text-[28px] leading-none">
              ‹
            </button>
            <div className="text-[16px] font-medium text-[#2E2A26]">Hình 1</div>
            <button type="button" className="text-[28px] leading-none">
              ›
            </button>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 pt-8">
            <PrimaryButton href={screen.secondaryActionHref} variant="secondary" fullWidth>
              {screen.secondaryActionLabel}
            </PrimaryButton>

            <PrimaryButton href={screen.nextHref} fullWidth>
              {screen.primaryActionLabel}
            </PrimaryButton>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}