'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, GameController } from '@phosphor-icons/react';
import { Container, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { formatCurrency, formatDateTime } from '@/shared/lib/formatters';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { Order, getOrdersHistory, getLastOrder } from '@/entities/order';
import styles from './success-page.module.css';

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
      <>
        <Header />
        <main className={styles.successPage}>
          <Container maxWidth="md">
            <div className={styles.successCard}>
              <div className={`${styles.successIcon} ${styles.successIconWarning}`}>
                <Check size={32} weight="bold" />
              </div>
              <h1 className={styles.successTitle}>Pedido Concluído</h1>
              <p className={styles.successMessage}>
                Obrigado por comprar na Iara Games! Seus jogos já estão prontos.
              </p>
              <Link href={ROUTES.catalog}>
                <Button size="lg">Explorar Catálogo</Button>
              </Link>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.successPage}>
        <Container maxWidth="md">
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <Check size={32} weight="bold" />
            </div>

            <h1 className={styles.successTitle}>✨ Pedido Realizado com Sucesso! ✨</h1>

            <p className={styles.successMessage}>
              Parabéns, {order.customer.name}! Seu pedido foi confirmado e seus jogos
              já estão disponíveis para download imediato.
            </p>

            <div className={styles.orderDetails}>
              <div className={styles.orderHeader}>
                <h2>Detalhes da Compra</h2>
                <span className={styles.orderId}>#{order.id}</span>
              </div>

              <div className={styles.orderRow}>
                <span>Data:</span>
                <strong>{formatDateTime(order.date)}</strong>
              </div>

              <div className={styles.orderRow}>
                <span>Pagamento:</span>
                <strong>{paymentLabel(order.paymentMethod)}</strong>
              </div>

              <div className={styles.orderItems}>
                {order.items.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className={styles.orderItem}>
                    <span>{item.name}</span>
                    <strong>{formatCurrency(item.price)}</strong>
                  </div>
                ))}
              </div>

              <div className={styles.orderTotal}>
                <span>Total:</span>
                <span className={styles.totalValue}>{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href={ROUTES.orders}>
                <Button size="lg">Ver Meus Pedidos</Button>
              </Link>
              <Link href={ROUTES.catalog}>
                <Button size="lg" variant="outline">
                  <GameController size={20} /> Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};
