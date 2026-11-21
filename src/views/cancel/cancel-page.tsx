'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle } from '@phosphor-icons/react';
import { Container, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import styles from './cancel-page.module.css';

export const CancelPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className={styles.cancelPage}>
        <Container maxWidth="sm">
          <div className={styles.cancelCard}>
            <div className={styles.cancelIcon}>
              <XCircle size={64} weight="fill" />
            </div>

            <h1 className={styles.cancelTitle}>Pagamento Cancelado</h1>

            <p className={styles.cancelMessage}>
              Você cancelou o processo de pagamento. Não se preocupe, seus jogos
              permanecem no seu carrinho caso queira tentar novamente.
            </p>

            <div className={styles.cancelInfo}>
              <h3>O que aconteceu?</h3>
              <ul>
                <li>Nenhum valor foi cobrado do seu cartão ou conta</li>
                <li>Seus itens continuam salvos no carrinho</li>
                <li>Você pode retomar seu pedido quando preferir</li>
              </ul>
            </div>

            <div className={styles.actions}>
              <Link href={ROUTES.cart}>
                <Button size="lg" fullWidth>
                  Voltar ao Carrinho
                </Button>
              </Link>
              <Link href={ROUTES.catalog}>
                <Button size="lg" fullWidth variant="outline">
                  Continuar Comprando
                </Button>
              </Link>
              <Link href={ROUTES.home} className={styles.backHome}>
                Voltar para Início
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};
