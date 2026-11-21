import { GameDetailsPage } from '@/views/game-details';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalhes do Jogo - Iara Games',
};

interface GamePageProps {
  params: {
    'game-id': string;
  };
}

export default function Page({ params }: GamePageProps) {
  return <GameDetailsPage gameId={params['game-id']} />;
}
