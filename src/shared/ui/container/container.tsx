import React from 'react';
import styles from './container.module.css';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 'xl',
  className = '',
  children,
  ...props
}) => {
  const maxWidthClass = {
    sm: styles.containerSm,
    md: styles.containerMd,
    lg: styles.containerLg,
    xl: styles.containerXl,
    full: styles.containerFull,
  }[maxWidth];

  return (
    <div
      className={`${styles.containerWrapper} ${maxWidthClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
};
