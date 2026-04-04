import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function WelcomePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.welcome

  return (
    <PhotoboothScreenShell>
      <div className="flex min-h-[844px] items-center justify-center px-6">
        <div className="w-full max-w-[260px]">
          <PrimaryButton href={screen.nextHref} fullWidth>
            {screen.primaryActionLabel}
          </PrimaryButton>
        </div>
      </div>
    </PhotoboothScreenShell>
  )
}