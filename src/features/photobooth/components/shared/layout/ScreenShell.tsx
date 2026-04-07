import React from 'react'
import PhotoboothBackground, {
  type PhotoboothBackgroundVariant,
} from './background/Background'

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
  return (
    <main className="relative isolate flex h-[100svh] h-[100dvh] w-full max-w-full items-center justify-center overflow-hidden bg-white">
      <section className="absolute inset-0 overflow-hidden bg-white">
        <div className="h-full w-full">
          <PhotoboothBackground
            backgroundImage={backgroundImage}
            variant={backgroundVariant}
          >
            {children}
          </PhotoboothBackground>
        </div>
      </section>
    </main>
  )
}
