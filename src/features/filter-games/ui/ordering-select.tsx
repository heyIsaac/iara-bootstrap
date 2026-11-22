'use client';

import React from 'react';
import { cn } from '@/shared/lib/cn';

export interface OrderingSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const OrderingSelect: React.FC<OrderingSelectProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label htmlFor="ordering-select" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        Ordenar por:
      </label>
      <select
        id="ordering-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-lg border border-input bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
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
