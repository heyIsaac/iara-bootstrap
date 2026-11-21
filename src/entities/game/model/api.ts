import axios from 'axios';
import { ENV } from '@/shared/config';
import { Game, GameFilters, GamesResponse, Genre, Platform } from './types';

const RAWG_BASE_URL = 'https://api.rawg.io/api';

export const fetchGames = async (filters: GameFilters = {}): Promise<GamesResponse> => {
  if (!ENV.rawgApiKey) {
    throw new Error('RAWG API Key não configurada. Configure NEXT_PUBLIC_RAWG_KEY.');
  }

  try {
    const params = {
      key: ENV.rawgApiKey,
      page: filters.page || 1,
      page_size: filters.page_size || 20,
      ...(filters.search && { search: filters.search }),
      ...(filters.ordering && { ordering: filters.ordering }),
      ...(filters.genres && { genres: filters.genres }),
      ...(filters.platforms && { platforms: filters.platforms }),
    };

    const response = await axios.get<GamesResponse>(`${RAWG_BASE_URL}/games`, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Erro ao buscar jogos. Tente novamente.'
    );
  }
};

export const fetchGameDetails = async (id: number | string): Promise<Game> => {
  if (!ENV.rawgApiKey) {
    throw new Error('RAWG API Key não configurada.');
  }

  try {
    const response = await axios.get<Game>(`${RAWG_BASE_URL}/games/${id}`, {
      params: { key: ENV.rawgApiKey },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || 'Erro ao buscar detalhes do jogo. Tente novamente.'
    );
  }
};

export const fetchGenres = async (): Promise<Genre[]> => {
  if (!ENV.rawgApiKey) {
    throw new Error('RAWG API Key não configurada.');
  }

  try {
    const response = await axios.get<{ results: Genre[] }>(`${RAWG_BASE_URL}/genres`, {
      params: { key: ENV.rawgApiKey },
    });
    return response.data.results;
  } catch {
    throw new Error('Erro ao buscar gêneros');
  }
};

export const fetchPlatforms = async (): Promise<Platform[]> => {
  if (!ENV.rawgApiKey) {
    throw new Error('RAWG API Key não configurada.');
  }

  try {
    const response = await axios.get<{ results: Platform[] }>(`${RAWG_BASE_URL}/platforms`, {
      params: { key: ENV.rawgApiKey },
    });
    return response.data.results;
  } catch {
    throw new Error('Erro ao buscar plataformas');
  }
};
