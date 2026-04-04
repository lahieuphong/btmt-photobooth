import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/PhotoboothCaptureRoundHint'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import {
  PHOTOBOOTH_BACKGROUND_OPTIONS,
  PHOTOBOOTH_FILTER_OPTIONS,
} from '@/src/features/photobooth/constants/customize'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function CustomizePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.customize
  const selectedFilterId = PHOTOBOOTH_DEFAULT_SESSION.selectedFilterId
  const selectedBackgroundId = PHOTOBOOTH_DEFAULT_SESSION.selectedBackgroundId

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
          <div className="overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#9CC0E9_0%,#E7C95F_45%,#D9B54D_100%)]">
            <div className="aspect-[0.94] w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent_45%)]" />
          </div>

          <div className="mt-5">
            <div className="mb-2 text-[14px] font-semibold text-[#2E2A26]">
              Bộ lọc màu
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {PHOTOBOOTH_FILTER_OPTIONS.map((item) => {
                const isSelected = item.id === selectedFilterId

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      'min-w-[86px] rounded-[10px] border p-1 text-center',
                      isSelected
                        ? 'border-[#F15A29] bg-white'
                        : 'border-transparent bg-white/80',
                    ].join(' ')}
                  >
                    <div className={`h-[48px] rounded-[8px] ${item.previewClassName}`} />
                    <div
                      className={[
                        'mt-1 text-[11px] font-medium',
                        isSelected ? 'text-[#FF5A2A]' : 'text-[#2E2A26]',
                      ].join(' ')}
                    >
                      {item.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-[14px] font-semibold text-[#2E2A26]">
              Phông nền
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {PHOTOBOOTH_BACKGROUND_OPTIONS.map((item) => {
                const isSelected = item.id === selectedBackgroundId

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      'min-w-[86px] rounded-[10px] border p-1 text-center',
                      isSelected
                        ? 'border-[#F15A29] bg-white'
                        : 'border-transparent bg-white/80',
                    ].join(' ')}
                  >
                    <div className={`h-[48px] rounded-[8px] ${item.previewClassName}`} />
                    <div
                      className={[
                        'mt-1 text-[11px] font-medium',
                        isSelected ? 'text-[#FF5A2A]' : 'text-[#2E2A26]',
                      ].join(' ')}
                    >
                      {item.name}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div className="relative h-[78px] w-[58px] rounded-[8px] border border-[#E1D7BC] bg-[#EEE6CC] shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
              <div className="grid h-full grid-cols-2 gap-1 p-1.5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-[3px] bg-[linear-gradient(135deg,#D8A861,#6FA0D8)]"
                  />
                ))}
              </div>

              <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#171717] text-[10px] font-semibold text-white">
                2
              </div>
            </div>

            <div className="flex-1">
              <PrimaryButton href={screen.nextHref} fullWidth>
                {screen.primaryActionLabel}
              </PrimaryButton>
            </div>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}