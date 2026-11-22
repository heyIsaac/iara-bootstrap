'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  Pause,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
} from '@phosphor-icons/react';
import { ROUTES } from '@/shared/config';
import { playSound } from '@/shared/lib/sound';
import { useAuth } from '@/entities/user';

export const LandingHero: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax 3D effect on mouse move (preserving the downward translation so bottom remains cut cleanly)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardsRef.current) return;
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    cardsRef.current.style.transform = `perspective(1000px) translateY(22%) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateX(${x * 12}px)`;
  };

  const handleMouseLeave = () => {
    if (!cardsRef.current) return;
    cardsRef.current.style.transform = 'perspective(1000px) translateY(22%) rotateY(0deg) rotateX(0deg) translateX(0px)';
    cardsRef.current.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
  };

  const handleMouseEnter = () => {
    if (!cardsRef.current) return;
    cardsRef.current.style.transition = 'transform 0.15s ease-out';
  };

  const handlePlayCharacterSound = (name: 'luigi' | 'sonic' | 'mario') => {
    playSound(`/sounds/${name}.mp3`, 0.7);
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <header
      className="relative z-10 flex min-h-[85vh] flex-col items-center justify-start overflow-hidden pb-0 pt-12 sm:pt-16"
      role="banner"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Background Video Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          id="hero-video-bg"
          className="h-full w-full object-cover"
          poster="/assets/background-hero.webp"
        >
          <source src="/assets/iara-video-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark Vignette / Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/80 via-[#121212]/70 to-[#121212]" />
      </div>

      {/* Hero Header Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center">
        {/* Iara Games Typo Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/brand/iara_games-typo.svg"
          alt="Iara Games"
          className="mb-3 h-9 sm:h-12 md:h-14 w-auto drop-shadow-[0_4px_20px_rgba(204,254,44,0.3)]"
        />

        {/* Main Headline */}
        <h1 className="text-3xl font-black uppercase tracking-wider text-white sm:text-5xl md:text-6xl">
          Sua melhor escolha
        </h1>

        {/* Subtitle */}
        <p className="mt-3 max-w-xl text-xs sm:text-sm md:text-base text-gray-300">
          A ÚNICA empresa do mercado com títulos nacionais e internacionais em um preço acessível para todos!
        </p>

        {/* Action Button: Criar Conta / Meus Pedidos */}
        <div className="mt-6 sm:mt-7">
          <Link href={mounted && isAuthenticated ? ROUTES.orders : ROUTES.register}>
            <button className="inline-flex items-center gap-2.5 rounded-full bg-[#CCFE2C] px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-black shadow-[0_0_25px_rgba(204,254,44,0.4)] transition-all duration-300 hover:bg-[#b8eb23] hover:scale-105 active:scale-95">
              <span>{mounted && isAuthenticated ? 'Meus Pedidos' : 'Criar Conta'}</span>
              <ArrowRight size={18} weight="bold" />
            </button>
          </Link>
        </div>

        {/* 3D Overlapping Character Cards:
            - Occupies 50% of the screen width on desktop (lg:w-[50vw]), centered
            - Cleanly cut off at the bottom by header's overflow-hidden (translate-y-[22%])
            - Well-spread wide fan layout: Luigi, Sonic, Mario each fully prominent
        */}
        <div
          ref={cardsRef}
          className="relative z-20 mt-8 sm:mt-12 flex w-[92vw] sm:w-[75vw] lg:w-[50vw] max-w-[960px] items-end justify-center translate-y-[22%] transition-transform duration-300 ease-out"
          style={{ transform: 'perspective(1000px) translateY(22%)' }}
        >
          {/* Luigi Card (Yellow - Left) */}
          <div
            onClick={() => handlePlayCharacterSound('luigi')}
            className="group relative -mr-[6%] lg:-mr-[8%] w-[35%] max-w-[340px] aspect-[2/3] cursor-pointer overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] border-[6px] sm:border-[8px] lg:border-[10px] border-[#252525]/60 bg-[#fee62c] shadow-[0_10px_35px_rgba(254,230,44,0.2)] transition-all duration-300 hover:z-30 hover:scale-105 hover:rotate-0 -rotate-[7deg] z-10"
            title="Clique para ouvir o Luigi!"
            role="button"
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Luigi .webp"
              alt="Luigi"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Sonic Card (Lime Green - Center & Elevated) */}
          <div
            onClick={() => handlePlayCharacterSound('sonic')}
            className="group relative w-[38%] max-w-[380px] aspect-[2/3] cursor-pointer overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] border-[6px] sm:border-[8px] lg:border-[10px] border-[#252525]/60 bg-[#ccfe2c] shadow-[0_15px_45px_rgba(204,254,44,0.35)] transition-all duration-300 hover:z-30 hover:scale-105 -translate-y-8 sm:-translate-y-12 lg:-translate-y-16 z-20"
            title="Clique para ouvir o Sonic!"
            role="button"
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Sonic.webp"
              alt="Sonic"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>

          {/* Mario Card (Blue - Right) */}
          <div
            onClick={() => handlePlayCharacterSound('mario')}
            className="group relative -ml-[6%] lg:-ml-[8%] w-[35%] max-w-[340px] aspect-[2/3] cursor-pointer overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] border-[6px] sm:border-[8px] lg:border-[10px] border-[#252525]/60 bg-[#2c7afe] shadow-[0_10px_35px_rgba(44,122,254,0.2)] transition-all duration-300 hover:z-30 hover:scale-105 hover:rotate-0 rotate-[7deg] z-10"
            title="Clique para ouvir o Mario!"
            role="button"
            tabIndex={0}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/Mario.webp"
              alt="Mario"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
      </div>

      {/* Video Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
        <button
          onClick={toggleVideoPlay}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110"
          aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
        >
          {isPlaying ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
        </button>

        <button
          onClick={toggleVideoMute}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110"
          aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
        >
          {isMuted ? <SpeakerSimpleSlash size={20} weight="fill" /> : <SpeakerSimpleHigh size={20} weight="fill" />}
        </button>
      </div>
    </header>
  );
};
