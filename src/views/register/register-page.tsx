'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { RegisterForm } from '@/features/auth';
import styles from './register-page.module.css';

export const RegisterPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className={styles.authPage}>
        <Container maxWidth="md">
          <div className={styles.authCard}>
            <h1 className={styles.authTitle}>Criar Conta</h1>
            <p className={styles.authSubtitle}>
              Preencha seus dados para começar a comprar na Iara Games
            </p>

            <RegisterForm />

            <div className={styles.authFooter}>
              <p>
                Já tem uma conta?{' '}
                <Link href={ROUTES.login} className={styles.authLink}>
                  Faça login
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
