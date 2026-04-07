import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/shared/layout/PageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/shared/layout/PageBody'
import PhotoboothFooter from '@/src/features/photobooth/components/shared/layout/Footer'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'
import { PHOTOBOOTH_PAYMENT_MOCK } from '@/src/features/photobooth/constants/payment'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { formatPriceVND } from '@/src/features/photobooth/utils/formatPrice'

export default function PaymentPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.payment
  const paymentInfo = PHOTOBOOTH_PAYMENT_MOCK

  const minutes = Math.floor(paymentInfo.expiredInSeconds / 60)
  const seconds = paymentInfo.expiredInSeconds % 60
  const timeText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`

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

        <PhotoboothPageBody className="flex flex-1 flex-col items-center">
          <div className="w-full max-w-[250px] rounded-[18px] border border-[#F2B39B] bg-white/90 p-4 shadow-[0_6px_18px_rgba(0,0,0,0.05)]">
            <div className="flex aspect-square items-center justify-center rounded-[12px] border border-dashed border-[#D6B98B] bg-[#FAF7F2] text-sm text-[#8B7A67]">
              QR thanh toán
            </div>

            <div className="mt-3 text-center text-[12px] font-semibold text-[#2E2A26]">
              {formatPriceVND(paymentInfo.amount)}
            </div>
          </div>

          <div className="mt-5 text-center text-[14px] font-medium text-[#2E2A26]">
            Quét mã để thanh toán
          </div>

          <div className="mt-1 text-center text-[22px] font-semibold text-[#2E2A26]">
            {timeText}
          </div>

          <div className="mt-6 w-full max-w-[220px]">
            <PrimaryButton href={screen.nextHref} fullWidth>
              {screen.primaryActionLabel}
            </PrimaryButton>
          </div>
        </PhotoboothPageBody>

        <PhotoboothFooter />
      </div>
    </PhotoboothScreenShell>
  )
}