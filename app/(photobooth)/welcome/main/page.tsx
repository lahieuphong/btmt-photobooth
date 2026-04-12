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
      <div className="welcome-main-screen relative flex h-full min-h-0 flex-col">
        <div
          className="welcome-main-header w-full shrink-0 px-[3.704%] pt-[calc(env(safe-area-inset-top)+clamp(8px,1.8vh,24px))]"
          style={{ containerType: 'inline-size' }}
        >
          <HeaderControls
            showBackButton={screen.showBackButton}
            showLanguageDropdown={screen.showLanguageDropdown}
            languageLabel="VI"
          />
        </div>

        <div className="welcome-main-content relative z-20 flex min-h-0 flex-1 flex-col items-center px-[8%] pb-[calc(8px+env(safe-area-inset-bottom))] pt-[clamp(8px,2.1vh,24px)] text-center">
          <div className="welcome-main-logo w-[clamp(58px,16vw,84px)]">
            <Image
              src={getAssetPath('/images/logos/logo.svg')}
              alt="Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh"
              width={84}
              height={84}
              priority
              className="h-auto w-full"
            />
          </div>

          <p className="welcome-main-subtitle mt-[clamp(8px,1.5vh,12px)] font-serif text-[clamp(10px,2.2vw,20px)] font-semibold uppercase leading-[1.3] tracking-[0.03em] text-[#9A2D1E]">
            Bảo Tàng Mỹ Thuật
            <br />
            Thành Phố Hồ Chí Minh
          </p>

          <h1 className="welcome-main-title mt-[clamp(10px,2.2vh,24px)] font-serif text-[clamp(34px,10.4vw,70px)] font-medium uppercase leading-none tracking-[0.015em] text-[#1F2024]">
            Photobooth
          </h1>

          <div className="welcome-main-cta-wrap mt-[clamp(12px,3vh,28px)] flex w-full flex-1 items-center justify-center">
            <Link
              href={screen.nextHref ?? '/packages'}
              className="welcome-main-cta inline-flex h-[clamp(116px,31vw,260px)] w-[clamp(116px,31vw,260px)] flex-col items-center justify-center rounded-full bg-[#FF5A2A] text-white shadow-[0_8px_16px_rgba(255,90,42,0.28)] transition-all duration-200 hover:brightness-95 active:scale-[0.98]"
            >
              <Image
                src={getAssetPath('/images/illustrations/camera.svg')}
                alt=""
                width={44}
                height={44}
                aria-hidden="true"
                className="welcome-main-cta-icon h-[clamp(24px,6.8vw,44px)] w-[clamp(24px,6.8vw,44px)]"
              />
              <span className="welcome-main-cta-label mt-[clamp(5px,1.4vw,14px)] text-[clamp(20px,4.1vw,42px)] font-medium leading-none !text-white">
                Bắt đầu ngay
              </span>
            </Link>
          </div>

          <div className="welcome-main-stack pointer-events-none mt-[clamp(10px,1.8vh,24px)] w-[92%] max-w-[900px] shrink-0">
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
        </div>

        <PhotoboothFooter className="welcome-main-footer relative z-30 shrink-0" />
      </div>
    </PhotoboothScreenShell>
  )
}
