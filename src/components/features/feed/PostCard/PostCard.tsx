import React from 'react';
import { Post as PostType } from '../../../types/post.types';
import { Card } from '../../common/Card/Card';
import { Avatar } from '../../common/Avatar/Avatar';
import { Button } from '../../common/Button/Button';
import { formatDistanceToNow } from '../../../utils/dateUtils';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: PostType;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onReport: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onReport,
  onDelete,
}) => {
  const isEmergency = post.type === 'EMERGENCY';

  return (
    <Card
      variant="default"
      padding="md"
      className={`${styles.card} ${isEmergency ? styles.emergency : ''}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <Avatar
            src={post.author.avatar}
            name={post.author.name || 'Anonymous'}
            size="md"
          />
          <div className={styles.authorDetails}>
            <h3 className={styles.authorName}>{post.author.name || 'Anonymous'}</h3>
            <p className={styles.timestamp}>
              {formatDistanceToNow(post.createdAt)}
              {isEmergency && <span className={styles.emergencyBadge}>🚨 EMERGENCY</span>}
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.moreButton} aria-label="More options">
            ⋯
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {post.title && <h2 className={styles.title}>{post.title}</h2>}
        <p className={styles.text}>{post.content}</p>

        {post.images && post.images.length > 0 && (
          <div className={styles.images}>
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className={styles.image}
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>

      {/* Type Badge */}
      <div className={styles.typeBadge}>
        <span className={`${styles.badge} ${styles[post.type.toLowerCase()]}`}>
          {post.type}
        </span>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(post.id)}
          className={post.isLiked ? styles.liked : ''}
        >
          {post.isLiked ? '❤️' : '🤍'} {post.likesCount}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onComment(post.id)}>
          💬 {post.commentsCount}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onReport(post.id)}>
          🚩 Report
        </Button>
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)}>
            🗑️ Delete
          </Button>
        )}
      </div>
    </Card>
  );
};
