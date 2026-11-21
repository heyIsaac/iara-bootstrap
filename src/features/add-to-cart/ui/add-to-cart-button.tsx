'use client';

import React from 'react';
import { Button } from '@/shared/ui';
import { CartItem, useCart, useCartSounds } from '@/entities/cart';

export interface AddToCartButtonProps {
  item: CartItem;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onToggled?: (added: boolean) => void;
  className?: string;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  item,
  size = 'sm',
  fullWidth = false,
  onToggled,
  className = '',
}) => {
  const { isInCart, toggleItem } = useCart();
  const { playSuccess, playRemove } = useCartSounds();
  const inCart = isInCart(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleItem(item);
    if (added) {
      playSuccess();
    } else {
      playRemove();
    }
    onToggled?.(added);
  };

  return (
    <Button
      size={size}
      variant={inCart ? 'danger' : 'primary'}
      fullWidth={fullWidth}
      onClick={handleClick}
      className={className}
    >
      {inCart ? 'Remover do Carrinho' : 'Adicionar ao Carrinho'}
    </Button>
  );
};
