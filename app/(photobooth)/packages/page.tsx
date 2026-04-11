'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothFooter from '@/src/features/photobooth/components/shared/layout/Footer'
import PackageCard from '@/src/features/photobooth/components/screens/packages/PackageCard'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'
import { PHOTOBOOTH_PACKAGE_OPTIONS } from '@/src/features/photobooth/constants/packages'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { startPhotoboothRuntimeSession } from '@/src/features/photobooth/utils/runtimeSession'

export default function PackagesPage() {
  const router = useRouter()
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.packages

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)

  function handleConfirmPackage() {
    if (!selectedPackageId) return
    startPhotoboothRuntimeSession(selectedPackageId)
    router.push(screen.nextHref ?? '/payment')
  }

  return (
    <PhotoboothScreenShell backgroundVariant="museum">
      <div className="flex h-full flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          showLanguageDropdown={screen.showLanguageDropdown}
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex flex-1 flex-col px-[14px] pt-[20px] pb-0">
          <div className="mx-auto w-[60%] space-y-3">
            {PHOTOBOOTH_PACKAGE_OPTIONS.map((item) => (
              <PackageCard
                key={item.id}
                badge={item.badge}
                lines={item.lines}
                price={item.price}
                selected={item.id === selectedPackageId}
                onClick={() => setSelectedPackageId(item.id)}
              />
            ))}
          </div>

          <div className="mt-auto flex justify-center pb-0 pt-4">
            <PrimaryButton
              onClick={handleConfirmPackage}
              disabled={!selectedPackageId}
              className="min-w-[142px]"
            >
              {screen.primaryActionLabel}
            </PrimaryButton>
          </div>
        </PhotoboothPageBody>

        <PhotoboothFooter />
      </div>
    </PhotoboothScreenShell>
  )
}
