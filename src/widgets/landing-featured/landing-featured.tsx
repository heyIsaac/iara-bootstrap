'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import styles from './landing-featured.module.css';

const BRAZILIAN_INDIES = [
  {
    name: 'Dandara: Trials of Fear',
    cover: '/assets/games-cover/dandara-cover.webp',
    genre: 'Metroidvania',
  },
  {
    name: 'Horizon Chase Turbo',
    cover: '/assets/games-cover/horizonchaseturbo-cover.jpg',
    genre: 'Corrida Arcade',
  },
  {
    name: 'Unsighted',
    cover: '/assets/games-cover/unsighted-cover.avif',
    genre: 'Action RPG',
  },
  {
    name: 'Chroma Squad',
    cover: '/assets/games-cover/chromasquad-cover.webp',
    genre: 'RPG Tático',
  },
  {
    name: 'Blazing Chrome',
    cover: '/assets/games-cover/blazingchrome-cover.jpg',
    genre: 'Run and Gun',
  },
  {
    name: 'Árida: Backland\'s Awakening',
    cover: '/assets/games-cover/arida-cover.webp',
    genre: 'Sobrevivência',
  },
  {
    name: 'Momodora: Reverie Under the Moonlight',
    cover: '/assets/games-cover/momodora-cover.jpg',
    genre: 'Metroidvania',
  },
  {
    name: '99Vidas',
    cover: '/assets/games-cover/99vidas-cover.png',
    genre: 'Beat em up',
  },
];

export const LandingFeatured: React.FC = () => {
  return (
    <section className={styles.featuredSection}>
      <Container>
        {/* Promotional CTA Box */}
        <div className={styles.promoContainer}>
          <div>
            <h2 className={styles.promoTitle}>
              Descubra seu próximo jogo favorito
            </h2>
            <p className={styles.promoText}>
              Acesso a centenas de jogos com entrega digital imediata, suporte a
              PIX, Boleto e Cartão de Crédito.
            </p>
            <Link href={ROUTES.catalog}>
              <Button size="lg">Experimentar Agora</Button>
            </Link>
          </div>

          <div className={styles.promoImages}>
            <div className={styles.promoImageCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img1.png" alt="Destaque 1" />
            </div>
            <div className={styles.promoImageCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img2.png" alt="Destaque 2" />
            </div>
            <div className={styles.promoImageCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img3.png" alt="Destaque 3" />
            </div>
          </div>
        </div>

        {/* Brazilian Indies Showcase */}
        <div className={styles.indiesHeader}>
          <h2 className={styles.indiesTitle}>Indies Brasileiros em Destaque</h2>
          <p className={styles.indiesSubtitle}>
            Valorizando e impulsionando os melhores desenvolvedores do Brasil
          </p>
        </div>

        <div className={styles.indiesGrid}>
          {BRAZILIAN_INDIES.map((indie) => (
            <div key={indie.name} className={styles.indieCard}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={indie.cover}
                alt={indie.name}
                className={styles.indieCover}
                loading="lazy"
              />
              <div className={styles.indieBody}>
                <span className={styles.indieBadge}>{indie.genre}</span>
                <h3 className={styles.indieName}>{indie.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.centerCta}>
          <Link href={ROUTES.catalog}>
            <Button size="lg" variant="outline">
              Ver Todos os Jogos no Catálogo →
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};
