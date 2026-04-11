import Image from 'next/image'
import type { ReactNode } from 'react'
import { getAssetPath } from '@/src/features/photobooth/utils/assetPath'

export type PhotoboothBackgroundVariant = 'plain' | 'museum'

type PhotoboothBackgroundProps = {
  children?: ReactNode
  backgroundImage?: string
  variant?: PhotoboothBackgroundVariant
}

const FIGMA_BASE_WIDTH = 1080
const FIGMA_BASE_HEIGHT = 1920
const ASSET_BASE_PATH = '/images/photobooth/background_museum'

function toPercent(value: number, base: number) {
  return `${(value / base) * 100}%`
}

type LayerImageProps = {
  src: string
  width: number
  height: number
  top: number
  left: number
  opacity?: number
  zIndex?: number
  priority?: boolean
  sizes: string
}

function LayerImage({
  src,
  width,
  height,
  top,
  left,
  opacity = 1,
  zIndex = 1,
  priority = false,
  sizes,
}: LayerImageProps) {
  return (
    <div
      className="pointer-events-none absolute select-none"
      style={{
        width: toPercent(width, FIGMA_BASE_WIDTH),
        height: toPercent(height, FIGMA_BASE_HEIGHT),
        top: toPercent(top, FIGMA_BASE_HEIGHT),
        left: toPercent(left, FIGMA_BASE_WIDTH),
        opacity,
        zIndex,
      }}
      aria-hidden="true"
    >
      <Image
        src={getAssetPath(src)}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-fill"
      />
    </div>
  )
}

function MuseumBackground({
  children,
  backgroundImage,
}: {
  children?: ReactNode
  backgroundImage?: string
}) {
  const resolvedBackgroundImage =
    backgroundImage || `${ASSET_BASE_PATH}/bg_removal.png`

  return (
    <div className="relative h-full w-full overflow-hidden bg-white isolate">
      <div className="absolute inset-0 z-0 bg-white" />

      <LayerImage
        src={resolvedBackgroundImage}
        width={1080}
        height={1401}
        top={519}
        left={0}
        opacity={0.1}
        zIndex={1}
        priority
        sizes="(max-width: 768px) calc(100vw - 2rem), 28vw"
      />

      <LayerImage
        src={`${ASSET_BASE_PATH}/group_1.png`}
        width={2527}
        height={1253}
        top={-442}
        left={-752}
        zIndex={2}
        priority
        sizes="(max-width: 768px) 234vw, 66vw"
      />

      <LayerImage
        src={`${ASSET_BASE_PATH}/ellipse_1.png`}
        width={1180}
        height={1180}
        top={47}
        left={-50}
        zIndex={3}
        priority
        sizes="(max-width: 768px) 110vw, 31vw"
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
