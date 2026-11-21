import React, { Suspense } from 'react';
import { LoginPage } from '@/views/login';
import { Spinner } from '@/shared/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Iara Games',
};

export default function Page() {
  return (
    <Suspense fallback={<Spinner label="Carregando login..." />}>
      <LoginPage />
    </Suspense>
  );
}
