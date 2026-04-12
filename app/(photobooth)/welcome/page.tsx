import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import PhotoboothFooter from '@/src/features/photobooth/components/shared/layout/Footer'
import HeaderControls from '@/src/features/photobooth/components/shared/layout/HeaderControls'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'
import WelcomeLoadingGate from '@/src/features/photobooth/components/screens/welcome/WelcomeLoadingGate'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function WelcomePage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.welcome

  return (
    <WelcomeLoadingGate>
      <PhotoboothScreenShell backgroundVariant="plain">
        <div className="flex h-full flex-col">
          <div
            className="w-full px-[3.704%] pt-[4.259%]"
            style={{ containerType: 'inline-size' }}
          >
            <HeaderControls
              showBackButton={screen.showBackButton}
              showLanguageDropdown={screen.showLanguageDropdown}
              languageLabel="VI"
            />
          </div>

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
    </WelcomeLoadingGate>
  )
}
