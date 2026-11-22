'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, GameController } from '@phosphor-icons/react';
import { Container, Button, Card, CardContent, Badge } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { formatCurrency, formatDateTime } from '@/shared/lib/formatters';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { Order, getOrdersHistory, getLastOrder } from '@/entities/order';

export const SuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orderId = searchParams?.get('orderId');
    const history = getOrdersHistory();

    if (orderId) {
      const found = history.find((o) => o.id === orderId);
      if (found) {
        setOrder(found);
        return;
      }
    }

    const last = getLastOrder();
    if (last) {
      setOrder(last);
    }
  }, [searchParams]);

  const paymentLabel = (method: string = 'card') => {
    switch (method) {
      case 'pix':
        return 'PIX';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return 'Cartão de Crédito';
    }
  };

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-16">
          <Container size="md">
            <Card className="mx-auto max-w-md border-white/5 bg-card/90 text-center shadow-2xl">
              <CardContent className="p-8">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_0_20px_rgba(204,254,44,0.2)]">
                  <Check size={32} weight="bold" />
                </div>
                <h1 className="text-2xl font-extrabold text-foreground">Pedido Concluído</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Obrigado por comprar na Iara Games! Seus jogos já estão prontos.
                </p>
                <div className="mt-6">
                  <Link href={ROUTES.catalog}>
                    <Button size="lg" className="font-bold">
                      Explorar Catálogo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <Container size="md">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <Check size={40} weight="bold" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Pagamento Aprovado!
              </h1>
              <p className="mt-2 text-muted-foreground">
                Seu pedido foi confirmado e seus jogos já estão liberados para ativação.
              </p>
            </div>

            <Card className="border-white/5 bg-card/90 shadow-2xl backdrop-blur-md">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Pedido</span>
                    <p className="font-mono text-lg font-bold text-primary">#{order.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Data</span>
                    <p className="text-sm font-medium text-foreground">{formatDateTime(order.date)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Itens Adquiridos
                  </h3>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order.id}-${item.id}-${index}`}
                        className="flex items-center justify-between rounded-lg bg-black/20 p-3 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <GameController size={20} className="text-primary" weight="fill" />
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                        <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 rounded-lg bg-black/30 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Forma de Pagamento:</span>
                    <span className="font-medium text-foreground">{paymentLabel(order.paymentMethod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Comprador:</span>
                    <span className="font-medium text-foreground">{order.customer.name}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-2 text-base font-bold">
                    <span>Total Pago:</span>
                    <span className="text-primary">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <Link href={ROUTES.orders} className="flex-1">
                    <Button fullWidth size="lg" className="font-bold">
                      Ver Meus Pedidos
                    </Button>
                  </Link>
                  <Link href={ROUTES.catalog} className="flex-1">
                    <Button fullWidth size="lg" variant="outline">
                      Continuar Comprando
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};
