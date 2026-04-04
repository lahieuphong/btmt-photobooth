import React from 'react'
import { formatPriceVND } from '../utils/formatPrice'

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
        'relative w-full rounded-[16px] border text-left transition-all duration-200',
        'px-[14px] pt-[12px] pb-[10px]',
        selected
          ? 'border-[#FF5A2A] bg-[#101010] shadow-[0_6px_18px_rgba(0,0,0,0.12)]'
          : 'border-[#F3C6B8] bg-white/95',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={[
            'mt-[2px] inline-flex h-[14px] w-[14px] items-center justify-center rounded-full border',
            selected ? 'border-[#FF5A2A]' : 'border-[#B7B7B7]',
          ].join(' ')}
        >
          {selected ? <span className="h-[6px] w-[6px] rounded-full bg-[#FF5A2A]" /> : null}
        </span>

        <span
          className={[
            'inline-flex min-h-[16px] items-center rounded-[999px] px-[6px] text-[8px] font-bold uppercase leading-none',
            selected ? 'bg-white text-[#111111]' : 'bg-[#1A1A1A] text-white',
          ].join(' ')}
        >
          {badge}
        </span>
      </div>

      <div className="mt-[10px] space-y-[4px]">
        {lines.map((line) => (
          <p
            key={line}
            className={[
              'text-[11px] leading-[1.35]',
              selected ? 'text-white/85' : 'text-[#9A9A9A]',
            ].join(' ')}
          >
            {line}
          </p>
        ))}
      </div>

      <div
        className={[
          'mt-[10px] text-[16px] font-semibold leading-none',
          selected ? 'text-[#FF5A2A]' : 'text-[#2E2A26]',
        ].join(' ')}
      >
        {formatPriceVND(price)}
      </div>
    </button>
  )
}