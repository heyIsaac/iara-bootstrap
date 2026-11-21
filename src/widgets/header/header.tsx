'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  ShoppingCart,
  List,
  X,
  Package,
  GameController,
} from '@phosphor-icons/react';
import { useAuth } from '@/entities/user';
import { useCart } from '@/entities/cart';
import { ROUTES } from '@/shared/config';
import styles from './header.module.css';

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    router.push(ROUTES.login);
  };

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={styles.navBar} role="navigation" aria-label="Navegação principal">
      <div className={styles.paddingGlobal}>
        <div className={styles.navContainer}>
          <div className={styles.navWrapper}>
            {/* Logo */}
            <div className={styles.navLogoWrapper}>
              <Link href={ROUTES.home} aria-label="Página inicial da Iara Games">
                <svg
                  className={styles.navBrandLogo}
                  viewBox="0 0 132 132"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  aria-label="Iara Games"
                >
                  <path
                    d="M102.11 0H29.89C13.3822 0 0 13.3822 0 29.89V102.11C0 118.618 13.3822 132 29.89 132H102.11C118.618 132 132 118.618 132 102.11V29.89C132 13.3822 118.618 0 102.11 0Z"
                    fill="#CCFE2D"
                  />
                  <path
                    d="M80.83 47.6299L75.73 93.1199C75.64 93.9299 76.35 94.5999 77.15 94.4599L89.15 92.4299C90.18 92.2599 90.95 93.3799 90.4 94.2699L82 108.16C81.85 108.4 81.63 108.58 81.36 108.68L59.91 116.35C59.51 116.49 59.06 116.42 58.73 116.15L52.97 111.55C52.78 111.4 52.65 111.2 52.57 110.98L52.55 110.91C52.5 110.74 52.48 110.57 52.5 110.4L57.14 66.7799C57.23 65.9499 56.48 65.2799 55.67 65.4499L43 68.1299C41.95 68.3499 41.14 67.2099 41.7 66.2899L47.99 56.0799C48.15 55.8299 48.39 55.6399 48.68 55.5499L79.25 46.3199C80.09 46.0699 80.92 46.7599 80.82 47.6299H80.83Z"
                    fill="black"
                  />
                  <path
                    d="M70.99 40.68L59.59 43.73C59.16 43.84 58.71 43.73 58.4 43.41L50.18 35.05C49.83 34.69 49.73 34.15 49.94 33.69L53.41 26C53.56 25.66 53.85 25.42 54.21 25.32L71.4 20.72C71.6 20.67 71.82 20.66 72.02 20.72C72.25 20.78 72.46 20.9 72.62 21.08L76.69 25.54C77 25.88 77.1 26.38 76.93 26.81L71.83 39.96C71.69 40.32 71.38 40.6 71 40.7L70.99 40.68Z"
                    fill="black"
                  />
                </svg>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className={styles.navRightSection}>
              <div className={styles.navUtilityWrapper}>
                <Link href={ROUTES.catalog} className={styles.navLink}>
                  Game Store
                </Link>
                {isAuthenticated && (
                  <Link href={ROUTES.orders} className={styles.navLink}>
                    Meus Pedidos
                  </Link>
                )}
                <button
                  className={styles.navUtilityLink}
                  aria-label="Notificações"
                  onClick={(e) => e.preventDefault()}
                >
                  <Bell size={24} weight="fill" />
                </button>
                <Link
                  href={ROUTES.cart}
                  className={`${styles.navUtilityLink} ${styles.cartLink}`}
                  aria-label={`Carrinho com ${totalItems} itens`}
                >
                  <ShoppingCart size={24} weight="fill" />
                  {totalItems > 0 && (
                    <span className={styles.cartCounter}>{totalItems}</span>
                  )}
                </Link>
              </div>

              {isAuthenticated ? (
                <div className={styles.navUserSection}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.userProfilePhoto}
                    src="/foto-perfil.webp"
                    alt="Foto de perfil"
                  />
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    Sair
                  </button>
                </div>
              ) : (
                <div className={styles.navAuthButtons}>
                  <Link href={ROUTES.login} className={styles.navAuthBtn}>
                    Login
                  </Link>
                  <Link
                    href={ROUTES.register}
                    className={`${styles.navAuthBtn} ${styles.navAuthBtnPrimary}`}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>

            {/* Hamburger Button */}
            <button
              className={styles.hamburgerBtn}
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={32} /> : <List size={32} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={closeMenu}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            {isAuthenticated && (
              <div className={styles.mobileMenuUser}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.mobileUserPhoto}
                  src="/foto-perfil.webp"
                  alt="Foto de perfil"
                />
                <span className={styles.mobileUserEmail}>Bem-vindo!</span>
              </div>
            )}

            <div className={styles.mobileMenuItems}>
              <Link
                href={ROUTES.catalog}
                className={styles.mobileMenuItem}
                onClick={closeMenu}
              >
                <GameController size={24} weight="fill" />
                <span>Catálogo de Jogos</span>
              </Link>

              <Link
                href={ROUTES.cart}
                className={styles.mobileMenuItem}
                onClick={closeMenu}
              >
                <ShoppingCart size={24} weight="fill" />
                <span>Carrinho</span>
                {totalItems > 0 && (
                  <span className={styles.mobileCartBadge}>{totalItems}</span>
                )}
              </Link>

              {isAuthenticated && (
                <Link
                  href={ROUTES.orders}
                  className={styles.mobileMenuItem}
                  onClick={closeMenu}
                >
                  <Package size={24} weight="fill" />
                  <span>Meus Pedidos</span>
                </Link>
              )}
            </div>

            <div className={styles.mobileMenuFooter}>
              {isAuthenticated ? (
                <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                  Sair da Conta
                </button>
              ) : (
                <>
                  <Link
                    href={ROUTES.login}
                    className={styles.mobileAuthBtn}
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href={ROUTES.register}
                    className={`${styles.mobileAuthBtn} ${styles.mobileAuthBtnPrimary}`}
                    onClick={closeMenu}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
