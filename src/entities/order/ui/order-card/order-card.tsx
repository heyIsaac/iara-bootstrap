'use client';

import React from 'react';
import { Calendar, CreditCard, QrCode, Barcode } from '@phosphor-icons/react';
import { formatCurrency, formatDateTime } from '@/shared/lib/formatters';
import { Order } from '../../model/types';
import styles from './order-card.module.css';

export interface OrderCardProps {
  order: Order;
}

const getPaymentMethodDetails = (method: string = 'card') => {
  switch (method) {
    case 'pix':
      return { label: 'PIX', icon: <QrCode size={18} weight="fill" /> };
    case 'boleto':
      return { label: 'Boleto Bancário', icon: <Barcode size={18} weight="fill" /> };
    default:
      return { label: 'Cartão de Crédito', icon: <CreditCard size={18} weight="fill" /> };
  }
};

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const payment = getPaymentMethodDetails(order.paymentMethod);
  const displayId = order.id.includes('-') ? order.id.split('-')[1] : order.id;

  return (
    <div className={styles.orderCard}>
      <div className={styles.header}>
        <div className={styles.infoTop}>
          <span className={styles.orderId}>Pedido #{displayId}</span>
          <span className={styles.status}>
            <span className={styles.statusDot} />
            Concluído
          </span>
        </div>
        <div className={styles.dateInfo}>
          <Calendar size={16} weight="fill" />
          <span>{formatDateTime(order.date)}</span>
        </div>
      </div>

      <div className={styles.body}>
        <h4 className={styles.itemsSummaryTitle}>
          Jogos ({order.items.length})
        </h4>

        <div className={styles.itemsList}>
          {order.items.map((item, index) => (
            <div key={`${order.id}-${item.id}-${index}`} className={styles.orderItemMini}>
              <span className={styles.itemNumber}>#{index + 1}</span>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemPrice}>{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.paymentMethodBadge}>
            {payment.icon}
            <span>{payment.label}</span>
          </div>

          <div className={styles.totalInfo}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalValue}>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
