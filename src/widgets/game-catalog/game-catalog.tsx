'use client';

import React, { useState } from 'react';
import { Container, Button, Spinner } from '@/shared/ui';
import { GameCard, useGames } from '@/entities/game';
import { AddToCartButton } from '@/features/add-to-cart';
import { SearchGamesInput } from '@/features/search-games';
import { OrderingSelect } from '@/features/filter-games';
import styles from './game-catalog.module.css';

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
    <div className={styles.catalogWrapper}>
      <Container>
        <div className={styles.header}>
          <h1 className={styles.title}>Catálogo de Jogos</h1>
          <p className={styles.subtitle}>
            Explore nossa biblioteca com milhares de jogos nacionais e internacionais
          </p>
        </div>

        <div className={styles.filters}>
          <SearchGamesInput onSearch={(val) => setSearchTerm(val)} />
          <OrderingSelect value={ordering} onChange={(val) => setOrdering(val)} />
        </div>

        {loading && <Spinner label="Carregando jogos da RAWG API..." />}

        {error && <div className={styles.errorState}>{error}</div>}

        {!loading && !error && games.length === 0 && (
          <div className={styles.emptyState}>
            <p>Nenhum jogo encontrado. Tente um termo de busca diferente.</p>
          </div>
        )}

        {!loading && !error && games.length > 0 && (
          <>
            <div className={styles.gamesGrid}>
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

            <div className={styles.pagination}>
              <Button onClick={prevPage} disabled={page === 1} variant="outline">
                Anterior
              </Button>
              <span className={styles.pageIndicator}>Página {page}</span>
              <Button onClick={nextPage} disabled={!hasMore} variant="outline">
                Próxima
              </Button>
            </div>
          </>
        )}

        {toastMessage && (
          <div
            className={`${styles.toast} ${
              !toastMessage.added ? styles.toastRemoved : ''
            }`}
          >
            {toastMessage.text}
          </div>
        )}
      </Container>
    </div>
  );
};
