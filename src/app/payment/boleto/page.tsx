import { BoletoPaymentPage } from '@/views/boleto-payment';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagamento Boleto Bancário - Iara Games',
};

export default function Page() {
  return <BoletoPaymentPage />;
}
