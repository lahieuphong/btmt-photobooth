import PrimaryButton from '@/src/features/photobooth/components/PrimaryButton'

type PhotoboothDualActionBarProps = {
  secondaryLabel?: string
  primaryLabel?: string
  onSecondaryClick?: () => void
  onPrimaryClick?: () => void
  className?: string
}

export default function PhotoboothDualActionBar({
  secondaryLabel,
  primaryLabel,
  onSecondaryClick,
  onPrimaryClick,
  className = '',
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
          className="h-[48px] sm:h-[52px] text-[14px] sm:text-[15px]"
        >
          {secondaryLabel}
        </PrimaryButton>

        <PrimaryButton
          fullWidth
          onClick={onPrimaryClick}
          className="h-[48px] sm:h-[52px] text-[14px] sm:text-[15px]"
        >
          {primaryLabel}
        </PrimaryButton>
      </div>
    </div>
  )
}
