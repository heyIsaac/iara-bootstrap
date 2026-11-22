'use client';

import React from 'react';
import Link from 'next/link';
import { Star, GameController } from '@phosphor-icons/react';
import { ROUTES } from '@/shared/config';
import { formatCurrency } from '@/shared/lib/formatters';
import { Card, Badge } from '@/shared/ui';

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
    <Card className="group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-card/80 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(204,254,44,0.15)]">
      <Link
        href={ROUTES.gameDetails(id)}
        className="relative block aspect-video w-full overflow-hidden bg-black/40"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <GameController size={48} weight="fill" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={ROUTES.gameDetails(id)}
          className="line-clamp-1 text-base font-bold text-foreground transition-colors hover:text-primary"
        >
          {name}
        </Link>

        {genres && genres.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {genres.slice(0, 2).map((genre) => (
              <Badge key={genre.id} variant="secondary" className="text-[10px] uppercase font-semibold">
                {genre.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1 font-semibold text-yellow-400">
            <Star size={15} weight="fill" />
            <span>{rating.toFixed(1)}</span>
          </div>
          {releaseYear && <span>{releaseYear}</span>}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(price)}
          </span>
          {actionSlot}
        </div>
      </div>
    </Card>
  );
};
