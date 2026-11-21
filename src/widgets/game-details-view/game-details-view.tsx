'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, GameController, ArrowLeft } from '@phosphor-icons/react';
import { Container, Button, Spinner } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';
import { useGameDetails } from '@/entities/game';
import { AddToCartButton } from '@/features/add-to-cart';
import styles from './game-details-view.module.css';

export interface GameDetailsViewProps {
  gameId: string | number;
}

export const GameDetailsView: React.FC<GameDetailsViewProps> = ({ gameId }) => {
  const router = useRouter();
  const { game, loading, error } = useGameDetails(gameId);

  if (loading) {
    return (
      <Container>
        <Spinner label="Carregando detalhes do jogo..." />
      </Container>
    );
  }

  if (error || !game) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <h2>{error || 'Jogo não encontrado'}</h2>
          <Button onClick={() => router.push(ROUTES.catalog)} style={{ marginTop: 24 }}>
            Voltar ao Catálogo
          </Button>
        </div>
      </Container>
    );
  }

  const price = Math.round((game.rating * 10 + 20) * 100) / 100;

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <Link href={ROUTES.catalog} className={styles.backButton}>
          <ArrowLeft size={16} /> Voltar ao Catálogo
        </Link>

        <div className={styles.detailsGrid}>
          <div className={styles.infoSection}>
            <h1 className={styles.title}>{game.name}</h1>

            {game.genres && game.genres.length > 0 && (
              <div className={styles.genres}>
                {game.genres.map((g) => (
                  <span key={g.id} className={styles.genreBadge}>
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.metaGrid}>
              {game.released && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Lançamento:</span>
                  <span className={styles.metaValue}>{formatDate(game.released)}</span>
                </div>
              )}
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Avaliação:</span>
                <span className={`${styles.metaValue} ${styles.ratingValue}`}>
                  <Star size={18} weight="fill" /> {game.rating.toFixed(1)} / 5
                </span>
              </div>
              {game.metacritic && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Metacritic:</span>
                  <span className={styles.metaValue}>{game.metacritic}</span>
                </div>
              )}
              {game.playtime ? (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Tempo médio:</span>
                  <span className={styles.metaValue}>{game.playtime}h</span>
                </div>
              ) : null}
            </div>

            {game.platforms && game.platforms.length > 0 && (
              <div className={styles.platforms}>
                <h3>Plataformas:</h3>
                <div className={styles.platformsList}>
                  {game.platforms.map((p) => (
                    <span key={p.platform.id} className={styles.platformTag}>
                      {p.platform.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {game.description_raw && (
              <div className={styles.description}>
                <h3>Sobre o jogo:</h3>
                <p>{game.description_raw}</p>
              </div>
            )}

            <div className={styles.purchaseBox}>
              <div>
                <span className={styles.priceLabel}>Preço Digital:</span>
                <div className={styles.priceValue}>{formatCurrency(price)}</div>
              </div>
              <AddToCartButton
                size="lg"
                item={{
                  id: game.id,
                  name: game.name,
                  price,
                  image: game.background_image,
                }}
              />
            </div>
          </div>

          <div className={styles.imageSection}>
            {game.background_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={game.background_image}
                alt={game.name}
                className={styles.gameImage}
              />
            ) : (
              <div className={styles.placeholder}>
                <GameController size={120} weight="fill" />
              </div>
            )}
          </div>
        </div>

        {game.short_screenshots && game.short_screenshots.length > 0 && (
          <div className={styles.screenshots}>
            <h2>Capturas de Tela</h2>
            <div className={styles.screenshotsGrid}>
              {game.short_screenshots.slice(0, 6).map((ss) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={ss.id}
                  src={ss.image}
                  alt={`Captura ${game.name}`}
                  className={styles.screenshotImage}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};
