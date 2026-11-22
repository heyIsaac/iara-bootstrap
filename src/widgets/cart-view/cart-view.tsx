'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, GameController, Trash } from '@phosphor-icons/react';
import { Container, Button, Spinner, Card, CardContent } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { formatCurrency } from '@/shared/lib/formatters';
import { useCart, useCartSounds } from '@/entities/cart';
import { useAuth } from '@/entities/user';

export const CartView: React.FC = () => {
  const router = useRouter();
  const { items, loading, removeItem, clearCart, subtotal, total } = useCart();
  const { playRemove } = useCartSounds();
  const { isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Container className="py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <span className="text-sm text-muted-foreground">Carregando carrinho...</span>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-20">
        <Container>
          <Card className="mx-auto max-w-lg border-white/5 bg-card/60 text-center shadow-2xl">
            <CardContent className="space-y-6 p-8 sm:p-12">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_0_30px_rgba(204,254,44,0.2)]">
                <ShoppingCart size={48} weight="fill" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  Seu carrinho está vazio
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Adicione jogos incríveis do nosso catálogo para continuar!
                </p>
              </div>
              <Link href={ROUTES.catalog} className="inline-block">
                <Button size="lg" className="font-bold">
                  Explorar Catálogo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  const handleRemove = (id: number) => {
    removeItem(id);
    playRemove();
  };

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Carrinho de Compras
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Revise seus itens antes de prosseguir para o checkout seguro
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive"
          >
            Limpar Carrinho
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Items List (Left 2 cols) */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden border-white/5 bg-card/80 transition-all hover:border-white/10"
              >
                <div className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-black/40 sm:h-24 sm:w-36">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <GameController size={32} weight="fill" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="line-clamp-1 text-base font-bold text-foreground sm:text-lg">
                        {item.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">Chave Digital Steam / Oficial</span>
                    </div>
                    <div className="mt-2 text-lg font-bold text-primary">
                      {formatCurrency(item.price)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remover ${item.name} do carrinho`}
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary Sidebar (Right 1 col) */}
          <div>
            <Card className="sticky top-28 border-white/10 bg-card/90 shadow-2xl backdrop-blur-md">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-foreground">Resumo do Pedido</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({items.length} {items.length === 1 ? 'jogo' : 'jogos'}):
                    </span>
                    <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Desconto:</span>
                    <span className="font-semibold text-emerald-400">R$ 0,00</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entrega digital:</span>
                    <span className="font-semibold text-emerald-400">GRÁTIS</span>
                  </div>

                  <div className="flex justify-between border-t border-white/5 pt-3 text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-2xl font-black text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    fullWidth
                    size="lg"
                    className="font-bold cursor-pointer"
                    onClick={() => {
                      if (!isAuthenticated) {
                        router.push(`${ROUTES.login}?redirect=checkout`);
                      } else {
                        router.push(ROUTES.checkout);
                      }
                    }}
                  >
                    Fechar Pedido
                  </Button>
                  <Link href={ROUTES.catalog} className="block">
                    <Button variant="outline" fullWidth size="lg">
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>

                <div className="border-t border-white/5 pt-4 text-center text-xs text-muted-foreground">
                  {!isAuthenticated && (
                    <p>
                      Você será redirecionado para login antes de finalizar a compra.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};
