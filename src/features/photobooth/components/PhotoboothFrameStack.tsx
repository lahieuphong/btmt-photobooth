import type { ReactNode } from 'react'
import type { PhotoboothLayoutPreviewMode } from '@/src/features/photobooth/utils/layoutPreview'

type StackPosition = {
  left: string
  top: string
  rotate: string
  zIndex: number
}

const PHOTOBOOTH_FRAME_STACK_POSITIONS_BY_COUNT: Record<number, StackPosition[]> = {
  1: [{ left: '12%', top: '8%', rotate: '0deg', zIndex: 30 }],
  2: [
    { left: '8%', top: '11%', rotate: '0deg', zIndex: 30 },
    { left: '20%', top: '4%', rotate: '7deg', zIndex: 20 },
  ],
  3: [
    { left: '8%', top: '12%', rotate: '0deg', zIndex: 30 },
    { left: '20%', top: '7%', rotate: '6deg', zIndex: 20 },
    { left: '32%', top: '3%', rotate: '10deg', zIndex: 10 },
  ],
}

type PhotoboothFrameStackProps = {
  modes: PhotoboothLayoutPreviewMode[]
  selectedIndex?: number
  rootClassName?: string
  containerClassName?: string
  itemClassName?: string
  renderCard: (
    mode: PhotoboothLayoutPreviewMode,
    options: { index: number; isFront: boolean }
  ) => ReactNode
}

function buildOrderedModes(
  modes: PhotoboothLayoutPreviewMode[],
  selectedIndex: number
): PhotoboothLayoutPreviewMode[] {
  const visibleModes = modes.slice(0, 3)

  if (visibleModes.length <= 1) {
    return visibleModes
  }

  const clampedIndex = Math.min(
    Math.max(selectedIndex, 0),
    visibleModes.length - 1
  )

  if (clampedIndex === 0) {
    return visibleModes
  }

  const orderedModes = [...visibleModes]
  const selectedMode = orderedModes[clampedIndex]
  orderedModes[clampedIndex] = orderedModes[0]
  orderedModes[0] = selectedMode

  return orderedModes
}

export default function PhotoboothFrameStack({
  modes,
  selectedIndex = 0,
  rootClassName = 'relative mx-auto',
  containerClassName = 'w-[clamp(150px,min(56vw,30svh),270px)] aspect-[74/100] max-w-full',
  itemClassName = 'aspect-[678/1018] w-[76%]',
  renderCard,
}: PhotoboothFrameStackProps) {
  const orderedModes = buildOrderedModes(modes, selectedIndex)
  const positions =
    PHOTOBOOTH_FRAME_STACK_POSITIONS_BY_COUNT[orderedModes.length] ??
    PHOTOBOOTH_FRAME_STACK_POSITIONS_BY_COUNT[1]

  return (
    <div className={[rootClassName, containerClassName].join(' ')}>
      {orderedModes.map((mode, index) => {
        const position = positions[index]

        return (
          <div
            key={`${mode}-${index}`}
            className={['absolute', itemClassName].join(' ')}
            style={{
              left: position.left,
              top: position.top,
              transform: `rotate(${position.rotate})`,
              zIndex: position.zIndex,
            }}
          >
            {renderCard(mode, { index, isFront: index === 0 })}
          </div>
        )
      })}
    </div>
  )
}
