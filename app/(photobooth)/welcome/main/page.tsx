import PhotoboothScreenShell from '@/src/features/photobooth/components/shared/layout/ScreenShell'
import PhotoboothFooter from '@/src/features/photobooth/components/shared/layout/Footer'
import HeaderControls from '@/src/features/photobooth/components/shared/layout/HeaderControls'
import Image from 'next/image'
import Link from 'next/link'
import { PHOTOBOOTH_SCREEN_STATE_MAP } from '@/src/features/photobooth/config/screenState'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'

export default function WelcomeMainPage() {
  const screen = PHOTOBOOTH_SCREEN_STATE_MAP.welcome

  return (
    <PhotoboothScreenShell backgroundVariant="museum">
      <div className="relative flex h-full flex-col">
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

        <div className="relative z-20 flex h-[clamp(360px,58vh,640px)] flex-col items-center px-[8%] pb-0 pt-[4.5%] text-center">
          <div className="w-[84px]">
            <Image
              src={getAssetPath('/images/logos/logo.svg')}
              alt="Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh"
              width={84}
              height={84}
              priority
            />
          </div>

          <p className="mt-3 font-serif text-[clamp(12px,2.2vw,20px)] font-semibold uppercase leading-[1.3] tracking-[0.03em] text-[#9A2D1E]">
            Bảo Tàng Mỹ Thuật
            <br />
            Thành Phố Hồ Chí Minh
          </p>

          <h1 className="mt-6 font-serif text-[clamp(40px,8.2vw,70px)] font-medium uppercase leading-none tracking-[0.015em] text-[#1F2024]">
            Photobooth
          </h1>

          <div className="mt-[4%] flex w-full flex-1 items-center justify-center">
            <Link
              href={screen.nextHref ?? '/packages'}
              className="inline-flex h-[31vw] w-[31vw] flex-col items-center justify-center rounded-full bg-[#FF5A2A] text-white shadow-[0_8px_16px_rgba(255,90,42,0.28)] transition-all duration-200 hover:brightness-95 active:scale-[0.98]"
            >
              <Image
                src={getAssetPath('/images/illustrations/camera.svg')}
                alt=""
                width={44}
                height={44}
                aria-hidden="true"
                className="h-[6.8vw] w-[6.8vw]"
              />
              <span className="mt-[1.4vw] text-[4.1vw] font-medium leading-none !text-white">
                Bắt đầu ngay
              </span>
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-[3.2%] left-1/2 z-10 w-[92%] max-w-[900px] -translate-x-1/2">
          <div className="relative mx-auto aspect-[16/6.8] w-full">
            <div className="absolute bottom-[0] left-[2%] z-10 w-[50%]">
              <Image
                src={getAssetPath('/images/layouts/photo-grid-2x2.svg')}
                alt=""
                width={620}
                height={930}
                className="h-auto w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]"
              />
            </div>

            <div className="absolute bottom-[0] left-[32.5%] z-20 w-[40%]">
              <Image
                src={getAssetPath('/images/layouts/photo-grid-2x3.svg')}
                alt=""
                width={500}
                height={750}
                className="h-auto w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]"
              />
            </div>

            <div className="absolute bottom-[0] left-[52%] z-30 w-[47%]">
              <Image
                src={getAssetPath('/images/layouts/photo-stack-4.svg')}
                alt=""
                width={620}
                height={930}
                className="h-auto w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]"
              />
            </div>
          </div>
        </div>

        <PhotoboothFooter className="relative z-30" />
      </div>
    </PhotoboothScreenShell>
  )
}
