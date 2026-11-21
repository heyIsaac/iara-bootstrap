'use client';

import { useState, useEffect } from 'react';
import { Game } from './types';
import { fetchGameDetails } from './api';

export const useGameDetails = (id: number | string | undefined) => {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadGameDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchGameDetails(id);
        if (isMounted) {
          setGame(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Erro ao carregar detalhes do jogo');
          setGame(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadGameDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { game, loading, error };
};
