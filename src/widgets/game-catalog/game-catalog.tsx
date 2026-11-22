'use client';

import React, { useState } from 'react';
import { Container, Button, Spinner } from '@/shared/ui';
import { GameCard, useGames } from '@/entities/game';
import { AddToCartButton } from '@/features/add-to-cart';
import { SearchGamesInput } from '@/features/search-games';
import { OrderingSelect } from '@/features/filter-games';

export const GameCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ordering, setOrdering] = useState('-rating');
  const [toastMessage, setToastMessage] = useState<{ text: string; added: boolean } | null>(
    null
  );

  const { games, loading, error, page, hasMore, nextPage, prevPage } = useGames({
    search: searchTerm,
    ordering,
    page_size: 20,
  });

  const handleToggleFeedback = (gameName: string, added: boolean) => {
    setToastMessage({
      text: added
        ? `✓ ${gameName} adicionado ao carrinho!`
        : `${gameName} removido do carrinho`,
      added,
    });
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Catálogo de Jogos
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Explore nossa biblioteca com milhares de jogos nacionais e internacionais
          </p>
        </div>

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchGamesInput onSearch={(val) => setSearchTerm(val)} />
          <OrderingSelect value={ordering} onChange={(val) => setOrdering(val)} />
        </div>

        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
            <Spinner size="lg" />
            <span className="text-sm text-muted-foreground">Carregando jogos da RAWG API...</span>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-card/60 p-12 text-center text-muted-foreground">
            <p className="text-base">Nenhum jogo encontrado. Tente um termo de busca diferente.</p>
          </div>
        )}

        {!loading && !error && games.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {games.map((game) => {
                const price = Math.round((game.rating * 10 + 20) * 100) / 100;
                return (
                  <GameCard
                    key={game.id}
                    id={game.id}
                    name={game.name}
                    image={game.background_image}
                    rating={game.rating}
                    released={game.released}
                    genres={game.genres}
                    actionSlot={
                      <AddToCartButton
                        item={{
                          id: game.id,
                          name: game.name,
                          price,
                          image: game.background_image,
                        }}
                        onToggled={(added) => handleToggleFeedback(game.name, added)}
                      />
                    }
                  />
                );
              })}
            </div>

            <div className="mt-12 flex items-center justify-center gap-4">
              <Button onClick={prevPage} disabled={page === 1} variant="outline">
                Anterior
              </Button>
              <span className="text-sm font-semibold text-muted-foreground">Página {page}</span>
              <Button onClick={nextPage} disabled={!hasMore} variant="outline">
                Próxima
              </Button>
            </div>
          </>
        )}

        {/* Toast Feedback */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md transition-all ${
              toastMessage.added
                ? 'bg-primary text-primary-foreground shadow-[0_0_25px_rgba(204,254,44,0.4)]'
                : 'bg-card text-foreground border border-white/10'
            }`}
          >
            {toastMessage.text}
          </div>
        )}
      </Container>
    </div>
  );
};
