import { User } from './user.types';

export interface ChatRoom {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
  type?: 'text' | 'image';
}

export interface TypingIndicator {
  roomId: string;
  userId: string;
  isTyping: boolean;
}
