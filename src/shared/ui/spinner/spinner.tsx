import React from 'react';
import styles from './spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  label,
  className = '',
}) => {
  const sizeClass = {
    sm: styles.spinnerSm,
    md: styles.spinnerMd,
    lg: styles.spinnerLg,
  }[size];

  return (
    <div className={`${styles.spinnerWrapper} ${className}`.trim()}>
      <div className={`${styles.spinner} ${sizeClass}`} role="status" aria-label={label || 'Carregando...'} />
      {label && <p className={styles.label}>{label}</p>}
    </div>
  );
};
