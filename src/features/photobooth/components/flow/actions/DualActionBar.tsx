import Image from 'next/image'
import PrimaryButton from '@/src/features/photobooth/components/shared/controls/PrimaryButton'

type PhotoboothDualActionBarProps = {
  secondaryLabel?: string
  primaryLabel?: string
  onSecondaryClick?: () => void
  onPrimaryClick?: () => void
  className?: string
  secondaryIconSrc?: string
  primaryIconSrc?: string
  hideSecondary?: boolean
}

export default function PhotoboothDualActionBar({
  secondaryLabel,
  primaryLabel,
  onSecondaryClick,
  onPrimaryClick,
  className = '',
  secondaryIconSrc,
  primaryIconSrc,
  hideSecondary = false,
}: PhotoboothDualActionBarProps) {
  const rootLayoutClassName = hideSecondary
    ? 'flex justify-center'
    : 'grid grid-cols-2 gap-3 sm:gap-4 md:gap-5'

  return (
    <div
      className={[
        'z-10 mt-2 shrink-0 pt-3 pb-[calc(4px+env(safe-area-inset-bottom))]',
        className,
      ].join(' ')}
    >
      <div className={rootLayoutClassName}>
        {hideSecondary ? null : (
          <PrimaryButton
            variant="secondary"
            fullWidth
            onClick={onSecondaryClick}
            className="h-[48px] min-w-0 sm:h-[52px] px-3 sm:px-5 text-[10px] sm:text-[14px]"
          >
            <span className="inline-flex w-full min-w-0 max-w-full items-center justify-center gap-1.5 whitespace-nowrap leading-none font-semibold text-white">
              {secondaryIconSrc ? (
                <Image
                  src={secondaryIconSrc}
                  alt=""
                  aria-hidden="true"
                  width={14}
                  height={14}
                  className="h-[14px] w-[14px] shrink-0 sm:h-4 sm:w-4"
                />
              ) : null}
              <span className="block min-w-0 flex-1 truncate whitespace-nowrap text-center font-semibold text-white">
                {secondaryLabel}
              </span>
            </span>
          </PrimaryButton>
        )}

        <PrimaryButton
          fullWidth={!hideSecondary}
          onClick={onPrimaryClick}
          className={[
            'h-[48px] min-w-0 sm:h-[52px] px-3 sm:px-5 text-[10px] sm:text-[14px]',
            hideSecondary ? 'min-w-[160px] px-9 text-[14px] sm:text-[16px]' : '',
          ].join(' ')}
        >
          <span className="inline-flex w-full min-w-0 max-w-full items-center justify-center gap-1.5 whitespace-nowrap leading-none font-semibold text-white">
            <span className="block min-w-0 flex-1 truncate whitespace-nowrap text-center font-semibold text-white">
              {primaryLabel}
            </span>
            {primaryIconSrc ? (
              <Image
                src={primaryIconSrc}
                alt=""
                aria-hidden="true"
                width={14}
                height={14}
                className="h-[14px] w-[14px] shrink-0 sm:h-4 sm:w-4"
              />
            ) : null}
          </span>
        </PrimaryButton>
      </div>
    </div>
  )
}
