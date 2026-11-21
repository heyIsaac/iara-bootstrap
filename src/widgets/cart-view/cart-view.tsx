'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, GameController, Trash } from '@phosphor-icons/react';
import { Container, Button, Spinner } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { formatCurrency } from '@/shared/lib/formatters';
import { useCart, useCartSounds } from '@/entities/cart';
import { useAuth } from '@/entities/user';
import styles from './cart-view.module.css';

export const CartView: React.FC = () => {
  const { items, loading, removeItem, clearCart, subtotal, total } = useCart();
  const { playRemove } = useCartSounds();
  const { isAuthenticated } = useAuth();

  if (loading) {
    return <Spinner label="Carregando carrinho..." />;
  }

  if (items.length === 0) {
    return (
      <div className={styles.cartPage}>
        <Container>
          <div className={styles.emptyCart}>
            <div className={styles.emptyCartIcon}>
              <ShoppingCart size={100} weight="fill" />
            </div>
            <h2>Seu carrinho está vazio</h2>
            <p>Adicione jogos incríveis do catálogo para continuar!</p>
            <Link href={ROUTES.catalog}>
              <Button size="lg">Explorar Catálogo</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const handleRemove = (id: number) => {
    removeItem(id);
    playRemove();
  };

  return (
    <div className={styles.cartPage}>
      <Container>
        <div className={styles.cartHeader}>
          <h1>Carrinho de Compras</h1>
          <button onClick={clearCart} className={styles.clearCartBtn}>
            Limpar Carrinho
          </button>
        </div>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItemImage}>
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <GameController size={32} weight="fill" />
                    </div>
                  )}
                </div>

                <div className={styles.cartItemInfo}>
                  <h3 className={styles.cartItemName}>{item.name}</h3>
                  <p className={styles.cartItemPrice}>
                    {formatCurrency(item.price)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className={styles.removeItemBtn}
                  aria-label={`Remover ${item.name} do carrinho`}
                >
                  <Trash size={20} weight="bold" />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h2>Resumo do Pedido</h2>

            <div className={styles.summaryRow}>
              <span>
                Subtotal ({items.length} {items.length === 1 ? 'jogo' : 'jogos'}):
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Desconto:</span>
              <span className={styles.discount}>R$ 0,00</span>
            </div>

            <div className={styles.summaryDivider} />

            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <div className={styles.checkoutLink}>
              {isAuthenticated ? (
                <Link href={ROUTES.checkout}>
                  <Button size="lg" fullWidth>
                    Finalizar Compra
                  </Button>
                </Link>
              ) : (
                <Link href={`${ROUTES.login}?redirect=checkout`}>
                  <Button size="lg" fullWidth>
                    Fazer Login para Comprar
                  </Button>
                </Link>
              )}
            </div>

            <Link href={ROUTES.catalog} className={styles.continueShopping}>
              ← Continuar Comprando
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};
