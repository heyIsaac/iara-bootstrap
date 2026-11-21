'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import styles from './search-games-input.module.css';

export interface SearchGamesInputProps {
  value?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
}

export const SearchGamesInput: React.FC<SearchGamesInputProps> = ({
  value: controlledValue,
  onSearch,
  debounceMs = 500,
  placeholder = 'Buscar jogos...',
}) => {
  const [internalValue, setInternalValue] = useState(controlledValue || '');

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(internalValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onSearch]);

  return (
    <div className={styles.searchWrapper}>
      <MagnifyingGlass size={20} className={styles.searchIcon} />
      <input
        type="search"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
        aria-label="Buscar jogos"
      />
    </div>
  );
};
