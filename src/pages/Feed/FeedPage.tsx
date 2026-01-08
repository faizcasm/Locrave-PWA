import React, { useEffect, useState } from 'react';
import { useFeedStore } from '../../stores/feedStore';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { PostCard } from '../../components/features/feed/PostCard/PostCard';
import { Button } from '../../components/common/Button/Button';
import { Loader } from '../../components/common/Loader/Loader';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { Modal } from '../../components/common/Modal/Modal';
import { Input } from '../../components/common/Input/Input';
import toast from 'react-hot-toast';
import styles from './FeedPage.module.css';

const FeedPage: React.FC = () => {
  const {
    posts,
    isLoading,
    isLoadingMore,
    hasMore,
    currentPage,
    fetchPosts,
    likePost,
    unlikePost,
    deletePost,
    reportPost,
  } = useFeedStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

  // Initial fetch
  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts(1);
    }
  }, [posts.length, fetchPosts]);

  // Infinite scroll
  const loadMoreRef = useInfiniteScroll({
    loading: isLoadingMore,
    hasMore,
    onLoadMore: () => fetchPosts(currentPage + 1),
  });

  const handleLike = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post?.isLiked) {
      unlikePost(postId);
    } else {
      likePost(postId);
    }
  };

  const handleComment = (postId: string) => {
    // TODO: Open comment modal or navigate to post detail
    console.log('Comment on post:', postId);
    toast('Comment feature coming soon!');
  };

  const handleReport = (postId: string) => {
    setSelectedPostId(postId);
    setShowReportModal(true);
  };

  const submitReport = async () => {
    if (!selectedPostId || !reportReason) return;

    try {
      await reportPost(selectedPostId, reportReason);
      toast.success('Post reported successfully');
      setShowReportModal(false);
      setReportReason('');
      setSelectedPostId(null);
    } catch (error) {
      toast.error('Failed to report post');
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(postId);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (isLoading && posts.length === 0) {
    return <Loader fullScreen text="Loading feed..." />;
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Community Feed</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          ✏️ Create Post
        </Button>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <EmptyState
          icon="📰"
          title="No posts yet"
          description="Be the first to share something with your community!"
          action={{
            label: 'Create Post',
            onClick: () => setShowCreateModal(true),
          }}
        />
      ) : (
        <>
          <div className={styles.feed}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onReport={handleReport}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className={styles.loadMore}>
            {isLoadingMore && <Loader text="Loading more..." />}
            {!hasMore && posts.length > 0 && (
              <p className={styles.endMessage}>You've reached the end!</p>
            )}
          </div>
        </>
      )}

      {/* Create Post Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Post"
        size="md"
      >
        <div className={styles.modalContent}>
          <p className={styles.modalText}>Create post feature coming soon!</p>
          <Button onClick={() => setShowCreateModal(false)} fullWidth>
            Close
          </Button>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setReportReason('');
          setSelectedPostId(null);
        }}
        title="Report Post"
        size="sm"
      >
        <div className={styles.modalContent}>
          <Input
            label="Reason"
            placeholder="Why are you reporting this post?"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            fullWidth
            required
          />
          <div className={styles.modalActions}>
            <Button onClick={submitReport} fullWidth disabled={!reportReason}>
              Submit Report
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowReportModal(false);
                setReportReason('');
                setSelectedPostId(null);
              }}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeedPage;
