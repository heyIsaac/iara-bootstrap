'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/shared/config';
import { Container } from '@/shared/ui';

export const Footer: React.FC = () => {
  return (
    <footer
      className="relative mt-28 rounded-t-[40px] bg-[#CCFE2C] pb-8 pt-16 text-black sm:rounded-t-[48px]"
      role="contentinfo"
    >
      <Container>
        {/* Central Card with Corner Brackets (as in Figma) */}
        <div className="relative mx-auto flex max-w-2xl flex-col items-center p-8 text-center sm:p-12">
          {/* 4 Corner Brackets */}
          <div
            className="pointer-events-none absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-black sm:h-10 sm:w-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-black sm:h-10 sm:w-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-black sm:h-10 sm:w-10"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-black sm:h-10 sm:w-10"
            aria-hidden="true"
          />

          {/* Logo Horizontal Black */}
          <div className="mb-4">
            <Link href={ROUTES.home}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/brand/iara_games-logo-horizontal-black.svg"
                alt="Iara Games"
                className="h-12 sm:h-16 w-auto"
              />
            </Link>
          </div>

          {/* Nav links */}
          <nav className="mb-3 flex flex-wrap justify-center gap-6 text-sm font-bold text-black" aria-label="Links do rodapé">
            <Link href={ROUTES.catalog} className="transition-opacity hover:opacity-75">
              Game Store
            </Link>
            <Link href={ROUTES.home} className="transition-opacity hover:opacity-75">
              Home
            </Link>
            <Link href={ROUTES.cart} className="transition-opacity hover:opacity-75">
              Carrinho
            </Link>
          </nav>

          {/* Tagline */}
          <p className="text-xs font-semibold text-black/80">
            Feito com ❤️ para a cultura brasileira
          </p>
        </div>

        {/* Dotted Divider Line */}
        <div className="my-8 mx-auto w-full max-w-4xl border-t-2 border-dotted border-black/30" aria-hidden="true" />

        {/* Footer Bottom Info */}
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 px-4 text-xs font-medium text-black/80 sm:flex-row">
          <p>©2025 IARA GAMES™ // Todos direitos reservados</p>
          <p>Website by FIAP.</p>
        </div>
      </Container>
    </footer>
  );
};
