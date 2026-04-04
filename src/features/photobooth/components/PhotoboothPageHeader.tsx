import Link from 'next/link'
import { ReactNode } from 'react'
import LanguageDropdown from './LanguageDropdown'

type PhotoboothPageHeaderProps = {
  title: string
  backHref?: string
  showBackButton?: boolean
  languageLabel?: string
  rightSlot?: ReactNode
}

export default function PhotoboothPageHeader({
  title,
  backHref = '/welcome',
  showBackButton = true,
  languageLabel = 'VI',
  rightSlot,
}: PhotoboothPageHeaderProps) {
  return (
    <div className="relative min-h-[148px] px-[7.5%] pt-[56px]">
      <div className="flex items-start justify-between">
        {showBackButton ? (
          <Link
            href={backHref}
            className="inline-flex h-[48px] items-center rounded-full bg-[#8E8E8E] px-4 text-[14px] font-medium text-white"
          >
            Quay lại
          </Link>
        ) : (
          <div className="h-[68px] w-[120px]" />
        )}

        {rightSlot ?? (
          <LanguageDropdown defaultValue={languageLabel as 'VI' | 'EN' | 'CH'} />
        )}
      </div>

      <div className="absolute inset-x-0 top-[150px] px-[18%]">
        <h1 className="text-center font-serif text-[18px] font-medium uppercase tracking-[0.02em] text-[#2E2A26]">
          {title}
        </h1>
      </div>
    </div>
  )
}