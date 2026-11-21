'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Barcode as BarcodeIcon, CheckCircle, Printer } from '@phosphor-icons/react';
import { Container, Button, Spinner } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CopyButton } from '@/features/copy-to-clipboard';
import { RouteGuard } from '@/features/route-guard';
import {
  Order,
  getPendingOrder,
  saveOrderToHistory,
  clearPendingOrder,
} from '@/entities/order';
import { generateBoleto, GeneratedBoleto } from '@/entities/payment';
import styles from './boleto-payment-page.module.css';

// Dynamic import for react-barcode to prevent SSR mismatch
const BarcodeDisplay = dynamic(() => import('react-barcode'), { ssr: false });

export const BoletoPaymentPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [boletoData, setBoletoData] = useState<GeneratedBoleto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pending = getPendingOrder();
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
    <>
      <Header />
      <main className={styles.boletoPage}>
        <RouteGuard>
          <Container maxWidth="md">
            {loading || !order || !boletoData ? (
              <Spinner label="Gerando Boleto Bancário..." />
            ) : (
              <>
                <div className={styles.header}>
                  <div className={styles.icon}>
                    <BarcodeIcon size={48} weight="fill" />
                  </div>
                  <h1>Boleto Bancário</h1>
                  <p>Copie a linha digitável ou imprima o boleto para pagamento</p>
                </div>

                <div className={styles.card}>
                  <div className={styles.info}>
                    <div className={styles.row}>
                      <span className={styles.label}>Beneficiário:</span>
                      <span className={styles.value}>{boletoData.recipient}</span>
                    </div>
                    <div className={styles.row}>
                      <span className={styles.label}>CNPJ:</span>
                      <span className={styles.value}>{boletoData.cnpj}</span>
                    </div>
                    <div className={styles.row}>
                      <span className={styles.label}>Pagador:</span>
                      <span className={styles.value}>{boletoData.customerName}</span>
                    </div>
                    <div className={styles.row}>
                      <span className={styles.label}>CPF:</span>
                      <span className={styles.value}>{boletoData.customerCpf}</span>
                    </div>
                    <div className={styles.row}>
                      <span className={styles.label}>Valor do Documento:</span>
                      <span className={`${styles.value} ${styles.valueHighlight}`}>
                        R$ {boletoData.value}
                      </span>
                    </div>
                    <div className={styles.row}>
                      <span className={styles.label}>Vencimento:</span>
                      <span className={styles.value}>{boletoData.dueDate}</span>
                    </div>
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.digitableLineSection}>
                    <label>Linha Digitável (Código de Barras)</label>
                    <div className={styles.lineContainer}>
                      <span className={styles.lineText}>
                        {boletoData.digitableLine}
                      </span>
                      <CopyButton
                        textToCopy={boletoData.digitableLine}
                        label="Copiar Linha"
                      />
                    </div>
                  </div>

                  <div className={styles.barcodeSection}>
                    <label>Código de Barras</label>
                    <div className={styles.barcodeContainer}>
                      <BarcodeDisplay
                        value={boletoData.barcode}
                        format="CODE128"
                        width={2}
                        height={80}
                        displayValue={false}
                      />
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <Button variant="outline" fullWidth onClick={handlePrint}>
                      <Printer size={20} /> Imprimir Boleto
                    </Button>
                  </div>

                  <div className={styles.warning}>
                    <p>
                      ⚠️ O prazo de compensação do boleto é de até 3 dias úteis. Em
                      ambiente de testes, clique em &quot;Confirmar Pagamento&quot; abaixo
                      para simular a aprovação instantânea!
                    </p>
                  </div>
                </div>

                <div className={styles.confirmSection}>
                  <div className={styles.confirmIcon}>
                    <CheckCircle size={48} weight="fill" />
                  </div>
                  <h2>Já efetuou o pagamento?</h2>
                  <p>Confirme o pagamento para liberar seus jogos</p>
                  <Button size="lg" onClick={handlePaymentConfirmed}>
                    <CheckCircle size={22} weight="fill" /> Já Paguei
                  </Button>
                </div>

                <div className={styles.help}>
                  <h3>Instruções de pagamento:</h3>
                  <ol>
                    <li>Acesse o Internet Banking ou aplicativo do seu banco</li>
                    <li>Escolha a opção &quot;Pagar Boleto&quot;</li>
                    <li>Escaneie o código de barras ou cole a linha digitável</li>
                    <li>Confirme a operação</li>
                    <li>Seus jogos serão liberados após a compensação bancária</li>
                  </ol>
                </div>
              </>
            )}
          </Container>
        </RouteGuard>
      </main>
      <Footer />
    </>
  );
};
