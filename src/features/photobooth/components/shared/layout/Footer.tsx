type PhotoboothFooterProps = {
  imageSrc?: string
  alt?: string
  className?: string
}

export default function PhotoboothFooter({
  alt = 'Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh',
  className = '',
}: PhotoboothFooterProps) {
  return (
    <footer className={`mt-auto w-full bg-black ${className}`}>
      <div className="relative w-full aspect-[1080/209]">
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-label={alt}
        >
          <div className="flex w-full items-center justify-center px-[4%]">
            <div className="inline-flex flex-col items-center text-white [text-shadow:0_0_2px_rgba(255,255,255,0.35)]">
              <p className="whitespace-nowrap font-serif text-[clamp(20px,3.3vw,39px)] font-medium uppercase leading-[1.04] tracking-[0.04em]">
                Bảo Tàng Mỹ Thuật
              </p>
              <p className="mt-[0.1em] whitespace-nowrap font-serif text-[clamp(16px,2.55vw,31px)] font-medium uppercase leading-[1.04] tracking-[0.04em]">
                Thành Phố Hồ Chí Minh
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
