'use client';

import React from 'react';
import Link from 'next/link';
import { Star, GameController } from '@phosphor-icons/react';
import { ROUTES } from '@/shared/config';
import { formatCurrency } from '@/shared/lib/formatters';
import styles from './game-card.module.css';

export interface GameCardProps {
  id: number;
  name: string;
  image: string | null;
  rating: number;
  released?: string;
  genres?: Array<{ id: number; name: string }>;
  actionSlot?: React.ReactNode;
}

export const GameCard: React.FC<GameCardProps> = ({
  id,
  name,
  image,
  rating,
  released,
  genres,
  actionSlot,
}) => {
  const price = Math.round((rating * 10 + 20) * 100) / 100;
  const releaseYear = released ? new Date(released).getFullYear() : null;

  return (
    <div className={styles.gameCard}>
      <Link href={ROUTES.gameDetails(id)} className={styles.imageLink}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <GameController size={48} weight="fill" />
          </div>
        )}
      </Link>

      <div className={styles.content}>
        <Link href={ROUTES.gameDetails(id)} className={styles.title}>
          {name}
        </Link>

        {genres && genres.length > 0 && (
          <div className={styles.genres}>
            {genres.slice(0, 2).map((genre) => (
              <span key={genre.id} className={styles.genreTag}>
                {genre.name}
              </span>
            ))}
          </div>
        )}

        <div className={styles.meta}>
          <div className={styles.rating}>
            <Star size={16} weight="fill" className={styles.ratingStar} />
            <span>{rating.toFixed(1)}</span>
          </div>
          {releaseYear && <span>{releaseYear}</span>}
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>{formatCurrency(price)}</span>
          {actionSlot}
        </div>
      </div>
    </div>
  );
};
