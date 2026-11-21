'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Receipt, CreditCard } from '@phosphor-icons/react';
import { Container, Button, Spinner } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { formatCurrency } from '@/shared/lib/formatters';
import { Order, OrderCard, getOrdersHistory } from '@/entities/order';
import styles from './order-history.module.css';

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOrders(getOrdersHistory());
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner label="Carregando pedidos..." />;
  }

  if (orders.length === 0) {
    return (
      <div className={styles.ordersPage}>
        <Container>
          <div className={styles.emptyOrders}>
            <div className={styles.emptyIcon}>
              <Package size={100} weight="fill" />
            </div>
            <h2>Nenhum pedido encontrado</h2>
            <p>Você ainda não realizou compras. Venha conhecer nosso catálogo!</p>
            <Link href={ROUTES.catalog}>
              <Button size="lg">Explorar Catálogo</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const totalGames = orders.reduce((sum, order) => sum + order.items.length, 0);
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className={styles.ordersPage}>
      <Container>
        <div className={styles.header}>
          <h1 className={styles.title}>Meus Pedidos</h1>
          <p className={styles.subtitle}>
            Histórico completo das suas compras de jogos digitais
          </p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <Receipt size={32} weight="fill" />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{orders.length}</span>
              <span className={styles.statLabel}>Pedidos Realizados</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <Package size={32} weight="fill" />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalGames}</span>
              <span className={styles.statLabel}>Jogos Adquiridos</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <CreditCard size={32} weight="fill" />
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatCurrency(totalSpent)}</span>
              <span className={styles.statLabel}>Total Investido</span>
            </div>
          </div>
        </div>

        <div className={styles.ordersList}>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </Container>
    </div>
  );
};
