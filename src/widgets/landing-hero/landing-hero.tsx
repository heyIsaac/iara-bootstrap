'use client';

import React from 'react';
import Link from 'next/link';
import { SpeakerHigh } from '@phosphor-icons/react';
import { Button } from '@/shared/ui';
import { ROUTES } from '@/shared/config';
import { playSound } from '@/shared/lib/sound';
import styles from './landing-hero.module.css';

export const LandingHero: React.FC = () => {
  const handlePlayCharacterSound = (name: 'luigi' | 'sonic' | 'mario') => {
    playSound(`/sounds/${name}.mp3`, 0.7);
  };

  return (
    <header className={styles.heroSection} role="banner">
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.videoBg}
        poster="/assets/background-hero.webp"
      >
        <source src="/assets/iara-video-bg.mp4" type="video/mp4" />
      </video>

      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/brand/iara_games-typo.svg"
          alt="Logotipo da Iara Games"
          className={styles.heroTypo}
        />

        <h1 className={styles.heroTitle}>Sua melhor escolha</h1>

        <p className={styles.heroSubtitle}>
          A ÚNICA plataforma com títulos nacionais e internacionais em um preço
          acessível para todos os jogadores brasileiros.
        </p>

        <div className={styles.heroCta}>
          <Link href={ROUTES.catalog}>
            <Button size="lg">Explorar Catálogo</Button>
          </Link>
          <Link href={ROUTES.register}>
            <Button size="lg" variant="outline">
              Criar Conta
            </Button>
          </Link>
        </div>

        {/* 3D Character Cards */}
        <div className={styles.cardsContainer}>
          <div
            className={`${styles.characterCard} ${styles.cardYellow}`}
            onClick={() => handlePlayCharacterSound('luigi')}
            title="Clique para ouvir o Luigi!"
            role="button"
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/Luigi .webp" alt="Luigi" />
            <div className={styles.soundBadge}>
              <SpeakerHigh size={14} weight="bold" />
              <span>Luigi</span>
            </div>
          </div>

          <div
            className={`${styles.characterCard} ${styles.cardGreen}`}
            onClick={() => handlePlayCharacterSound('sonic')}
            title="Clique para ouvir o Sonic!"
            role="button"
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/Sonic.webp" alt="Sonic" />
            <div className={styles.soundBadge}>
              <SpeakerHigh size={14} weight="bold" />
              <span>Sonic</span>
            </div>
          </div>

          <div
            className={`${styles.characterCard} ${styles.cardBlue}`}
            onClick={() => handlePlayCharacterSound('mario')}
            title="Clique para ouvir o Mario!"
            role="button"
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/Mario.webp" alt="Mario" />
            <div className={styles.soundBadge}>
              <SpeakerHigh size={14} weight="bold" />
              <span>Mario</span>
            </div>
          </div>
        </div>

        <p className={styles.soundHint}>
          💡 Clique nos personagens acima para ouvir seus efeitos sonoros!
        </p>
      </div>
    </header>
  );
};
