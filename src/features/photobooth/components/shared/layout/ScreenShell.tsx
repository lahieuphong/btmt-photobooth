import React from 'react'
import PhotoboothBackground, {
  type PhotoboothBackgroundVariant,
} from './Background'

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
    <main className="fixed inset-0 relative isolate h-[100dvh] min-h-screen min-h-[100svh] w-full max-w-full overflow-hidden bg-white">
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
