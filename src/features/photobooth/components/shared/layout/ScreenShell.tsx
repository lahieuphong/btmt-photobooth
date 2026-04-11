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
    <main className="relative isolate h-[100svh] min-h-[100svh] w-full max-w-full overflow-x-hidden overflow-y-auto bg-white">
      <section className="relative min-h-full overflow-hidden bg-white">
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
