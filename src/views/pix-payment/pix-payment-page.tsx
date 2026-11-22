'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, CheckCircle } from '@phosphor-icons/react';
import { Container, Button, Spinner, Card, CardContent } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CopyButton } from '@/features/copy-to-clipboard';
import { RouteGuard } from '@/features/route-guard';
import {
  Order,
  getPendingOrder,
  getOrdersHistory,
  saveOrderToHistory,
  clearPendingOrder,
} from '@/entities/order';
import { generatePix, GeneratedPix } from '@/entities/payment';

export const PixPaymentPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [pixData, setPixData] = useState<GeneratedPix | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pending = getPendingOrder();
    if (!pending) {
      const history = getOrdersHistory();
      const pixPending = history.find((o) => o.paymentMethod === 'pix' && !o.pixPaid);
      if (pixPending) {
        pending = pixPending;
      }
    }
    if (!pending) {
      router.push(ROUTES.cart);
      return;
    }

    setOrder(pending);

    generatePix(pending.total, pending.id)
      .then((pix) => {
        setPixData(pix);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao gerar PIX:', err);
        setLoading(false);
      });
  }, [router]);

  const handlePaymentConfirmed = () => {
    if (!order) return;

    const paidOrder: Order = {
      ...order,
      pixPaid: true,
    };

    saveOrderToHistory(paidOrder);
    clearPendingOrder();
    router.push(`${ROUTES.success}?orderId=${paidOrder.id}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-12">
        <RouteGuard>
          <Container size="md">
            {loading || !order || !pixData ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                <Spinner size="lg" />
                <span className="text-sm text-muted-foreground">Gerando QR Code PIX...</span>
              </div>
            ) : (
              <div className="mx-auto max-w-xl">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_20px_rgba(204,254,44,0.2)]">
                    <QrCode size={40} weight="fill" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-foreground">Pagamento via PIX</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Escaneie o QR Code ou copie o código para pagar
                  </p>
                </div>

                <Card className="border-white/5 bg-card/90 shadow-2xl backdrop-blur-md">
                  <CardContent className="space-y-6 p-6 sm:p-8">
                    <div className="space-y-3 rounded-lg bg-black/20 p-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beneficiário:</span>
                        <span className="font-semibold text-foreground">Iara Games LTDA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Chave PIX:</span>
                        <span className="font-mono text-foreground">{pixData.pixKey}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2">
                        <span className="text-muted-foreground">Valor Total:</span>
                        <span className="text-lg font-bold text-primary">R$ {pixData.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Validade:</span>
                        <span className="text-foreground">{pixData.expiresIn} minutos</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-black/30 p-6">
                      <div className="rounded-lg bg-white p-3 shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pixData.qrCode}
                          alt="QR Code PIX"
                          className="h-48 w-48 object-contain"
                        />
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Aponte a câmera do aplicativo do seu banco
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        PIX Copia e Cola
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={pixData.payload}
                          className="h-10 flex-1 rounded-lg border border-input bg-black/40 px-3 font-mono text-xs text-muted-foreground focus:outline-none"
                        />
                        <CopyButton textToCopy={pixData.payload} />
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-6">
                      <Button
                        type="button"
                        fullWidth
                        size="lg"
                        onClick={handlePaymentConfirmed}
                        className="gap-2 font-bold"
                      >
                        <CheckCircle size={22} weight="bold" />
                        <span>Confirmar que Paguei</span>
                      </Button>
                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        Ambiente de demonstração: clique para simular aprovação imediata.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </Container>
        </RouteGuard>
      </main>
      <Footer />
    </div>
  );
};
