import { CartPage } from '@/views/cart';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrinho de Compras - Iara Games',
};

export default function Page() {
  return <CartPage />;
}
