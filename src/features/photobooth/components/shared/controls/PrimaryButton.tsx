import Link from 'next/link'
import React from 'react'

type PrimaryButtonProps = {
  children: React.ReactNode
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
  className?: string
  fullWidth?: boolean
  variant?: 'primary' | 'secondary'
}

export default function PrimaryButton({
  children,
  href,
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  fullWidth = false,
  variant = 'primary',
}: PrimaryButtonProps) {
  const baseClass =
    'inline-flex h-[42px] min-w-[132px] max-w-full items-center justify-center rounded-full px-5 text-[clamp(11px,2.8vw,13px)] font-semibold !text-white transition-all duration-200 whitespace-nowrap overflow-hidden'

  const variantClass =
    variant === 'primary'
      ? disabled
        ? 'cursor-not-allowed bg-[#A8A8A8]'
        : 'bg-[#FF5A2A] hover:brightness-95 active:scale-[0.98]'
      : disabled
        ? 'cursor-not-allowed bg-[#7D7D7D]'
        : 'bg-[#171717] hover:brightness-110 active:scale-[0.98]'

  const widthClass = fullWidth ? 'w-full min-w-0' : ''

  const classes = `${baseClass} ${variantClass} ${widthClass} ${className}`.trim()

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
