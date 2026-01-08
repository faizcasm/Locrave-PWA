import { ChatMessage, TypingIndicator } from './chat.types';
import { Post } from './post.types';
import { Notification } from './notification.types';
import { Booking } from './service.types';

export interface SocketEvents {
  // Chat events
  'chat:join': (roomId: string) => void;
  'chat:leave': (roomId: string) => void;
  'chat:send': (message: { roomId: string; content: string }) => void;
  'chat:message': (message: ChatMessage) => void;
  'chat:typing': (data: TypingIndicator) => void;

  // Notification events
  'notification:new': (notification: Notification) => void;

  // Post events
  'post:new': (post: Post) => void;
  'post:update': (post: Post) => void;
  'post:delete': (postId: string) => void;

  // Emergency events
  'emergency:alert': (post: Post) => void;

  // Booking events
  'booking:update': (booking: Booking) => void;

  // Connection events
  connect: () => void;
  disconnect: () => void;
  error: (error: Error) => void;
}

export type SocketEventName = keyof SocketEvents;
export type SocketEventHandler<T extends SocketEventName> = SocketEvents[T];
