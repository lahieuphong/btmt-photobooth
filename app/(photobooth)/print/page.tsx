import PhotoboothScreenShell from '@/src/features/photobooth/components/PhotoboothScreenShell'
import PhotoboothPageHeader from '@/src/features/photobooth/components/PhotoboothPageHeader'
import PhotoboothPageBody from '@/src/features/photobooth/components/PhotoboothPageBody'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'
import { PHOTOBOOTH_PAYMENT_MOCK } from '@/src/features/photobooth/constants/payment'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'

export default function PrintPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.print
  const paymentInfo = PHOTOBOOTH_PAYMENT_MOCK

  return (
    <PhotoboothScreenShell>
      <div className="flex min-h-[844px] flex-col">
        <PhotoboothPageHeader
          title={screen.title}
          backHref={screen.backHref}
          showBackButton={screen.showBackButton}
          languageLabel="VI"
        />

        <PhotoboothPageBody className="flex flex-1 flex-col items-center">
          <div className="max-w-[260px] text-center text-[18px] font-medium leading-[1.35] text-[#2E2A26]">
            Hình ảnh đang được in,
            <br />
            vui lòng chờ giây lát
          </div>

          <div className="relative mt-8 h-[320px] w-[235px]">
            <div className="absolute left-[56px] top-[8px] h-[250px] w-[170px] rotate-[10deg] rounded-[3px] bg-[#E8E1C7]" />
            <div className="absolute left-[28px] top-[2px] h-[260px] w-[182px] -rotate-[8deg] rounded-[3px] bg-[#EEE6CC]" />
            <div className="absolute left-[34px] top-[18px] h-[270px] w-[190px] rounded-[3px] bg-[#E8E1C7] p-3 shadow-[0_8px_20px_rgba(0,0,0,0.10)]">
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[0.76] rounded-[2px] bg-[linear-gradient(180deg,#D7A489_0%,#F2D6BC_20%,#C99642_100%)]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex h-[110px] w-[110px] items-center justify-center rounded-[12px] border border-[#F15A29] bg-white">
            <div className="grid grid-cols-5 gap-[2px]">
              {Array.from({ length: 25 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-[8px] w-[8px] ${index % 2 === 0 ? 'bg-black' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 text-center text-[15px] text-[#2E2A26]">
            Quét mã QR để nhận file online
          </div>

          <div className="mt-2 text-center text-[11px] text-[#7B7B7B]">
            {paymentInfo.qrText}
          </div>

          <div className="mt-6 w-full max-w-[220px]">
            <PrimaryButton href={screen.nextHref} fullWidth>
              {screen.primaryActionLabel}
            </PrimaryButton>
          </div>
        </PhotoboothPageBody>
      </div>
    </PhotoboothScreenShell>
  )
}