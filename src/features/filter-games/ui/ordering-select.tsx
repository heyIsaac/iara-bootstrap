'use client';

import React from 'react';
import styles from './ordering-select.module.css';

export interface OrderingSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const OrderingSelect: React.FC<OrderingSelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`${styles.group} ${className}`.trim()}>
      <label htmlFor="ordering-select" className={styles.label}>
        Ordenar por:
      </label>
      <select
        id="ordering-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.select}
      >
        <option value="-rating">Melhor Avaliação</option>
        <option value="-released">Mais Recentes</option>
        <option value="name">Nome (A-Z)</option>
        <option value="-name">Nome (Z-A)</option>
        <option value="-added">Mais Populares</option>
      </select>
    </div>
  );
};
