'use client'

import React, { useEffect } from 'react'
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
  useEffect(() => {
    function syncViewportHeight() {
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight

      document.documentElement.style.setProperty(
        '--photobooth-viewport-height',
        `${viewportHeight}px`
      )
    }

    syncViewportHeight()

    window.visualViewport?.addEventListener('resize', syncViewportHeight)
    window.visualViewport?.addEventListener('scroll', syncViewportHeight)
    window.addEventListener('resize', syncViewportHeight)
    window.addEventListener('orientationchange', syncViewportHeight)

    return () => {
      window.visualViewport?.removeEventListener('resize', syncViewportHeight)
      window.visualViewport?.removeEventListener('scroll', syncViewportHeight)
      window.removeEventListener('resize', syncViewportHeight)
      window.removeEventListener('orientationchange', syncViewportHeight)
    }
  }, [])

  return (
    <main
      className="fixed inset-x-0 top-0 isolate w-full max-w-full overflow-hidden bg-white"
      style={{ height: 'var(--photobooth-viewport-height, 100dvh)' }}
    >
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
