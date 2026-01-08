import { create } from 'zustand';
import { ChatRoom, ChatMessage, SendMessageRequest } from '../types/chat.types';
import apiClient, { handleApiError } from '../lib/api/client';
import { socketClient } from '../lib/socket/client';
import { saveMessages, getMessagesByRoom } from '../lib/storage/indexedDB';

interface ChatState {
  rooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  activeRoom: string | null;
  isLoading: boolean;
  error: string | null;
  typingUsers: Record<string, string[]>;

  // Actions
  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, data: SendMessageRequest) => Promise<void>;
  markAsRead: (roomId: string) => Promise<void>;
  setActiveRoom: (roomId: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  setTyping: (roomId: string, userId: string, isTyping: boolean) => void;
  loadOfflineMessages: (roomId: string) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  messages: {},
  activeRoom: null,
  isLoading: false,
  error: null,
  typingUsers: {},

  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get('/chat/rooms');
      set({ rooms: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false });
    }
  },

  fetchMessages: async (roomId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/chat/rooms/${roomId}/messages`);
      const messages = response.data.data;
      
      // Save to IndexedDB
      await saveMessages(messages);

      set((state) => ({
        messages: { ...state.messages, [roomId]: messages },
        isLoading: false,
      }));
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false });
    }
  },

  sendMessage: async (roomId: string, data: SendMessageRequest) => {
    try {
      // Emit via socket for real-time
      socketClient.sendMessage(roomId, data.content);
      
      // Also send via API as fallback
      const response = await apiClient.post(`/chat/rooms/${roomId}/messages`, data);
      const newMessage = response.data.data;

      // Add to local state if not already added by socket
      const currentMessages = get().messages[roomId] || [];
      const messageExists = currentMessages.some((msg) => msg.id === newMessage.id);
      
      if (!messageExists) {
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] || []), newMessage],
          },
        }));
      }
    } catch (error) {
      set({ error: handleApiError(error) });
      throw error;
    }
  },

  markAsRead: async (roomId: string) => {
    try {
      await apiClient.post(`/chat/rooms/${roomId}/read`);
      
      // Update unread count
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.id === roomId ? { ...room, unreadCount: 0 } : room
        ),
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  setActiveRoom: (roomId: string | null) => {
    const prevRoom = get().activeRoom;
    
    if (prevRoom) {
      socketClient.leaveRoom(prevRoom);
    }
    
    if (roomId) {
      socketClient.joinRoom(roomId);
    }
    
    set({ activeRoom: roomId });
  },

  addMessage: (message: ChatMessage) => {
    set((state) => {
      const roomMessages = state.messages[message.roomId] || [];
      const messageExists = roomMessages.some((msg) => msg.id === message.id);
      
      if (messageExists) return state;

      return {
        messages: {
          ...state.messages,
          [message.roomId]: [...roomMessages, message],
        },
      };
    });
  },

  setTyping: (roomId: string, userId: string, isTyping: boolean) => {
    set((state) => {
      const currentTyping = state.typingUsers[roomId] || [];
      
      let newTyping: string[];
      if (isTyping) {
        newTyping = currentTyping.includes(userId) 
          ? currentTyping 
          : [...currentTyping, userId];
      } else {
        newTyping = currentTyping.filter((id) => id !== userId);
      }

      return {
        typingUsers: {
          ...state.typingUsers,
          [roomId]: newTyping,
        },
      };
    });
  },

  loadOfflineMessages: async (roomId: string) => {
    try {
      const offlineMessages = await getMessagesByRoom(roomId);
      if (offlineMessages.length > 0) {
        set((state) => ({
          messages: { ...state.messages, [roomId]: offlineMessages },
        }));
      }
    } catch (error) {
      console.error('Failed to load offline messages:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
