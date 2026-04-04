import React from 'react'
import PhotoboothBackground from './PhotoboothBackground'

type PhotoboothScreenShellProps = {
  children?: React.ReactNode
  backgroundImage?: string
}

export default function PhotoboothScreenShell({
  children,
  backgroundImage,
}: PhotoboothScreenShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111111] px-4 py-6">
      <section className="w-full max-w-[390px] overflow-hidden rounded-[24px] border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="min-h-[844px]">
          <PhotoboothBackground backgroundImage={backgroundImage}>
            {children}
          </PhotoboothBackground>
        </div>
      </section>
    </main>
  )
}