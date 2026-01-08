import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getColorFromName = (name: string): string => {
  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#3b82f6',
    '#ec4899',
    '#14b8a6',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] || colors[0];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);
  const showInitials = !src || imageError;
  const initials = showInitials ? getInitials(name) : '';
  const backgroundColor = showInitials ? getColorFromName(name) : undefined;

  const classNames = [
    styles.avatar,
    styles[size],
    onClick && styles.clickable,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      style={{ backgroundColor }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={alt || name}
    >
      {!showInitials ? (
        <img
          src={src}
          alt={alt || name}
          className={styles.image}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
};
