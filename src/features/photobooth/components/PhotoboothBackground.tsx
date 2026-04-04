import React from 'react'

type PhotoboothBackgroundProps = {
  children?: React.ReactNode
  backgroundImage?: string
}

export default function PhotoboothBackground({
  children,
  backgroundImage,
}: PhotoboothBackgroundProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(201,161,74,0.10)_0%,rgba(255,255,255,0.00)_22%,rgba(201,161,74,0.08)_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,161,74,0.18),transparent_38%),radial-gradient(circle_at_top_right,rgba(201,161,74,0.14),transparent_36%),radial-gradient(circle_at_bottom_center,rgba(201,161,74,0.10),transparent_42%)]" />

      {backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.14]"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      ) : null}

      <div className="absolute inset-0 bg-white/58" />

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}