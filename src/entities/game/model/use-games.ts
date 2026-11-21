'use client';

import { useState, useEffect, useCallback } from 'react';
import { Game, GameFilters } from './types';
import { fetchGames } from './api';

export const useGames = (filters: GameFilters = {}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(filters.page || 1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const loadGames = useCallback(async (currentPage: number, currentFilters: GameFilters) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchGames({
        ...currentFilters,
        page: currentPage,
      });

      setGames(response.results);
      setTotalCount(response.count);
      setHasMore(!!response.next);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar jogos');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const { search, ordering, genres, platforms } = filters;

  useEffect(() => {
    loadGames(page, { search, ordering, genres, platforms });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, ordering, genres, platforms, loadGames]);

  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const refresh = useCallback(() => {
    loadGames(page, filters);
  }, [page, filters, loadGames]);

  return {
    games,
    loading,
    error,
    page,
    hasMore,
    totalCount,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  };
};
