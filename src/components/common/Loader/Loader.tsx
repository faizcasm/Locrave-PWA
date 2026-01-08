import React from 'react';
import styles from './Loader.module.css';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  fullScreen?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  fullScreen = false,
  text,
}) => {
  const content = (
    <div className={styles.loaderContent}>
      <div className={`${styles.loader} ${styles[variant]} ${styles[size]}`}>
        {variant === 'spinner' && <div className={styles.spinner} />}
        {variant === 'dots' && (
          <div className={styles.dots}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        )}
        {variant === 'pulse' && <div className={styles.pulse} />}
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{content}</div>;
  }

  return content;
};
