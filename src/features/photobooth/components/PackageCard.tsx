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
        'w-full rounded-[14px] border px-4 py-3 text-left transition-all duration-200',
        selected
          ? 'border-[#F15A29] bg-[#171717] shadow-[0_8px_22px_rgba(0,0,0,0.18)]'
          : 'border-[#F2B39B] bg-white/95 shadow-[0_4px_12px_rgba(0,0,0,0.04)]',
        className,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={[
            'mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border',
            selected ? 'border-[#F15A29]' : 'border-[#8E8E8E]',
          ].join(' ')}
        >
          {selected ? <span className="h-2 w-2 rounded-full bg-[#FF5A2A]" /> : null}
        </span>

        <span
          className={[
            'inline-flex rounded-md px-2 py-[2px] text-[9px] font-semibold uppercase leading-none',
            selected ? 'bg-white text-[#171717]' : 'bg-[#171717] text-white',
          ].join(' ')}
        >
          {badge}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        {lines.map((line) => (
          <p
            key={line}
            className={[
              'text-[11px] leading-[1.35]',
              selected ? 'text-white/90' : 'text-[#7B7B7B]',
            ].join(' ')}
          >
            {line}
          </p>
        ))}
      </div>

      <div
        className={[
          'mt-3 text-[16px] font-semibold leading-none',
          selected ? 'text-[#FF5A2A]' : 'text-[#2E2A26]',
        ].join(' ')}
      >
        {formatPriceVND(price)}
      </div>
    </button>
  )
}