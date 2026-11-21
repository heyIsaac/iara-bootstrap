'use client';

import { useCallback } from 'react';
import { playSound } from '@/shared/lib/sound';

export const useCartSounds = () => {
  const playSuccess = useCallback(() => {
    playSound('/sounds/success.mp3', 0.6);
  }, []);

  const playRemove = useCallback(() => {
    playSound('/sounds/success.mp3', 0.3);
  }, []);

  return { playSuccess, playRemove };
};
