import Link from 'next/link'
import { ReactNode } from 'react'
import LanguageDropdown from './LanguageDropdown'

type PhotoboothPageHeaderProps = {
  title: string
  backHref?: string
  showBackButton?: boolean
  languageLabel?: string
  rightSlot?: ReactNode
  titleBottomSlot?: ReactNode
  titleClassName?: string
}

export default function PhotoboothPageHeader({
  title,
  backHref = '/welcome',
  showBackButton = true,
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
      <div className="flex items-start justify-between">
        {showBackButton ? (
          <Link
            href={backHref}
            className="inline-flex w-[19.5%] min-w-0 aspect-[195/88] items-center justify-center rounded-full bg-[rgba(26,26,26,0.50)] text-[clamp(8px,0.95vw,18px)] font-medium leading-none text-white shadow-[0_0_15px_rgba(39,39,39,0.15)]"
          >
            Quay lại
          </Link>
        ) : (
          <div className="w-[19.5%] min-w-0 aspect-[195/88]" />
        )}

        {rightSlot ?? (
          <LanguageDropdown defaultValue={languageLabel as 'VI' | 'EN' | 'CH'} />
        )}
      </div>

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