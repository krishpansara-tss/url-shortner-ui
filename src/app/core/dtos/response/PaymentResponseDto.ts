export interface PaymentResponseDto {
  paymentId: number;
  transactionId?: string;
  amount: number;
  paymentType: 'CUSTOM_ALIAS' | 'URL_RENEWAL' | 'URL_SLOT_PURCHASE' | string;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | string;
  userId: number;
  urlId: number;
  createdAt: string;
  completedAt?: string;
}
