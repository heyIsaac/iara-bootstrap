'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Barcode as BarcodeIcon, CheckCircle, Printer } from '@phosphor-icons/react';
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
import { generateBoleto, GeneratedBoleto } from '@/entities/payment';

// Dynamic import for react-barcode to prevent SSR mismatch
const BarcodeDisplay = dynamic(() => import('react-barcode'), { ssr: false });

export const BoletoPaymentPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [boletoData, setBoletoData] = useState<GeneratedBoleto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pending = getPendingOrder();
    if (!pending) {
      const history = getOrdersHistory();
      const boletoPending = history.find((o) => o.paymentMethod === 'boleto' && !o.boletoPaid);
      if (boletoPending) {
        pending = boletoPending;
      }
    }
    if (!pending) {
      router.push(ROUTES.cart);
      return;
    }

    setOrder(pending);

    const boleto = generateBoleto({
      value: pending.total,
      orderId: pending.id,
      customerName: pending.customer.name,
      customerCpf: pending.customer.cpf,
    });

    setBoletoData(boleto);
    setLoading(false);
  }, [router]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handlePaymentConfirmed = () => {
    if (!order) return;

    const paidOrder: Order = {
      ...order,
      boletoPaid: true,
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
            {loading || !order || !boletoData ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                <Spinner size="lg" />
                <span className="text-sm text-muted-foreground">Gerando Boleto Bancário...</span>
              </div>
            ) : (
              <div className="mx-auto max-w-xl">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_20px_rgba(204,254,44,0.2)]">
                    <BarcodeIcon size={40} weight="fill" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-foreground">Boleto Bancário</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Copie a linha digitável ou imprima o boleto para pagamento
                  </p>
                </div>

                <Card className="border-white/5 bg-card/90 shadow-2xl backdrop-blur-md">
                  <CardContent className="space-y-6 p-6 sm:p-8">
                    <div className="space-y-3 rounded-lg bg-black/20 p-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Beneficiário:</span>
                        <span className="font-semibold text-foreground">{boletoData.recipient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CNPJ:</span>
                        <span className="font-mono text-foreground">{boletoData.cnpj}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pagador:</span>
                        <span className="text-foreground">{boletoData.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vencimento:</span>
                        <span className="text-foreground">{boletoData.dueDate}</span>
                      </div>
                      <div className="flex justify-between border-t border-white/5 pt-2">
                        <span className="text-muted-foreground">Valor:</span>
                        <span className="text-lg font-bold text-primary">R$ {boletoData.value}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Linha Digitável
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={boletoData.digitableLine}
                          className="h-10 flex-1 rounded-lg border border-input bg-black/40 px-3 font-mono text-xs text-muted-foreground focus:outline-none"
                        />
                        <CopyButton textToCopy={boletoData.digitableLine} />
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center overflow-x-auto rounded-xl border border-white/5 bg-white p-4">
                      <BarcodeDisplay
                        value={boletoData.barcode.replace(/\D/g, '').substring(0, 44)}
                        format="CODE128"
                        width={1.6}
                        height={55}
                        displayValue={false}
                        background="#ffffff"
                        lineColor="#000000"
                      />
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/5 pt-6 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrint}
                        className="flex-1 gap-2"
                      >
                        <Printer size={20} />
                        <span>Imprimir Boleto</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={handlePaymentConfirmed}
                        className="flex-1 gap-2 font-bold"
                      >
                        <CheckCircle size={20} weight="bold" />
                        <span>Simular Pagamento</span>
                      </Button>
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
