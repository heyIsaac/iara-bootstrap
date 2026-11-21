import React, { Suspense } from 'react';
import { RegisterPage } from '@/views/register';
import { Spinner } from '@/shared/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cadastro - Iara Games',
};

export default function Page() {
  return (
    <Suspense fallback={<Spinner label="Carregando cadastro..." />}>
      <RegisterPage />
    </Suspense>
  );
}
