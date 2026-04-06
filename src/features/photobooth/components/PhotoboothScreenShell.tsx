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
    <main className="relative isolate flex h-[100svh] h-[100dvh] w-full max-w-full items-center justify-center overflow-hidden bg-white">
      <section className="absolute inset-0 overflow-hidden bg-white">
        <div className="h-full w-full">
          <BackgroundComponent backgroundImage={backgroundImage}>
            {children}
          </BackgroundComponent>
        </div>
      </section>
    </main>
  )
}
