import Image from 'next/image'

type PhotoboothFooterProps = {
  imageSrc?: string
  alt?: string
  className?: string
}

export default function PhotoboothFooter({
  imageSrc = '/images/photobooth/footer-btmt.png',
  alt = 'Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh',
  className = '',
}: PhotoboothFooterProps) {
  return (
    <footer className={`mt-auto w-full bg-black ${className}`}>
      <div className="relative w-full aspect-[1080/209]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[61.111%] aspect-[660/110]">
            <Image
              src={imageSrc}
              alt={alt}
              fill
              sizes="(max-width: 390px) 61vw, 238px"
              priority
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}