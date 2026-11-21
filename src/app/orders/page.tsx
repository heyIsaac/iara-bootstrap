import { OrdersPage } from '@/views/orders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meus Pedidos - Iara Games',
};

export default function Page() {
  return <OrdersPage />;
}
