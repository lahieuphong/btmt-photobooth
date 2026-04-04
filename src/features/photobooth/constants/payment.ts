export type PhotoboothPaymentInfo = {
  amount: number
  expiredInSeconds: number
  qrText: string
}

export const PHOTOBOOTH_PAYMENT_MOCK: PhotoboothPaymentInfo = {
  amount: 79000,
  expiredInSeconds: 120,
  qrText: 'BTMT-PHOTOBOOTH-MOCK-ORDER-001',
}