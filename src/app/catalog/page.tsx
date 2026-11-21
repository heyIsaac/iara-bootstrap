import { CatalogPage } from '@/views/catalog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo de Jogos - Iara Games',
  description: 'Explore nossa biblioteca completa de jogos nacionais e internacionais.',
};

export default function Page() {
  return <CatalogPage />;
}
