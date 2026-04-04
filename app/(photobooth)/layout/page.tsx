import PhotoboothCaptureRoundHint from '@/src/features/photobooth/components/PhotoboothCaptureRoundHint'
import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_LAYOUT_OPTIONS } from '@/src/features/photobooth/constants/layouts'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function LayoutPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.layout
  const selectedLayoutId = PHOTOBOOTH_DEFAULT_SESSION.selectedLayoutId

  const selectedLayout =
    PHOTOBOOTH_LAYOUT_OPTIONS.find((item) => item.id === selectedLayoutId) ??
    PHOTOBOOTH_LAYOUT_OPTIONS[0]

  const previewCount = selectedLayout.slots

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
          <div className="flex gap-2">
            {PHOTOBOOTH_LAYOUT_OPTIONS.map((item) => {
              const isSelected = item.id === selectedLayoutId

              return (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    'flex-1 rounded-md px-3 py-2 text-[10px] font-semibold text-white',
                    isSelected ? 'bg-[#171717]' : 'bg-[#8E8E8E]',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <div
            className={[
              'mt-5 grid gap-3',
              previewCount === 6 ? 'grid-cols-2' : 'grid-cols-2',
            ].join(' ')}
          >
            {Array.from({ length: previewCount }).map((_, index) => (
              <div
                key={index}
                className="aspect-[0.82] rounded-[10px] bg-[#EFEFEF] shadow-inner"
              />
            ))}
          </div>

          <div className="mt-auto flex justify-center pt-6">
            <PrimaryButton href={screen.nextHref}>
              {screen.primaryActionLabel}
            </PrimaryButton>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}