import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Post } from '../../types/post.types';
import { ChatMessage } from '../../types/chat.types';
import { MarketplaceListing } from '../../types/marketplace.types';

interface LocraveDB extends DBSchema {
  posts: {
    key: string;
    value: Post;
    indexes: { 'by-date': string };
  };
  messages: {
    key: string;
    value: ChatMessage;
    indexes: { 'by-room': string; 'by-date': string };
  };
  listings: {
    key: string;
    value: MarketplaceListing;
    indexes: { 'by-date': string };
  };
  drafts: {
    key: string;
    value: {
      type: 'post' | 'listing';
      data: unknown;
      createdAt: string;
    };
  };
}

let dbInstance: IDBPDatabase<LocraveDB> | null = null;

const initDB = async (): Promise<IDBPDatabase<LocraveDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<LocraveDB>('locrave-db', 1, {
    upgrade(db) {
      // Posts store
      if (!db.objectStoreNames.contains('posts')) {
        const postStore = db.createObjectStore('posts', { keyPath: 'id' });
        postStore.createIndex('by-date', 'createdAt');
      }

      // Messages store
      if (!db.objectStoreNames.contains('messages')) {
        const messageStore = db.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('by-room', 'roomId');
        messageStore.createIndex('by-date', 'createdAt');
      }

      // Listings store
      if (!db.objectStoreNames.contains('listings')) {
        const listingStore = db.createObjectStore('listings', { keyPath: 'id' });
        listingStore.createIndex('by-date', 'createdAt');
      }

      // Drafts store
      if (!db.objectStoreNames.contains('drafts')) {
        db.createObjectStore('drafts', { keyPath: 'type' });
      }
    },
  });

  return dbInstance;
};

// Posts
export const savePosts = async (posts: Post[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction('posts', 'readwrite');
  await Promise.all(posts.map((post) => tx.store.put(post)));
  await tx.done;
};

export const getPosts = async (limit = 50): Promise<Post[]> => {
  const db = await initDB();
  const posts = await db.getAllFromIndex('posts', 'by-date', undefined, limit);
  return posts.reverse();
};

export const clearPosts = async (): Promise<void> => {
  const db = await initDB();
  await db.clear('posts');
};

// Messages
export const saveMessages = async (messages: ChatMessage[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction('messages', 'readwrite');
  await Promise.all(messages.map((msg) => tx.store.put(msg)));
  await tx.done;
};

export const getMessagesByRoom = async (roomId: string): Promise<ChatMessage[]> => {
  const db = await initDB();
  return db.getAllFromIndex('messages', 'by-room', roomId);
};

export const clearMessages = async (): Promise<void> => {
  const db = await initDB();
  await db.clear('messages');
};

// Listings
export const saveListings = async (listings: MarketplaceListing[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction('listings', 'readwrite');
  await Promise.all(listings.map((listing) => tx.store.put(listing)));
  await tx.done;
};

export const getListings = async (limit = 50): Promise<MarketplaceListing[]> => {
  const db = await initDB();
  const listings = await db.getAllFromIndex('listings', 'by-date', undefined, limit);
  return listings.reverse();
};

export const clearListings = async (): Promise<void> => {
  const db = await initDB();
  await db.clear('listings');
};

// Drafts
export const saveDraft = async (
  type: 'post' | 'listing',
  data: unknown
): Promise<void> => {
  const db = await initDB();
  await db.put('drafts', {
    type,
    data,
    createdAt: new Date().toISOString(),
  });
};

export const getDraft = async (
  type: 'post' | 'listing'
): Promise<unknown | null> => {
  const db = await initDB();
  const draft = await db.get('drafts', type);
  return draft?.data || null;
};

export const clearDraft = async (type: 'post' | 'listing'): Promise<void> => {
  const db = await initDB();
  await db.delete('drafts', type);
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  await clearPosts();
  await clearMessages();
  await clearListings();
  const db = await initDB();
  await db.clear('drafts');
};
