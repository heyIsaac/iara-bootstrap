import React, { Suspense } from 'react';
import { SuccessPage } from '@/views/success';
import { Spinner } from '@/shared/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pedido Confirmado - Iara Games',
};

export default function Page() {
  return (
    <Suspense fallback={<Spinner label="Carregando confirmação..." />}>
      <SuccessPage />
    </Suspense>
  );
}
