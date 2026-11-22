'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { LoginForm } from '@/features/auth';

export const LoginPage: React.FC = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect');
  const registerHref = redirect ? `${ROUTES.register}?redirect=${redirect}` : ROUTES.register;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-16">
        <Container size="sm">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Entrar na Conta
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Acesse sua conta para gerenciar seus jogos e pedidos
              </p>
            </div>

            <LoginForm />

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                Ainda não tem uma conta?{' '}
                <Link
                  href={registerHref}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Cadastre-se grátis
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
