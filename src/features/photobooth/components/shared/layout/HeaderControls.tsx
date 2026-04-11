import Link from 'next/link'
import Image from 'next/image'
import { ReactNode } from 'react'
import LanguageDropdown from '../controls/LanguageDropdown'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'

type HeaderControlsProps = {
  backHref?: string
  showBackButton?: boolean
  showLanguageDropdown?: boolean
  languageLabel?: 'VI' | 'EN' | 'CH'
  rightSlot?: ReactNode
}

export default function HeaderControls({
  backHref = '/welcome',
  showBackButton = true,
  showLanguageDropdown = true,
  languageLabel = 'VI',
  rightSlot,
}: HeaderControlsProps) {
  return (
    <div className="flex items-start justify-between">
      {showBackButton ? (
        <Link
          href={backHref}
          className="inline-flex w-[25.8%] min-w-0 aspect-[295/108] items-center justify-center gap-[0.92cqw] rounded-full bg-[rgba(26,26,26,0.46)] px-[1.8cqw] text-[clamp(14px,2.15vw,72px)] font-medium leading-none text-white shadow-[0_8px_18px_rgba(39,39,39,0.17)]"
        >
          <Image
            src={getAssetPath('/icons/arrow-left.svg')}
            alt=""
            width={33}
            height={28}
            className="h-[0.8em] w-auto shrink-0"
            aria-hidden="true"
          />
          <span className="text-white font-medium">Quay lại</span>
        </Link>
      ) : (
        <div className="w-[25.8%] min-w-0 aspect-[295/108]" />
      )}

      {rightSlot ? (
        rightSlot
      ) : showLanguageDropdown ? (
        <LanguageDropdown defaultValue={languageLabel} />
      ) : (
        <div className="w-[19.5%] min-w-0 aspect-[195/68]" />
      )}
    </div>
  )
}
