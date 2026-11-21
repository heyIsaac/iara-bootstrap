'use client';

import React from 'react';
import { Header } from '@/widgets/header';
import { GameCatalog } from '@/widgets/game-catalog';
import { Footer } from '@/widgets/footer';

export const CatalogPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <GameCatalog />
      </main>
      <Footer />
    </>
  );
};
