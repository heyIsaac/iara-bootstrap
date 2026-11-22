'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { RegisterForm } from '@/features/auth';

export const RegisterPage: React.FC = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');
  const loginHref = redirect ? `${ROUTES.login}?redirect=${redirect}` : ROUTES.login;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <Container size="md">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Criar Conta
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Preencha seus dados para começar a comprar na Iara Games
              </p>
            </div>

            <RegisterForm />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Já tem uma conta?{' '}
                <Link
                  href={loginHref}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};
