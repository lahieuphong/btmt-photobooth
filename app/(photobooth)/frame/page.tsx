import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_FRAME_OPTIONS } from '@/src/features/photobooth/constants/frames'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function FramePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.frame
  const selectedFrameId = PHOTOBOOTH_DEFAULT_SESSION.selectedFrameId

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
          <div className="flex gap-4">
            <div className="relative flex-1 rounded-[6px] bg-[#E8E1C7] px-4 py-5 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[0.76] rounded-[2px] bg-[linear-gradient(180deg,#D6B39D_0%,#F1D7B4_20%,#D4A74B_100%)]"
                  />
                ))}
              </div>
            </div>

            <div className="w-[74px] space-y-4">
              {PHOTOBOOTH_FRAME_OPTIONS.map((item) => {
                const isSelected = item.id === selectedFrameId

                return (
                  <button key={item.id} type="button" className="block w-full text-center">
                    <div
                      className={[
                        'mx-auto h-[78px] w-[58px] rounded-[6px] border bg-[#EADFCB] p-1',
                        isSelected ? 'border-[#F15A29]' : 'border-transparent',
                      ].join(' ')}
                    >
                      <div className="grid h-full grid-cols-2 gap-1">
                        {Array.from({ length: 4 }).map((_, innerIndex) => (
                          <div
                            key={innerIndex}
                            className="rounded-[2px] bg-[#D6C6A9]"
                          />
                        ))}
                      </div>
                    </div>

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

          <div className="mt-6 flex items-center justify-center gap-8 text-[#364152]">
            <button type="button" className="text-[28px] leading-none">
              ‹
            </button>
            <div className="text-[16px] font-medium text-[#2E2A26]">Hình 1</div>
            <button type="button" className="text-[28px] leading-none">
              ›
            </button>
          </div>

          <div className="mt-auto flex justify-center pt-8">
            <PrimaryButton href={screen.nextHref} className="min-w-[190px]">
              {screen.primaryActionLabel}
            </PrimaryButton>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}