import { ReactNode } from 'react'
import HeaderControls from './HeaderControls'
import { PHOTOBOOTH_ROUTES } from '@/src/features/photobooth/config/routes'

type PhotoboothPageHeaderProps = {
  title: string
  backHref?: string
  showBackButton?: boolean
  showLanguageDropdown?: boolean
  languageLabel?: 'VI' | 'EN' | 'CH'
  rightSlot?: ReactNode
  titleBottomSlot?: ReactNode
  titleClassName?: string
}

export default function PhotoboothPageHeader({
  title,
  backHref = PHOTOBOOTH_ROUTES.WELCOME,
  showBackButton = true,
  showLanguageDropdown = true,
  languageLabel = 'VI',
  rightSlot,
  titleBottomSlot,
  titleClassName = '',
}: PhotoboothPageHeaderProps) {
  return (
    <div
      className="w-full px-[3.704%] pt-[4.259%]"
      style={{ containerType: 'inline-size' }}
    >
      <HeaderControls
        backHref={backHref}
        showBackButton={showBackButton}
        showLanguageDropdown={showLanguageDropdown}
        languageLabel={languageLabel}
        rightSlot={rightSlot}
      />

      <div className="mt-[4.6%]">
        <h1
          className={[
            'text-center font-serif font-medium uppercase text-[#212121]',
            'text-[clamp(20px,5.93cqw,64px)] leading-[1.546875] tracking-[0.03em]',
            titleClassName,
          ].join(' ')}
        >
          {title}
        </h1>

        {titleBottomSlot ? titleBottomSlot : null}
      </div>
    </div>
  )
}
