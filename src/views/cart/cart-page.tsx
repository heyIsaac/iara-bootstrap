'use client';

import React from 'react';
import { Header } from '@/widgets/header';
import { CartView } from '@/widgets/cart-view';
import { Footer } from '@/widgets/footer';

export const CartPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <CartView />
      </main>
      <Footer />
    </>
  );
};
