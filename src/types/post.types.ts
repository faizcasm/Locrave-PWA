import { PostType, Location } from './global.types';
import { User } from './user.types';

export interface Post {
  id: string;
  authorId: string;
  author: User;
  type: PostType;
  title?: string;
  content: string;
  images?: string[];
  location: Location;
  radius: number;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  type: PostType;
  title?: string;
  content: string;
  images?: File[];
  location: Location;
  radius?: number;
}

export interface CreateCommentRequest {
  content: string;
}

export interface ReportPostRequest {
  reason: string;
  details?: string;
}
