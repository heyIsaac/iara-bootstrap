import { CheckoutPage } from '@/views/checkout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finalizar Compra - Iara Games',
};

export default function Page() {
  return <CheckoutPage />;
}
