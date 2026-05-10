import Image from 'next/image'
import type { ReactNode } from 'react'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'

export type PhotoboothBackgroundVariant = 'plain' | 'museum'

type PhotoboothBackgroundProps = {
  children?: ReactNode
  backgroundImage?: string
  variant?: PhotoboothBackgroundVariant
}

const DEFAULT_MUSEUM_BACKGROUND_SRC = '/images/backgrounds/bg_removal.svg'

function MuseumBackground({
  children,
  backgroundImage,
}: {
  children?: ReactNode
  backgroundImage?: string
}) {
  const resolvedBackgroundImage =
    backgroundImage || DEFAULT_MUSEUM_BACKGROUND_SRC

  return (
    <div className="relative h-full w-full overflow-hidden bg-white isolate">
      <Image
        src={getAssetPath(resolvedBackgroundImage)}
        alt=""
        fill
        aria-hidden="true"
        priority
        sizes="100vw"
        className="pointer-events-none absolute inset-0 z-0 select-none object-cover"
      />

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}

function PlainBackground({ children }: { children?: ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  )
}

export default function PhotoboothBackground({
  children,
  backgroundImage,
  variant = 'plain',
}: PhotoboothBackgroundProps) {
  if (variant === 'museum') {
    return (
      <MuseumBackground backgroundImage={backgroundImage}>
        {children}
      </MuseumBackground>
    )
  }

  return <PlainBackground>{children}</PlainBackground>
}
