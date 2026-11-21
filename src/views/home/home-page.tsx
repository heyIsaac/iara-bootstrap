'use client';

import React from 'react';
import { Header } from '@/widgets/header';
import { LandingHero } from '@/widgets/landing-hero';
import { LandingFeatured } from '@/widgets/landing-featured';
import { Footer } from '@/widgets/footer';

export const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <LandingHero />
        <LandingFeatured />
      </main>
      <Footer />
    </>
  );
};
