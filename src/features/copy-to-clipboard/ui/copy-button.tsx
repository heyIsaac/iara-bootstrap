'use client';

import React, { useState } from 'react';
import { Copy, Check } from '@phosphor-icons/react';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';

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
  className,
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
    <Button
      type="button"
      onClick={handleCopy}
      variant={copied ? 'default' : 'outline'}
      className={cn('gap-2 font-semibold transition-all', className)}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? <Check size={18} weight="bold" /> : <Copy size={18} />}
      <span>{copied ? copiedLabel : label}</span>
    </Button>
  );
};
