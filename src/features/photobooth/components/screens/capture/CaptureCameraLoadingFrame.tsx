export default function CaptureCameraLoadingFrame() {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center rounded-[8px] bg-[#E8E5CC] sm:rounded-[10px]">
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-[56px] w-[56px]">
          <div className="absolute inset-0 rounded-full border-[7px] border-[#F3CBAF]/70" />
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-[7px] border-transparent border-t-[#FF7A5F] border-r-[#FF5A2A] animate-spin"
          />
        </div>
        <p className="mt-0.5 text-[12px] font-medium text-[#FF5A2A]">Đang xử lý...</p>
      </div>
    </div>
  )
}
