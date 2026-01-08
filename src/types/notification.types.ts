export enum NotificationType {
  POST_LIKE = 'POST_LIKE',
  POST_COMMENT = 'POST_COMMENT',
  BOOKING_UPDATE = 'BOOKING_UPDATE',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  EMERGENCY_ALERT = 'EMERGENCY_ALERT',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  emergencyAlerts: boolean;
  communityPosts: boolean;
  bookingUpdates: boolean;
  chatMessages: boolean;
  marketing: boolean;
}
