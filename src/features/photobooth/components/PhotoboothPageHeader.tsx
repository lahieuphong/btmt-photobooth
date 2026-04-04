import Link from 'next/link'
import { ReactNode } from 'react'

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
    <div className="relative min-h-[72px] px-4 pt-4">
      <div className="flex items-start justify-between">
        {showBackButton ? (
          <Link
            href={backHref}
            className="inline-flex h-7 items-center rounded-full bg-[#8E8E8E] px-2.5 text-[10px] font-medium text-white"
          >
            Quay lại
          </Link>
        ) : (
          <div className="h-7 w-[58px]" />
        )}

        {rightSlot ?? (
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-[#F15A29] bg-white px-2 text-[10px] font-medium text-[#4A4A4A]"
          >
            <span className="text-[12px] leading-none">🇻🇳</span>
            <span>{languageLabel}</span>
            <span className="text-[9px]">⌄</span>
          </button>
        )}
      </div>

      <div className="absolute inset-x-0 top-[28px] px-16">
        <h1 className="text-center font-serif text-[18px] font-medium uppercase tracking-[0.02em] text-[#2E2A26]">
          {title}
        </h1>
      </div>
    </div>
  )
}