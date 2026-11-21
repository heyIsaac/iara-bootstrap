'use client';

import React from 'react';
import { Header } from '@/widgets/header';
import { GameDetailsView } from '@/widgets/game-details-view';
import { Footer } from '@/widgets/footer';

export interface GameDetailsPageProps {
  gameId: string | number;
}

export const GameDetailsPage: React.FC<GameDetailsPageProps> = ({ gameId }) => {
  return (
    <>
      <Header />
      <main>
        <GameDetailsView gameId={gameId} />
      </main>
      <Footer />
    </>
  );
};
