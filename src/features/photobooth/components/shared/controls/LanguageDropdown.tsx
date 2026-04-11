'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'

type LanguageCode = 'VI' | 'EN' | 'CH'

type LanguageOption = {
  code: LanguageCode
  label: string
  flagSrc: string
}

type LanguageDropdownProps = {
  defaultValue?: LanguageCode
  onChange?: (value: LanguageCode) => void
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'VI',
    label: 'VI',
    flagSrc: '/images/photobooth/flags/vn.svg',
  },
  {
    code: 'EN',
    label: 'EN',
    flagSrc: '/images/photobooth/flags/en.svg',
  },
  {
    code: 'CH',
    label: 'CH',
    flagSrc: '/images/photobooth/flags/ch.svg',
  },
]

export default function LanguageDropdown({
  defaultValue = 'VI',
  onChange,
}: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<LanguageCode>(defaultValue)
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption =
    LANGUAGE_OPTIONS.find((item) => item.code === selected) ?? LANGUAGE_OPTIONS[0]

  function handleSelect(value: LanguageCode) {
    setSelected(value)
    setIsOpen(false)
    onChange?.(value)
  }

  return (
    <div ref={rootRef} className="relative z-30 w-[23.5%] min-w-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full aspect-[225/86] items-center rounded-[10px] border-[2px] border-[#FF4D27] bg-white px-[7.179%]"
      >
        <div className="relative h-[22px] w-[22px] shrink-0 overflow-hidden rounded-full sm:h-[26px] sm:w-[26px]">
          <Image
            src={getAssetPath(selectedOption.flagSrc)}
            alt={selectedOption.label}
            fill
            sizes="(max-width: 768px) 22px, 26px"
            className="object-cover"
          />
        </div>

        <span className="ml-3 text-left text-[clamp(12px,1.9vw,54px)] font-semibold leading-none text-[#171717]">
          {selectedOption.label}
        </span>

        <Image
          src={getAssetPath('/icons/angle-up.svg')}
          alt=""
          width={14}
          height={14}
          aria-hidden="true"
          className={`ml-auto h-[14px] w-[14px] shrink-0 transition-transform duration-200 ${
            !isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+1px)] w-full overflow-hidden rounded-[10px] border border-[#B6B6B6] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.14)]">
          {LANGUAGE_OPTIONS.map((item) => {
            const isSelected = item.code === selected

            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`flex w-full aspect-[225/86] items-center px-[7.179%] text-left ${
                  isSelected ? 'bg-[#EAC5B2]' : 'bg-white hover:bg-[#F4F4F4]'
                }`}
              >
                <div className="relative h-[22px] w-[22px] shrink-0 overflow-hidden rounded-full sm:h-[26px] sm:w-[26px]">
                  <Image
                    src={getAssetPath(item.flagSrc)}
                    alt={item.label}
                    fill
                    sizes="(max-width: 768px) 22px, 26px"
                    className="object-cover"
                  />
                </div>

                <span className="ml-3 text-[clamp(12px,1.9vw,54px)] font-semibold leading-none text-[#171717]">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
