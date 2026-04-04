import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothFooter from '@/src/features/photobooth/components/PhotoboothFooter'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function WelcomePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.welcome

  return (
    <PhotoboothScreenShell backgroundVariant="museum">
      <div className="flex h-full flex-col">
        <div className="flex flex-1 items-center justify-center px-[12%]">
          <div className="w-full max-w-[46%]">
            <PrimaryButton href={screen.nextHref} fullWidth>
              {screen.primaryActionLabel}
            </PrimaryButton>
          </div>
        </div>

        <PhotoboothFooter />
      </div>
    </PhotoboothScreenShell>
  )
}