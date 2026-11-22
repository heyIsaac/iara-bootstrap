'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, CreditCard, QrCode, Barcode } from '@phosphor-icons/react';
import { formatCurrency, formatDateTime } from '@/shared/lib/formatters';
import { Card, Badge, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { Order } from '../../model/types';

export interface OrderCardProps {
  order: Order;
}

const getPaymentMethodDetails = (method: string = 'card') => {
  switch (method) {
    case 'pix':
      return { label: 'PIX', icon: <QrCode size={16} weight="fill" /> };
    case 'boleto':
      return { label: 'Boleto Bancário', icon: <Barcode size={16} weight="fill" /> };
    default:
      return { label: 'Cartão de Crédito', icon: <CreditCard size={16} weight="fill" /> };
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const payment = getPaymentMethodDetails(order.paymentMethod);
  const displayId = order.id.includes('-') ? order.id.split('-')[1] : order.id;
  const isPaid = order.paymentMethod === 'card' || !!order.pixPaid || !!order.boletoPaid;

  return (
    <Card className="overflow-hidden border border-white/5 bg-card/90 transition-all hover:border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="font-bold text-foreground">Pedido #{displayId}</span>
          {isPaid ? (
            <Badge variant="neon" className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Concluído
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="flex items-center gap-1.5 border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
            >
              <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
              Aguardando Pagamento
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar size={16} weight="fill" />
          <span>{formatDateTime(order.date)}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Jogos ({order.items.length})
        </h4>

        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div
              key={`${order.id}-${item.id}-${index}`}
              className="flex items-center justify-between rounded-lg bg-black/20 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">#{index + 1}</span>
                <span className="font-medium text-foreground">{item.name}</span>
              </div>
              <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            {payment.icon}
            <span>{payment.label}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {!isPaid && (
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/5 pt-3">
            {order.paymentMethod === 'pix' && (
              <Link href={ROUTES.paymentPix}>
                <Button size="sm" className="font-bold">
                  Pagar com PIX
                </Button>
              </Link>
            )}
            {order.paymentMethod === 'boleto' && (
              <Link href={ROUTES.paymentBoleto}>
                <Button size="sm" variant="outline" className="font-bold">
                  Visualizar Boleto
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
