'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, GameController, ArrowLeft } from '@phosphor-icons/react';
import { Container, Button, Spinner, Card, CardContent, Badge } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { formatCurrency, formatDate } from '@/shared/lib/formatters';
import { useGameDetails } from '@/entities/game';
import { AddToCartButton } from '@/features/add-to-cart';

export interface GameDetailsViewProps {
  gameId: string | number;
}

export const GameDetailsView: React.FC<GameDetailsViewProps> = ({ gameId }) => {
  const router = useRouter();
  const { game, loading, error } = useGameDetails(gameId);

  if (loading) {
    return (
      <Container className="py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <span className="text-sm text-muted-foreground">Carregando detalhes do jogo...</span>
        </div>
      </Container>
    );
  }

  if (error || !game) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground">{error || 'Jogo não encontrado'}</h2>
        <Button onClick={() => router.push(ROUTES.catalog)} className="mt-6 font-bold">
          Voltar ao Catálogo
        </Button>
      </Container>
    );
  }

  const price = Math.round((game.rating * 10 + 20) * 100) / 100;

  return (
    <div className="py-12">
      <Container>
        <Link
          href={ROUTES.catalog}
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={18} /> Voltar ao Catálogo
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Main Info (Left 2 cols) */}
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                {game.name}
              </h1>

              {game.genres && game.genres.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {game.genres.map((g) => (
                    <Badge key={g.id} variant="secondary" className="font-semibold">
                      {g.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Media Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl">
              {game.background_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <GameController size={64} weight="fill" />
                </div>
              )}
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/5 bg-card/60 p-6 sm:grid-cols-4">
              {game.released && (
                <div>
                  <span className="text-xs text-muted-foreground">Lançamento</span>
                  <p className="mt-1 font-semibold text-foreground">{formatDate(game.released)}</p>
                </div>
              )}
              <div>
                <span className="text-xs text-muted-foreground">Avaliação</span>
                <p className="mt-1 flex items-center gap-1 font-bold text-yellow-400">
                  <Star size={16} weight="fill" /> {game.rating.toFixed(1)} / 5
                </p>
              </div>
              {game.metacritic && (
                <div>
                  <span className="text-xs text-muted-foreground">Metacritic</span>
                  <p className="mt-1 font-bold text-primary">{game.metacritic}</p>
                </div>
              )}
              {game.playtime ? (
                <div>
                  <span className="text-xs text-muted-foreground">Tempo médio</span>
                  <p className="mt-1 font-semibold text-foreground">{game.playtime}h</p>
                </div>
              ) : null}
            </div>

            {/* Platforms */}
            {game.platforms && game.platforms.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Plataformas Disponíveis
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((p) => (
                    <Badge key={p.platform.id} variant="outline" className="text-xs">
                      {p.platform.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">Sobre o Jogo</h3>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {game.description_raw || 'Sem descrição disponível para este título.'}
              </p>
            </div>
          </div>

          {/* Purchase Sidebar (Right 1 col) */}
          <div>
            <Card className="sticky top-28 border-white/10 bg-card/90 shadow-2xl backdrop-blur-md">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Preço Digital</span>
                  <div className="mt-1 text-3xl font-black text-primary">
                    {formatCurrency(price)}
                  </div>
                  <span className="text-xs text-muted-foreground">Entrega digital imediata por chave de ativação</span>
                </div>

                <div className="space-y-3">
                  <AddToCartButton
                    item={{
                      id: game.id,
                      name: game.name,
                      price,
                      image: game.background_image,
                    }}
                  />
                  <Link href={ROUTES.cart} className="block">
                    <Button variant="outline" fullWidth size="lg">
                      Ir para o Carrinho
                    </Button>
                  </Link>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4 text-xs text-muted-foreground">
                  <p>✓ Garantia de ativação 100% oficial</p>
                  <p>✓ Suporte a PIX, Boleto e Cartão em até 12x</p>
                  <p>✓ Reembolso garantido em até 7 dias</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};
