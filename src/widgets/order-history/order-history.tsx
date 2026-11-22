'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Receipt, CreditCard } from '@phosphor-icons/react';
import { Container, Button, Spinner, Card, CardContent } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { formatCurrency } from '@/shared/lib/formatters';
import { Order, OrderCard, getOrdersHistory } from '@/entities/order';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = () => {
      setOrders(getOrdersHistory());
      setLoading(false);
    };

    loadOrders();
    window.addEventListener('orderHistoryUpdated', loadOrders);
    window.addEventListener('storage', loadOrders);

    return () => {
      window.removeEventListener('orderHistoryUpdated', loadOrders);
      window.removeEventListener('storage', loadOrders);
    };
  }, []);

  if (loading) {
    return (
      <Container className="py-20">
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" />
          <span className="text-sm text-muted-foreground">Carregando pedidos...</span>
        </div>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-20">
        <Container>
          <Card className="mx-auto max-w-lg border-white/5 bg-card/60 text-center shadow-2xl">
            <CardContent className="space-y-6 p-8 sm:p-12">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_0_30px_rgba(204,254,44,0.2)]">
                <Package size={48} weight="fill" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  Nenhum pedido encontrado
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Você ainda não realizou compras. Venha conhecer nosso catálogo!
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

  const totalGames = orders.reduce((sum, order) => sum + order.items.length, 0);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="py-12 md:py-16">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Meus Pedidos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Histórico completo das suas compras de jogos digitais
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-white/5 bg-card/80">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Receipt size={28} weight="fill" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground">{orders.length}</span>
                <p className="text-xs text-muted-foreground">Pedidos Realizados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/80">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Package size={28} weight="fill" />
              </div>
              <div>
                <span className="text-2xl font-black text-foreground">{totalGames}</span>
                <p className="text-xs text-muted-foreground">Jogos Adquiridos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/80">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard size={28} weight="fill" />
              </div>
              <div>
                <span className="text-2xl font-black text-primary">{formatCurrency(totalSpent)}</span>
                <p className="text-xs text-muted-foreground">Total Investido</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </Container>
    </div>
  );
};
