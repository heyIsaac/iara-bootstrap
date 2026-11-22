'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Star,
  BookmarkSimple,
  Check,
  ShoppingCart,
} from '@phosphor-icons/react';
import { ROUTES } from '@/shared/config';
import { Container } from '@/shared/ui';
import { useCart } from '@/entities/cart';

interface IndieGame {
  id: string;
  name: string;
  price: number;
  cover: string;
  genre: string;
}

const INDIE_GAMES: IndieGame[] = [
  {
    id: 'gurbs-adventure',
    name: "Gurb's Adventure",
    price: 55.0,
    cover: "/assets/Capas indies/Gurb's.png",
    genre: 'Indie • Aventura',
  },
  {
    id: 'pacific-drive',
    name: 'Pacific Drive',
    price: 68.5,
    cover: '/assets/Capas indies/Pacific Drive.png',
    genre: 'Indie • Sobrevivência',
  },
  {
    id: 'below',
    name: 'Below',
    price: 96.0,
    cover: '/assets/Capas indies/below (1).png',
    genre: 'Indie • Roguelike',
  },
  {
    id: 'ekko-firefly',
    name: 'EKKO And The FireFly',
    price: 80.9,
    cover: '/assets/Capas indies/ekko.png',
    genre: 'Indie • Aventura',
  },
  {
    id: 'altos-adventure',
    name: "Alto's Adventure",
    price: 70.0,
    cover: '/assets/Capas indies/Altos.png',
    genre: 'Indie • Plataforma',
  },
  {
    id: 'hard-boiled',
    name: 'Hard-Boiled',
    price: 97.0,
    cover: '/assets/Capas indies/Hard-boiled.png',
    genre: 'Indie • Ação',
  },
  {
    id: 'paleoarctic',
    name: 'Paleoarctic',
    price: 85.0,
    cover: '/assets/Capas indies/paleoartic.png',
    genre: 'Indie • Exploração',
  },
  {
    id: 'paul-skenes',
    name: 'Paul Skenes',
    price: 65.0,
    cover: '/assets/Capas indies/paul skenes.png',
    genre: 'Indie • Esportes',
  },
  {
    id: 'hotline-miami',
    name: 'Hotline Miami',
    price: 75.0,
    cover: '/assets/Capas indies/hotline.png',
    genre: 'Indie • Ação',
  },
  {
    id: 'nim',
    name: 'Nim',
    price: 49.9,
    cover: '/assets/Capas indies/nim.png',
    genre: 'Indie • Puzzle',
  },
  {
    id: 'ori',
    name: 'Ori and the Blind Forest',
    price: 89.9,
    cover: '/assets/Capas indies/ori (1).png',
    genre: 'Indie • Fantasia',
  },
  {
    id: 'the-rambling',
    name: 'The Rambling',
    price: 59.9,
    cover: '/assets/Capas indies/rambling (1).png',
    genre: 'Indie • Atmosférico',
  },
  {
    id: 'yaga',
    name: 'Yaga',
    price: 69.9,
    cover: '/assets/Capas indies/yaga.png',
    genre: 'Indie • RPG',
  },
  {
    id: 'woods',
    name: 'Woods',
    price: 54.9,
    cover: '/assets/Capas indies/woods (1).png',
    genre: 'Indie • Terror',
  },
  {
    id: 'pans',
    name: 'Pans',
    price: 62.0,
    cover: '/assets/Capas indies/pans.png',
    genre: 'Indie • Aventura',
  },
];

