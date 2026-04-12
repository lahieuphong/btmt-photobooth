'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'

type WelcomeLoadingGateProps = {
  children: React.ReactNode
}

const MIN_LOADING_TIME_MS = 1200

export default function WelcomeLoadingGate({
  children,
}: WelcomeLoadingGateProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    let isCancelled = false

    const progressTicker = window.setInterval(() => {
      setProgress((current) => (current >= 94 ? current : current + 6))
    }, 90)

    const minDelayPromise = new Promise<void>((resolve) => {
      window.setTimeout(resolve, MIN_LOADING_TIME_MS)
    })

    const pageReadyPromise = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') {
        resolve()
        return
      }

      const handleLoad = () => {
        window.removeEventListener('load', handleLoad)
        resolve()
      }

      window.addEventListener('load', handleLoad, { once: true })
    })

    Promise.all([minDelayPromise, pageReadyPromise]).then(() => {
      if (!isCancelled) {
        setProgress(100)
        window.setTimeout(() => {
          if (!isCancelled) {
            setIsLoading(false)
          }
        }, 180)
      }
    })

    return () => {
      isCancelled = true
      window.clearInterval(progressTicker)
    }
  }, [])

  const overlayStyle: CSSProperties = {
    background: '#ffffff',
  }

  const progressFillStyle: CSSProperties = {
    width: `${progress}%`,
    background: '#7E1F15',
  }

  return (
    <>
      {children}

      {isLoading ? (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          style={overlayStyle}
          role="status"
          aria-live="polite"
        >
          <div className="flex w-[min(84vw,420px)] flex-col items-center gap-6 px-6">
            <div className="w-[150px]">
              <Image
                src={getAssetPath('/images/logo/logo.svg')}
                alt="BTMT Photobooth"
                width={150}
                height={150}
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </div>

            <div
              className="relative h-[6px] w-full rounded-full bg-[#E6E6E6]"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full transition-[width] duration-150 ease-out"
                style={progressFillStyle}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
