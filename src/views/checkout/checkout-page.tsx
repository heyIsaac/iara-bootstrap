'use client';

import React from 'react';
import { Header } from '@/widgets/header';
import { CheckoutView } from '@/widgets/checkout-view';
import { Footer } from '@/widgets/footer';
import { RouteGuard } from '@/features/route-guard';

export const CheckoutPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <RouteGuard>
          <CheckoutView />
        </RouteGuard>
      </main>
      <Footer />
    </>
  );
};
