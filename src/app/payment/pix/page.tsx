import { PixPaymentPage } from '@/views/pix-payment';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagamento PIX - Iara Games',
};

export default function Page() {
  return <PixPaymentPage />;
}
