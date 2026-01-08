// Secure storage for tokens and sensitive data
const TOKEN_KEY = 'locrave_tokens';
const USER_KEY = 'locrave_user';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

export const secureStorage = {
  // Token management
  setTokens: (tokens: StoredTokens): void => {
    try {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  },

  getTokens: (): StoredTokens | null => {
    try {
      const tokens = localStorage.getItem(TOKEN_KEY);
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      return null;
    }
  },

  clearTokens: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  },

  // User data
  setUser: (user: unknown): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  },

  getUser: <T>(): T | null => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      return null;
    }
  },

  clearUser: (): void => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear user:', error);
    }
  },

  // Clear all
  clearAll: (): void => {
    secureStorage.clearTokens();
    secureStorage.clearUser();
  },
};
