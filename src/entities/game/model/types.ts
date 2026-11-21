export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ShortScreenshot {
  id: number;
  image: string;
}

export interface EsrbRating {
  name: string;
}

export interface Game {
  id: number;
  name: string;
  slug: string;
  background_image: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  released: string;
  genres: Genre[];
  platforms: Platform[];
  short_screenshots?: ShortScreenshot[];
  description_raw?: string;
  metacritic?: number;
  playtime?: number;
  esrb_rating?: EsrbRating;
}

export interface GamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}

export interface GameFilters {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
  genres?: string;
  platforms?: string;
}
