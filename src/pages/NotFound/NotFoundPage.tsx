import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button/Button';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/feed">
          <Button size="lg">Go to Feed</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
