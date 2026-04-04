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
    <main className="flex min-h-screen items-center justify-center bg-[#111111] p-4">
      <section className="relative h-[92vh] aspect-[1080/1920] overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="h-full w-full">
          <PhotoboothBackground backgroundImage={backgroundImage}>
            {children}
          </PhotoboothBackground>
        </div>
      </section>
    </main>
  )
}