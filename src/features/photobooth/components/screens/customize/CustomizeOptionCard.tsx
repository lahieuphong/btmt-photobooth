type CustomizeOptionCardProps = {
  name: string
  previewClassName: string
  isSelected: boolean
  onClick?: () => void
}

export default function CustomizeOptionCard({
  name,
  previewClassName,
  isSelected,
  onClick,
}: CustomizeOptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className="group flex w-[56px] flex-col items-center text-center transition-transform duration-200 ease-out active:scale-[0.97] sm:w-[62px]"
    >
      <div
        className={[
          'w-full overflow-hidden rounded-[6px] border bg-white aspect-[76/46]',
          'transition-[border-color,transform,box-shadow] duration-200 ease-out',
          isSelected
            ? 'border-[#F15A29] shadow-[0_5px_12px_rgba(241,90,41,0.16)]'
            : 'border-transparent group-hover:scale-[1.02]',
        ].join(' ')}
      >
        <div className={`h-full w-full rounded-[4px] ${previewClassName}`} />
      </div>

      <div
        className={[
          'mt-1 w-full text-[clamp(7px,0.75vw,9px)] leading-[1.15] transition-colors duration-200',
          isSelected ? 'text-[#F15A29]' : 'text-[#5B5B5B]',
        ].join(' ')}
      >
        {name}
      </div>
    </button>
  )
}
