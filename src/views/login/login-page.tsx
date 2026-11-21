'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { LoginForm } from '@/features/auth';
import styles from './login-page.module.css';

export const LoginPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className={styles.authPage}>
        <Container maxWidth="sm">
          <div className={styles.authCard}>
            <h1 className={styles.authTitle}>Entrar na Conta</h1>
            <p className={styles.authSubtitle}>
              Acesse sua conta para gerenciar seus jogos e pedidos
            </p>

            <LoginForm />

            <div className={styles.authFooter}>
              <p>
                Ainda não tem uma conta?{' '}
                <Link href={ROUTES.register} className={styles.authLink}>
                  Cadastre-se grátis
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};
