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

function CustomizeOptionCard({
  name,
  previewClassName,
  isSelected,
}: {
  name: string
  previewClassName: string
  isSelected: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className="flex flex-col items-center text-center transition-all duration-200"
    >
      <div
        className={[
          'w-full overflow-hidden rounded-[10px] border bg-white aspect-[76/46]',
          isSelected ? 'border-[#F15A29]' : 'border-transparent',
        ].join(' ')}
      >
        <div className={`h-full w-full rounded-[8px] ${previewClassName}`} />
      </div>

      <div
        className={[
          'mt-1 text-[10px] leading-[1.2]',
          isSelected ? 'text-[#F15A29]' : 'text-[#5B5B5B]',
        ].join(' ')}
      >
        {name}
      </div>
    </button>
  )
}

function CustomizeMainSection({
  selectedFilterId,
  selectedBackgroundId,
}: {
  selectedFilterId: string
  selectedBackgroundId: string
}) {
  return (
    <div className="mx-auto w-[900px] max-w-full">
      <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#9CC0E9_0%,#D5D2B2_28%,#E7C95F_62%,#D9B54D_100%)]">
        <div className="aspect-[900/730] w-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_46%)]" />
      </div>

      <div className="mt-[2.4%]">
        <div className="text-[14px] font-semibold text-[#2E2A26]">Bộ lọc màu</div>

        <div className="mt-2 grid grid-cols-5 gap-[12px]">
          {PHOTOBOOTH_FILTER_OPTIONS.map((item) => (
            <CustomizeOptionCard
              key={item.id}
              name={item.name}
              previewClassName={item.previewClassName}
              isSelected={item.id === selectedFilterId}
            />
          ))}
        </div>
      </div>

      <div className="mt-[2.4%]">
        <div className="text-[14px] font-semibold text-[#2E2A26]">Phông nền</div>

        <div className="mt-2 grid grid-cols-5 gap-[12px]">
          {PHOTOBOOTH_BACKGROUND_OPTIONS.map((item) => (
            <CustomizeOptionCard
              key={item.id}
              name={item.name}
              previewClassName={item.previewClassName}
              isSelected={item.id === selectedBackgroundId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CustomizeBottomAction({
  nextHref,
  primaryActionLabel,
}: {
  nextHref?: string
  primaryActionLabel?: string
}) {
  return (
    <div className="mt-[2.8%] flex w-full items-end justify-between gap-[16px]">
      <div className="relative h-[78px] w-[58px] shrink-0 rounded-[8px] border border-[#E1D7BC] bg-[#EEE6CC] shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
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

      <PrimaryButton href={nextHref} className="min-w-[142px]">
        {primaryActionLabel}
      </PrimaryButton>
    </div>
  )
}

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

        <PhotoboothPageBody className="flex flex-1 flex-col px-[5.278%] pt-[2.8%] pb-[4.2%]">
          <div className="flex flex-1 flex-col">
            <CustomizeMainSection
              selectedFilterId={selectedFilterId}
              selectedBackgroundId={selectedBackgroundId}
            />

            <CustomizeBottomAction
              nextHref={screen.nextHref}
              primaryActionLabel={screen.primaryActionLabel}
            />
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}