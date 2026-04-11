import React from 'react'
import { formatPriceVND } from '../../../utils/formatPrice'

type PackageCardProps = {
  badge: string
  lines: string[]
  price: number
  selected?: boolean
  onClick?: () => void
  className?: string
}

export default function PackageCard({
  badge,
  lines,
  price,
  selected = false,
  onClick,
  className = '',
}: PackageCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={[
        'relative w-full border text-left transition-all duration-200 transform-gpu origin-center',
        selected ? 'scale-[1.03] rounded-[20px] px-[17px] pt-[15px] pb-[13px]' : 'scale-100 rounded-[16px] px-[14px] pt-[12px] pb-[10px]',
        selected
          ? 'border-[#FF5A2A] bg-[#101010] shadow-[0_6px_18px_rgba(0,0,0,0.12)]'
          : 'border-[#F3C6B8] bg-white/95',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={[
            'mt-[2px] inline-flex items-center justify-center rounded-full border',
            selected ? 'h-[18px] w-[18px]' : 'h-[14px] w-[14px]',
            selected ? 'border-[#FF5A2A]' : 'border-[#B7B7B7]',
          ].join(' ')}
        >
          {selected ? (
            <span className="h-[8px] w-[8px] rounded-full bg-[#FF5A2A]" />
          ) : null}
        </span>

        <span
          className={[
            'inline-flex items-center rounded-[999px] font-bold uppercase leading-none',
            selected ? 'min-h-[20px] px-[9px] text-[10px]' : 'min-h-[16px] px-[6px] text-[8px]',
            selected ? 'bg-white text-[#111111]' : 'bg-[#1A1A1A] text-white',
          ].join(' ')}
        >
          {badge}
        </span>
      </div>

      <div className={selected ? 'mt-[13px] space-y-[6px]' : 'mt-[10px] space-y-[4px]'}>
        {lines.map((line) => (
          <p
            key={line}
            className={[
              selected ? 'text-[13px] leading-[1.35]' : 'text-[11px] leading-[1.35]',
              selected ? 'text-white/85' : 'text-[#9A9A9A]',
            ].join(' ')}
          >
            {line}
          </p>
        ))}
      </div>

      <div
        className={[
          selected
            ? 'mt-[13px] text-[24px] font-semibold leading-none'
            : 'mt-[10px] text-[19px] font-semibold leading-none',
          selected ? 'text-[#FF5A2A]' : 'text-[#2E2A26]',
        ].join(' ')}
      >
        {formatPriceVND(price)}
      </div>
    </button>
  )
}
