import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PackageCard from '@/src/features/photobooth/components/PackageCard'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_PACKAGE_OPTIONS } from '@/src/features/photobooth/constants/packages'
import { PHOTOBOOTH_DEFAULT_SESSION } from '@/src/features/photobooth/constants/session'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function PackagesPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.packages
  const selectedPackageId = PHOTOBOOTH_DEFAULT_SESSION.selectedPackageId

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
          <div className="space-y-3">
            {PHOTOBOOTH_PACKAGE_OPTIONS.map((item) => (
              <PackageCard
                key={item.id}
                badge={item.badge}
                lines={item.lines}
                price={item.price}
                selected={item.id === selectedPackageId}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <PrimaryButton href={screen.nextHref}>
              {screen.primaryActionLabel}
            </PrimaryButton>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}