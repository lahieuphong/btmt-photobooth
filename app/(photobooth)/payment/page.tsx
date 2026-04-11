'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothFooter from '@/src/features/photobooth/components/shared/layout/Footer'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'
import { PHOTOBOOTH_PACKAGE_OPTIONS } from '@/src/features/photobooth/constants/packages'
import { PHOTOBOOTH_PAYMENT_MOCK } from '@/src/features/photobooth/constants/payment'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'
import { readPhotoboothRuntimeSession } from '@/src/features/photobooth/utils/runtimeSession'

export default function PaymentPage() {
  const router = useRouter()
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.payment
  const paymentInfo = PHOTOBOOTH_PAYMENT_MOCK
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(
    PHOTOBOOTH_PAYMENT_MOCK.expiredInSeconds
  )

  useEffect(() => {
    const runtimeSession = readPhotoboothRuntimeSession()
    setSelectedPackageId(runtimeSession.selectedPackageId ?? null)
  }, [])

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [remainingSeconds])

  useEffect(() => {
    if (!isPaymentSuccess) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      router.push(screen.nextHref ?? '/layout')
    }, 5000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isPaymentSuccess, router, screen.nextHref])

  const selectedAmount = useMemo(() => {
    if (!selectedPackageId) {
      return paymentInfo.amount
    }

    return (
      PHOTOBOOTH_PACKAGE_OPTIONS.find((item) => item.id === selectedPackageId)?.price ??
      paymentInfo.amount
    )
  }, [paymentInfo.amount, selectedPackageId])

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const timeText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`
  const priceTagText = `${new Intl.NumberFormat('vi-VN').format(selectedAmount)} vnd`

  function handleMockPaymentComplete() {
    if (isPaymentSuccess) return
    setIsPaymentSuccess(true)
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

        <PhotoboothPageBody className="flex flex-1 flex-col items-center pt-[14px] pb-0">
          <div className="relative -mt-7 w-full max-w-[215px] pt-[78px] sm:-mt-6">
            <div
              className={[
                'pointer-events-none absolute left-0 right-0 top-0 z-10 h-[66px] rounded-[12px] bg-[#DFF5E8]/75 px-3 text-center transition-opacity duration-200 sm:h-[68px]',
                isPaymentSuccess ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
            >
              <div className="flex translate-y-[2px] flex-col items-center">
                <div className="mx-auto mb-0 grid h-10 w-10 place-items-center">
                  <Image
                    src={getAssetPath('/images/payment/checked.svg')}
                    alt=""
                    width={30}
                    height={30}
                    className="h-[30px] w-[30px]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[13px] font-medium text-[#009245]">Thanh toán thành công</p>
              </div>
            </div>

            <div className="relative rounded-[16px] border border-[#F2B39B] bg-white/90 px-[8px] pt-[8px] pb-[26px]">
              <div className="rounded-[12px] bg-[#F2F2F2] p-[6px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                <div className="relative aspect-square w-full overflow-hidden rounded-[10px] bg-white">
                  <Image
                    src={getAssetPath('/images/payment/qr-frame.svg')}
                    alt="QR thanh toán"
                    fill
                    sizes="(max-width: 768px) 190px, 210px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[65%] whitespace-nowrap rounded-[10px] bg-[#1F2024] px-[24px] py-[10px] text-[14px] font-medium uppercase leading-none tracking-[0.02em] text-white">
                {priceTagText}
              </div>
            </div>
          </div>

          <div className="mt-5 text-center text-[13px] font-medium text-[#2E2A26]">
            Quét mã để thanh toán
          </div>

          <div className="mt-1 text-center text-[18px] font-semibold text-[#2E2A26]">
            {timeText}
          </div>

          <div className="mt-auto w-full max-w-[180px] pb-0 pt-3">
            <PrimaryButton
              onClick={handleMockPaymentComplete}
              disabled={isPaymentSuccess}
              fullWidth
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
