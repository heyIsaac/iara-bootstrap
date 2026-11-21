'use client';

import React from 'react';
import { Header } from '@/widgets/header';
import { OrderHistory } from '@/widgets/order-history';
import { Footer } from '@/widgets/footer';
import { RouteGuard } from '@/features/route-guard';

export const OrdersPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <RouteGuard>
          <OrderHistory />
        </RouteGuard>
      </main>
      <Footer />
    </>
  );
};
