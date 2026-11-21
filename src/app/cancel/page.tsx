import { CancelPage } from '@/views/cancel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pagamento Cancelado - Iara Games',
};

export default function Page() {
  return <CancelPage />;
}
