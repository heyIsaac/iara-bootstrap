'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/shared/config';
import styles from './footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.paddingGlobal}>
        <div className={styles.container}>
          <div className={styles.content}>
            <Link href={ROUTES.home}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/brand/iara_games-logo-horizontal-black.svg"
                alt="Logotipo da Iara Games"
                className={styles.logo}
              />
            </Link>

            <nav className={styles.links} aria-label="Links do rodapé">
              <Link href={ROUTES.home} className={styles.link}>
                Início
              </Link>
              <Link href={ROUTES.catalog} className={styles.link}>
                Game Store
              </Link>
              <Link href={ROUTES.cart} className={styles.link}>
                Carrinho
              </Link>
              <Link href={ROUTES.login} className={styles.link}>
                Login
              </Link>
              <Link href={ROUTES.register} className={styles.link}>
                Cadastrar
              </Link>
            </nav>

            <p className={styles.tagline}>
              Feito com ❤️ para a cultura brasileira
            </p>

            <div className={styles.divider} aria-hidden="true" />

            <div className={styles.bottom}>
              <p>© 2025 IARA GAMES™ // Todos os direitos reservados</p>
              <p>E-commerce de Jogos Digitais com Arquitetura FSD e Next.js</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
