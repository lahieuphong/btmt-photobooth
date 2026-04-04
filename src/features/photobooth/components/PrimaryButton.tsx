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
    'inline-flex h-[42px] min-w-[132px] items-center justify-center rounded-full px-6 text-[13px] font-semibold transition-all duration-200'

  const variantClass =
    variant === 'primary'
      ? disabled
        ? 'bg-[#A8A8A8] text-white cursor-not-allowed'
        : 'bg-[#FF5A2A] text-white hover:brightness-95 active:scale-[0.98]'
      : disabled
        ? 'bg-[#7D7D7D] text-white cursor-not-allowed'
        : 'bg-[#171717] text-white hover:brightness-110 active:scale-[0.98]'

  const widthClass = fullWidth ? 'w-full' : ''

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