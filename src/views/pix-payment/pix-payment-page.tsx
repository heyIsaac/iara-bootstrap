'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, CheckCircle } from '@phosphor-icons/react';
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
import { generatePix, GeneratedPix } from '@/entities/payment';
import styles from './pix-payment-page.module.css';

export const PixPaymentPage: React.FC = () => {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [pixData, setPixData] = useState<GeneratedPix | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pending = getPendingOrder();
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
    <>
      <Header />
      <main className={styles.pixPage}>
        <RouteGuard>
          <Container maxWidth="md">
            {loading || !order || !pixData ? (
              <Spinner label="Gerando QR Code PIX..." />
            ) : (
              <>
                <div className={styles.pixHeader}>
                  <div className={styles.pixIcon}>
                    <QrCode size={48} weight="fill" />
                  </div>
                  <h1>Pagamento via PIX</h1>
                  <p>Escaneie o QR Code ou copie o código para pagar</p>
                </div>

                <div className={styles.pixCard}>
                  <div className={styles.pixInfo}>
                    <div className={styles.pixRow}>
                      <span className={styles.pixLabel}>Beneficiário:</span>
                      <span className={styles.pixValue}>Iara Games LTDA</span>
                    </div>
                    <div className={styles.pixRow}>
                      <span className={styles.pixLabel}>Chave PIX:</span>
                      <span className={styles.pixValue}>{pixData.pixKey}</span>
                    </div>
                    <div className={styles.pixRow}>
                      <span className={styles.pixLabel}>Valor Total:</span>
                      <span className={`${styles.pixValue} ${styles.pixValueHighlight}`}>
                        R$ {pixData.value}
                      </span>
                    </div>
                    <div className={styles.pixRow}>
                      <span className={styles.pixLabel}>Validade:</span>
                      <span className={styles.pixValue}>{pixData.expiresIn} minutos</span>
                    </div>
                  </div>

                  <div className={styles.pixDivider} />

                  <div className={styles.qrcodeSection}>
                    <label>QR Code PIX</label>
                    <div className={styles.qrcodeContainer}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={pixData.qrCode}
                        alt="QR Code PIX"
                        className={styles.qrcode}
                      />
                    </div>
                  </div>

                  <div className={styles.payloadSection}>
                    <label>Código PIX (Copia e Cola)</label>
                    <div className={styles.payloadContainer}>
                      <code className={styles.payloadCode}>{pixData.payload}</code>
                      <CopyButton textToCopy={pixData.payload} label="Copiar Código" />
                    </div>
                  </div>
                </div>

                <div className={styles.confirmSection}>
                  <div className={styles.confirmIcon}>
                    <CheckCircle size={48} weight="fill" />
                  </div>
                  <h2>Já realizou o pagamento?</h2>
                  <p>Confirme para liberar seus jogos na sua biblioteca</p>
                  <Button size="lg" onClick={handlePaymentConfirmed}>
                    <CheckCircle size={22} weight="fill" /> Já Paguei
                  </Button>
                </div>

                <div className={styles.pixHelp}>
                  <h3>Como pagar com PIX:</h3>
                  <ol>
                    <li>Abra o app do seu banco no smartphone</li>
                    <li>Escolha a opção &quot;Pagar com PIX&quot;</li>
                    <li>Aponte a câmera para o QR Code ou cole o código acima</li>
                    <li>Confira os dados e confirme o pagamento</li>
                    <li>Retorne aqui e clique em &quot;Já Paguei&quot;</li>
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
