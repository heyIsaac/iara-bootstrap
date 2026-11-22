'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle } from '@phosphor-icons/react';
import { Container, Button, Card, CardContent } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';

export const CancelPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-16">
        <Container size="sm">
          <Card className="mx-auto max-w-md border-white/5 bg-card/90 shadow-2xl backdrop-blur-md">
            <CardContent className="space-y-6 p-6 text-center sm:p-8">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-[0_0_30px_rgba(255,45,85,0.2)]">
                <XCircle size={56} weight="fill" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  Pagamento Cancelado
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Você cancelou o processo de pagamento. Não se preocupe, seus jogos
                  permanecem no seu carrinho caso queira tentar novamente.
                </p>
              </div>

              <div className="rounded-lg bg-black/20 p-4 text-left text-xs text-muted-foreground">
                <h3 className="mb-2 font-bold text-foreground">O que aconteceu?</h3>
                <ul className="space-y-1 list-disc pl-4">
                  <li>Nenhum valor foi cobrado do seu cartão ou conta</li>
                  <li>Seus itens continuam salvos no carrinho</li>
                  <li>Você pode retomar seu pedido quando preferir</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <Link href={ROUTES.cart} className="block">
                  <Button size="lg" fullWidth className="font-bold">
                    Voltar ao Carrinho
                  </Button>
                </Link>
                <Link href={ROUTES.catalog} className="block">
                  <Button size="lg" fullWidth variant="outline">
                    Continuar Comprando
                  </Button>
                </Link>
                <Link
                  href={ROUTES.home}
                  className="inline-block pt-2 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Voltar para Início
                </Link>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
};
