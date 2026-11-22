import * as React from 'react';
import { cn } from '@/shared/lib/cn';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

const colorClasses = {
  primary: 'border-primary/20 border-t-primary',
  white: 'border-white/20 border-t-white',
  muted: 'border-muted border-t-foreground',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  label,
  className,
  ...props
}) => {
  return (
    <div className="inline-flex flex-col items-center justify-center gap-2">
      <div
        role="status"
        aria-label={label || 'Carregando'}
        className={cn(
          'animate-spin rounded-full border-solid',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        {...props}
      >
        <span className="sr-only">{label || 'Carregando...'}</span>
      </div>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
};
