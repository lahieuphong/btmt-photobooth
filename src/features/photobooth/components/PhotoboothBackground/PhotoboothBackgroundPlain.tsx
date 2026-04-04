import React from 'react'

type PhotoboothBackgroundPlainProps = {
  children?: React.ReactNode
  backgroundImage?: string
}

export default function PhotoboothBackgroundPlain({
  children,
}: PhotoboothBackgroundPlainProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}