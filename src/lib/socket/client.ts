import { io, Socket } from 'socket.io-client';
import { secureStorage } from '../storage/secureStorage';
import { SocketEventName, SocketEventHandler } from '../../types/socket.types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class SocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): void {
    if (this.socket?.connected) return;

    const tokens = secureStorage.getTokens();
    if (!tokens?.accessToken) {
      console.warn('No access token found, skipping socket connection');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token: tokens.accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupListeners();
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on<T extends SocketEventName>(
    event: T,
    handler: SocketEventHandler<T>
  ): void {
    if (!this.socket) {
      console.warn('Socket not connected');
      return;
    }
    this.socket.on(event, handler as never);
  }

  off<T extends SocketEventName>(
    event: T,
    handler?: SocketEventHandler<T>
  ): void {
    if (!this.socket) return;
    if (handler) {
      this.socket.off(event, handler as never);
    } else {
      this.socket.off(event);
    }
  }

  emit<T extends SocketEventName>(
    event: T,
    ...args: Parameters<SocketEventHandler<T>>
  ): void {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, cannot emit:', event);
      return;
    }
    this.socket.emit(event, ...args);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Chat methods
  joinRoom(roomId: string): void {
    this.emit('chat:join', roomId);
  }

  leaveRoom(roomId: string): void {
    this.emit('chat:leave', roomId);
  }

  sendMessage(roomId: string, content: string): void {
    this.emit('chat:send', { roomId, content });
  }

  sendTyping(roomId: string, isTyping: boolean): void {
    this.emit('chat:typing', { roomId, userId: '', isTyping });
  }
}

export const socketClient = new SocketClient();
export default socketClient;
