'use client';

import React, { useState } from 'react';
import { Copy, Check } from '@phosphor-icons/react';
import styles from './copy-button.module.css';

export interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'Copiar',
  copiedLabel = 'Copiado!',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${styles.copyBtn} ${copied ? styles.copied : ''} ${className}`.trim()}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? <Check size={18} weight="bold" /> : <Copy size={18} />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
};
