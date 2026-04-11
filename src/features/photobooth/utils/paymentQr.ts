import type { PhotoboothBankQrConfig } from '@/src/features/photobooth/constants/payment'

type BuildPaymentQrSrcParams = {
  bankAccount: PhotoboothBankQrConfig
  amount: number
  addInfo?: string
  cacheBust?: string | number
}

export function buildPaymentQrSrc({
  bankAccount,
  amount,
  addInfo = '',
  cacheBust,
}: BuildPaymentQrSrcParams) {
  const normalizedAmount = Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0

  const query = new URLSearchParams({
    amount: String(normalizedAmount),
  })

  if (addInfo.trim().length > 0) {
    query.set('addInfo', addInfo)
  }

  if (cacheBust !== undefined) {
    query.set('v', String(cacheBust))
  }

  const encodedBankCode = encodeURIComponent(bankAccount.bankCode)
  const encodedAccount = encodeURIComponent(bankAccount.accountNumber)
  const encodedTemplate = encodeURIComponent(bankAccount.template)

  return `https://img.vietqr.io/image/${encodedBankCode}-${encodedAccount}-${encodedTemplate}.png?${query.toString()}`
}
