import Image from 'next/image'
import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'

type PhotoboothDualActionBarProps = {
  secondaryLabel?: string
  primaryLabel?: string
  onSecondaryClick?: () => void
  onPrimaryClick?: () => void
  className?: string
  secondaryIconSrc?: string
  primaryIconSrc?: string
}

export default function PhotoboothDualActionBar({
  secondaryLabel,
  primaryLabel,
  onSecondaryClick,
  onPrimaryClick,
  className = '',
  secondaryIconSrc,
  primaryIconSrc,
}: PhotoboothDualActionBarProps) {
  return (
    <div
      className={[
        'z-10 mt-2 shrink-0 pt-3 pb-[calc(4px+env(safe-area-inset-bottom))]',
        className,
      ].join(' ')}
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
        <PrimaryButton
          variant="secondary"
          fullWidth
          onClick={onSecondaryClick}
          className="h-[48px] sm:h-[52px] px-6 sm:px-7 text-[11px] sm:text-[14px]"
        >
          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap leading-none font-semibold text-white">
            {secondaryIconSrc ? (
              <Image
                src={secondaryIconSrc}
                alt=""
                aria-hidden="true"
                width={16}
                height={16}
                className="h-4 w-4 shrink-0"
              />
            ) : null}
            <span className="whitespace-nowrap font-semibold text-white">
              {secondaryLabel}
            </span>
          </span>
        </PrimaryButton>

        <PrimaryButton
          fullWidth
          onClick={onPrimaryClick}
          className="h-[48px] sm:h-[52px] px-6 sm:px-7 text-[11px] sm:text-[14px]"
        >
          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap leading-none font-semibold text-white">
            <span className="whitespace-nowrap font-semibold text-white">
              {primaryLabel}
            </span>
            {primaryIconSrc ? (
              <Image
                src={primaryIconSrc}
                alt=""
                aria-hidden="true"
                width={16}
                height={16}
                className="h-4 w-4 shrink-0"
              />
            ) : null}
          </span>
        </PrimaryButton>
      </div>
    </div>
  )
}
