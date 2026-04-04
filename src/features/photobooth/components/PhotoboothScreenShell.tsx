import React from 'react'
import PhotoboothBackgroundMuseum from './PhotoboothBackground/PhotoboothBackgroundMuseum'
import PhotoboothBackgroundPlain from './PhotoboothBackground/PhotoboothBackgroundPlain'

export type PhotoboothBackgroundVariant = 'plain' | 'museum'

type PhotoboothScreenShellProps = {
  children?: React.ReactNode
  backgroundImage?: string
  backgroundVariant?: PhotoboothBackgroundVariant
}

export default function PhotoboothScreenShell({
  children,
  backgroundImage,
  backgroundVariant = 'plain',
}: PhotoboothScreenShellProps) {
  const BackgroundComponent =
    backgroundVariant === 'museum'
      ? PhotoboothBackgroundMuseum
      : PhotoboothBackgroundPlain

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111111] p-4">
      <section className="relative h-[92vh] aspect-[1080/1920] overflow-hidden bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="h-full w-full">
          <BackgroundComponent backgroundImage={backgroundImage}>
            {children}
          </BackgroundComponent>
        </div>
      </section>
    </main>
  )
}