export const LandingFeatured: React.FC = () => {
  const { addItem } = useCart();
  const [promoOption, setPromoOption] = useState<'buy' | 'subscription'>('buy');
  const [promoAdded, setPromoAdded] = useState(false);
  const [addedGameId, setAddedGameId] = useState<string | null>(null);

  const handleAddPromoGame = () => {
    addItem({
      id: 9999,
      name: "Assassin's Creed Origins",
      price: promoOption === 'buy' ? 69.98 : 0,
      image: '/assets/game-promotion-image.png',
    });
    setPromoAdded(true);
    setTimeout(() => setPromoAdded(false), 2500);
  };

  const handleAddIndieGame = (game: IndieGame) => {
    addItem({
      id: Math.abs(game.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000)),
      name: game.name,
      price: game.price,
      image: game.cover,
    });
    setAddedGameId(game.id);
    setTimeout(() => setAddedGameId(null), 2000);
  };

  return (
    <div className="space-y-24 py-16 md:space-y-36">
      {/* 1. Call to Action: Descubra seu próximo jogo favorito */}
      <section className="relative overflow-visible py-6 sm:py-10" aria-labelledby="cta-title">
        <Container size="xl">
          <div className="relative rounded-[36px] border-[8px] border-[#1d1d1d]/40 bg-black/95 p-8 shadow-2xl sm:rounded-[45px] sm:border-[10px] sm:p-14 lg:p-16 min-h-[520px] sm:min-h-[580px] lg:min-h-[620px] flex items-center">
            {/* Decorative Background Graphics (Leaking / Bleeding outside at the corners) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/group1.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 -top-8 sm:-left-12 sm:-top-12 lg:-left-16 lg:-top-16 h-auto w-36 sm:w-52 lg:w-64 z-20 drop-shadow-[0_0_15px_rgba(204,254,44,0.2)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/group2.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 sm:-right-12 sm:-top-12 lg:-right-16 lg:-top-16 h-auto w-36 sm:w-52 lg:w-64 z-20 drop-shadow-[0_0_15px_rgba(204,254,44,0.2)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/group3.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-8 left-1/3 h-auto w-44 sm:w-64 opacity-50 z-10"
            />

            <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 w-full">
              {/* Text / CTA Info */}
              <div className="text-center lg:text-left">
                <h2
                  id="cta-title"
                  className="text-3xl font-black leading-[1.15] text-[#CCFE2C] sm:text-5xl lg:text-6xl max-w-lg lg:max-w-xl"
                >
                  Descubra seu próximo jogo favorito
                </h2>

                <p className="mt-4 text-sm font-medium text-gray-300 sm:text-base lg:text-lg max-w-md">
                  Jogue centenas de jogos por um pequeno preço mensal!
                </p>

                <div className="mt-8 flex justify-center lg:justify-start">
                  <Link href={ROUTES.catalog}>
                    <button className="inline-flex items-center gap-2.5 rounded-full bg-[#CCFE2C] px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[0_0_25px_rgba(204,254,44,0.4)] transition-all hover:bg-[#b8eb23] hover:scale-105 active:scale-95">
                      <span>Experimentar agora</span>
                      <ArrowRight size={18} weight="bold" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Promo Images Row (3 Character Posters) */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-5">
                <figure className="relative h-64 sm:h-80 md:h-[380px] lg:h-[460px] w-32 sm:w-44 md:w-52 lg:w-60 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img1.png"
                    alt="Destaque 1"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </figure>

                <figure className="relative -mt-4 sm:-mt-6 h-72 sm:h-92 md:h-[420px] lg:h-[500px] w-36 sm:w-48 md:w-56 lg:w-64 overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-primary/50 shadow-[0_0_35px_rgba(204,254,44,0.25)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img2.png"
                    alt="Destaque 2"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </figure>

                <figure className="relative h-64 sm:h-80 md:h-[380px] lg:h-[460px] w-32 sm:w-44 md:w-52 lg:w-60 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl">
                  {/* Green Glow behind skate card */}
                  <div className="absolute inset-0 bg-primary/20 blur-xl pointer-events-none" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/img3.png"
                    alt="Destaque 3"
                    className="relative z-10 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </figure>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Jogo do mês em promoção (Assassin's Creed Origins) */}
      <section className="relative" aria-labelledby="promo-title">
        <Container>
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2
              id="promo-title"
              className="text-3xl font-black tracking-wide text-white sm:text-5xl"
            >
              Jogo do mês em promoção
            </h2>
            <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-[#2C7AFE] sm:w-36" />
          </div>

          {/* Promo Split Card */}
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#232323]/40 shadow-2xl backdrop-blur-md sm:rounded-[36px]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column: Infos & Buying Options */}
              <div className="flex flex-col justify-between p-6 sm:p-10 md:p-12">
                <div>
                  <h3 className="text-2xl font-black uppercase text-white sm:text-3xl">
                    Assassins Creed Origins
                  </h3>

                  {/* Platforms */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['PS4', 'PS5', 'XBOX SERIES S', 'XBOX SERIES X', 'NINTENDO SWITCH'].map(
                      (console) => (
                        <span
                          key={console}
                          className="rounded-md bg-black px-2.5 py-1 text-[11px] font-bold text-white/90"
                        >
                          {console}
                        </span>
                      )
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mt-5 flex items-center gap-3 text-sm">
                    <span className="text-lg font-black text-white">6,0</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={16} weight="fill" />
                      <Star size={16} weight="fill" />
                      <Star size={16} weight="fill" />
                      <Star size={16} weight="fill" />
                      <Star size={16} weight="regular" className="text-white/30" />
                    </div>
                    <span className="text-xs text-muted-foreground">20 mil classificações</span>
                  </div>

                  {/* Buying Options Radio */}
                  <div className="mt-6 space-y-3">
                    {/* Option 1: Discount Buy */}
                    <label
                      onClick={() => setPromoOption('buy')}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                        promoOption === 'buy'
                          ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(204,254,44,0.15)]'
                          : 'border-white/5 bg-black/40 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="promo-option"
                          checked={promoOption === 'buy'}
                          onChange={() => setPromoOption('buy')}
                          className="h-4 w-4 accent-primary"
                        />
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-primary">R$ 69,98</span>
                            <span className="text-xs text-muted-foreground line-through">
                              R$ 349,90
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-400">
                            Economize 80%
                          </span>
                        </div>
                      </div>
                      <span className="text-right text-[10px] text-muted-foreground">
                        Oferta por tempo limitado
                      </span>
                    </label>

                    {/* Option 2: Subscription IG Play */}
                    <label
                      onClick={() => setPromoOption('subscription')}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                        promoOption === 'subscription'
                          ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(204,254,44,0.15)]'
                          : 'border-white/5 bg-black/40 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="promo-option"
                          checked={promoOption === 'subscription'}
                          onChange={() => setPromoOption('subscription')}
                          className="h-4 w-4 accent-primary"
                        />
                        <div>
                          <span className="text-sm font-bold text-white">Grátis via IG Play</span>
                          <p className="text-[11px] text-muted-foreground">
                            Assine a <strong className="text-primary font-bold">IG</strong> Play
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                        IG PLAY
                      </span>
                    </label>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-8">
                  <button
                    onClick={handleAddPromoGame}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#CCFE2C] px-8 py-3.5 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_20px_rgba(204,254,44,0.35)] transition-all hover:bg-[#b8eb23] hover:scale-105 active:scale-95 sm:text-sm"
                  >
                    {promoAdded ? (
                      <>
                        <Check size={18} weight="bold" />
                        <span>Adicionado ao Carrinho!</span>
                      </>
                    ) : (
                      <>
                        <span>Adicionar Agora</span>
                        <ArrowRight size={18} weight="bold" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Graphic with Best Seller Badge */}
              <div className="relative min-h-[300px] sm:min-h-[400px] w-full overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/game-promotion-image.png"
                  alt="Assassins Creed Origins"
                  className="h-full w-full object-cover"
                />

                {/* Best Seller Badge */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/bestie-seller.png"
                  alt="Best Seller"
                  className="absolute bottom-4 right-4 h-14 sm:h-20 w-auto drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Jogos Indie em lançamento (Grid 4 colunas com capas oficiais) */}
      <section className="relative" aria-labelledby="indies-title">
        <Container>
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2
              id="indies-title"
              className="text-3xl font-black tracking-wide text-white sm:text-5xl"
            >
              Jogos Indie{' '}
              <span className="bg-gradient-to-r from-primary to-[#e8ffb1] bg-clip-text text-transparent">
                em lançamento
              </span>
            </h2>
            <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-[#2C7AFE] sm:w-36" />
          </div>

          {/* Grid de 15 Jogos Indie (Figma 4 colunas) */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
            {INDIE_GAMES.map((game) => (
              <div
                key={game.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#161a23]/90 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_10px_25px_rgba(204,254,44,0.15)]"
              >
                {/* Wishlist / Bookmark Icon */}
                <button
                  type="button"
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/70 backdrop-blur-md transition-all hover:bg-black/90 hover:text-primary"
                  aria-label="Salvar nos favoritos"
                >
                  <BookmarkSimple size={16} weight="bold" />
                </button>

                {/* Cover Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={game.cover}
                    alt={game.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Game Info */}
                <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
                  <div>
                    <h4 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover:text-primary sm:text-base">
                      {game.name}
                    </h4>
                    <span className="mt-1 block text-[11px] font-medium text-muted-foreground">
                      {game.genre}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-sm font-black text-primary sm:text-base">
                      R$ {game.price.toFixed(2).replace('.', ',')}
                    </span>

                    <button
                      onClick={() => handleAddIndieGame(game)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary hover:text-black"
                      title="Adicionar ao Carrinho"
                      aria-label={`Comprar ${game.name}`}
                    >
                      {addedGameId === game.id ? (
                        <Check size={16} weight="bold" />
                      ) : (
                        <ShoppingCart size={16} weight="bold" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Button "Ver Todos os Jogos" */}
          <div className="mt-12 text-center">
            <Link href={ROUTES.catalog}>
              <button className="inline-flex items-center gap-2.5 rounded-full bg-[#CCFE2C] px-10 py-4 text-xs font-black uppercase tracking-wider text-black shadow-[0_0_20px_rgba(204,254,44,0.35)] transition-all hover:bg-[#b8eb23] hover:scale-105 active:scale-95 sm:text-sm">
                <span>Ver todos os jogos</span>
                <ArrowRight size={18} weight="bold" />
              </button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};
