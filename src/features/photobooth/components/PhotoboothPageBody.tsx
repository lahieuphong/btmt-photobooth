import React from 'react'

type PhotoboothPageBodyProps = {
  children: React.ReactNode
  className?: string
}

export default function PhotoboothPageBody({
  children,
  className = '',
}: PhotoboothPageBodyProps) {
  return <div className={`px-6 pt-[30px] pb-6 ${className}`}>{children}</div>
}