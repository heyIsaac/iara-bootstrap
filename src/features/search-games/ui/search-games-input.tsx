'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';

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
    <div className="relative flex-1 min-w-[240px]">
      <MagnifyingGlass
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <input
        type="search"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label="Buscar jogos"
      />
    </div>
  );
};
