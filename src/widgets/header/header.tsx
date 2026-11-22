'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  House,
  GameController,
  Bell,
  ShoppingCart,
  List,
  X,
  Package,
} from '@phosphor-icons/react';
import { useAuth } from '@/entities/user';
import { useCart } from '@/entities/cart';
import { ROUTES } from '@/shared/config';
import { Badge } from '@/shared/ui';

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isHome = pathname === '/' || pathname === ROUTES.home;
  const isCatalog = pathname.startsWith('/catalog') || pathname.startsWith('/game');
  const isOrders = pathname.startsWith('/orders');

  useEffect(() => {
    setMounted(true);
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
    <nav
      className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#121212]/80 backdrop-blur-xl"
      role="navigation"
      aria-label="Navegação principal"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between">
          {/* Left Navigation: Home & Game Store */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href={ROUTES.home}
              className={`flex items-center gap-2 text-sm font-bold transition-all hover:text-primary hover:drop-shadow-[0_0_8px_rgba(204,254,44,0.4)] ${
                isHome ? 'text-primary drop-shadow-[0_0_8px_rgba(204,254,44,0.3)]' : 'text-muted-foreground'
              }`}
            >
              <House size={20} weight={isHome ? 'fill' : 'bold'} className={isHome ? 'text-primary' : 'text-muted-foreground'} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              href={ROUTES.catalog}
              className={`flex items-center gap-2 text-sm font-bold transition-all hover:text-primary hover:drop-shadow-[0_0_8px_rgba(204,254,44,0.4)] ${
                isCatalog ? 'text-primary drop-shadow-[0_0_8px_rgba(204,254,44,0.3)]' : 'text-muted-foreground'
              }`}
            >
              <GameController size={20} weight={isCatalog ? 'fill' : 'bold'} className={isCatalog ? 'text-primary' : 'text-muted-foreground'} />
              <span className="hidden sm:inline">Game Store</span>
            </Link>

            {mounted && isAuthenticated && (
              <Link
                href={ROUTES.orders}
                className={`hidden lg:flex items-center gap-2 text-sm font-bold transition-all hover:text-primary hover:drop-shadow-[0_0_8px_rgba(204,254,44,0.4)] ${
                  isOrders ? 'text-primary drop-shadow-[0_0_8px_rgba(204,254,44,0.3)]' : 'text-muted-foreground'
                }`}
              >
                <Package size={20} weight={isOrders ? 'fill' : 'bold'} className={isOrders ? 'text-primary' : 'text-muted-foreground'} />
                <span>Meus Pedidos</span>
              </Link>
            )}
          </div>

          {/* Center Brand Logo (Icon 'i' as in Figma) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href={ROUTES.home} aria-label="Página inicial da Iara Games" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/brand/iara_games-icon.svg"
                alt="Iara Games"
                className="h-11 w-11 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(204,254,44,0.6)]"
              />
            </Link>
          </div>

          {/* Right Navigation: Utilities & User */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
              aria-label="Notificações"
            >
              <Bell size={22} weight="bold" />
            </button>

            <Link
              href={ROUTES.cart}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
              aria-label={`Carrinho com ${totalItems} itens`}
            >
              <ShoppingCart size={22} weight="bold" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-black shadow-[0_0_10px_rgba(204,254,44,0.5)]">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Coin Balance Badge (as in Figma) */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-[#121212] px-3.5 py-1.5 shadow-[4px_4px_7px_rgba(0,0,0,0.26)] transition-all hover:border-primary/50 hover:shadow-[0_0_15px_rgba(204,254,44,0.2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/coin-badge.svg" alt="Coins" className="h-5 w-5" />
              <span className="text-xs font-bold text-primary">5000 IC</span>
            </div>

            {/* Profile Avatar / Login Button */}
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href={ROUTES.orders} title="Ver Meus Pedidos">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-9 w-9 rounded-full border-2 border-primary/50 object-cover transition-transform hover:scale-105 hover:border-primary"
                    src="/foto-perfil.webp"
                    alt="Foto de perfil"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden text-xs font-semibold text-muted-foreground hover:text-destructive sm:inline"
                >
                  Sair
                </button>
              </div>
            ) : mounted ? (
              <Link
                href={ROUTES.login}
                className="hidden rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-black transition-all hover:bg-[#b8eb23] hover:scale-105 sm:inline-block"
              >
                Entrar
              </Link>
            ) : null}

            {/* Mobile Menu Toggle */}
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground md:hidden"
              onClick={toggleMenu}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          onClick={closeMenu}
        >
          <div
            className="fixed right-0 top-0 h-full w-[280px] border-l border-white/10 bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-lg font-black tracking-wider text-foreground">
                IARA<span className="text-primary">GAMES</span>
              </span>
              <button
                onClick={closeMenu}
                className="rounded-lg p-1 text-muted-foreground hover:bg-white/5"
              >
                <X size={24} />
              </button>
            </div>

            {/* User Profile in Drawer */}
            {mounted && isAuthenticated ? (
              <div className="mt-4 flex items-center justify-between rounded-lg bg-black/30 p-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-10 w-10 rounded-full border border-primary/40 object-cover"
                    src="/foto-perfil.webp"
                    alt="Foto de perfil"
                  />
                  <div>
                    <span className="block text-xs font-semibold text-foreground">Gamer Conectado</span>
                    <span className="text-[10px] text-primary">5000 IC</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 space-y-2">
              <Link
                href={ROUTES.home}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-white/5 ${
                  isHome ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={closeMenu}
              >
                <House size={20} weight={isHome ? 'fill' : 'bold'} />
                <span>Home</span>
              </Link>

              <Link
                href={ROUTES.catalog}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-white/5 ${
                  isCatalog ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
                onClick={closeMenu}
              >
                <GameController size={20} weight={isCatalog ? 'fill' : 'bold'} />
                <span>Game Store</span>
              </Link>

              <Link
                href={ROUTES.cart}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/5 hover:text-primary"
                onClick={closeMenu}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} weight="fill" />
                  <span>Carrinho</span>
                </div>
                {totalItems > 0 && <Badge variant="neon">{totalItems}</Badge>}
              </Link>

              {mounted && isAuthenticated && (
                <Link
                  href={ROUTES.orders}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-white/5 ${
                    isOrders ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                  onClick={closeMenu}
                >
                  <Package size={20} weight={isOrders ? 'fill' : 'bold'} />
                  <span>Meus Pedidos</span>
                </Link>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6 border-t border-white/5 pt-4">
              {mounted && isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg border border-destructive/30 py-2.5 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10"
                >
                  Sair da Conta
                </button>
              ) : mounted ? (
                <div className="space-y-2">
                  <Link href={ROUTES.login} className="block" onClick={closeMenu}>
                    <button className="w-full rounded-lg border border-white/10 py-2.5 text-sm font-bold text-foreground hover:bg-white/5">
                      Entrar
                    </button>
                  </Link>
                  <Link href={ROUTES.register} className="block" onClick={closeMenu}>
                    <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-black uppercase text-black hover:bg-[#b8eb23]">
                      Criar Conta
                    </button>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
