'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

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
    <div ref={rootRef} className="relative z-30 w-[19.5%] min-w-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full aspect-[195/68] items-center gap-[8.205%] rounded-[12px] border-[2px] border-[#FF4D27] bg-white px-[7.179%]"
      >
        <div className="relative aspect-square h-[52.941%] shrink-0 overflow-hidden rounded-full">
          <Image
            src={selectedOption.flagSrc}
            alt={selectedOption.label}
            fill
            sizes="(max-width: 768px) 24px, 36px"
            className="object-cover"
          />
        </div>

        <span className="text-[clamp(8px,0.95vw,18px)] font-medium leading-none text-[#2E2A26]">
          {selectedOption.label}
        </span>

        <svg
          className={`ml-auto h-[35.294%] w-auto shrink-0 text-[#666666] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4.75 7.25L10 12.5L15.25 7.25"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+8px)] w-full overflow-hidden rounded-[12px] border border-[#E6DED7] bg-white shadow-[0_12px_24px_rgba(0,0,0,0.14)]">
          {LANGUAGE_OPTIONS.map((item) => {
            const isSelected = item.code === selected

            return (
              <button
                key={item.code}
                type="button"
                onClick={() => handleSelect(item.code)}
                className={`flex w-full aspect-[195/68] items-center gap-[8.205%] px-[7.179%] text-left ${
                  isSelected ? 'bg-[#FFF3EE]' : 'bg-white hover:bg-[#F8F3EE]'
                }`}
              >
                <div className="relative aspect-square h-[52.941%] shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={item.flagSrc}
                    alt={item.label}
                    fill
                    sizes="(max-width: 768px) 24px, 36px"
                    className="object-cover"
                  />
                </div>

                <span className="text-[clamp(8px,0.95vw,18px)] font-medium leading-none text-[#2E2A26]">
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