/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_DEFAULT_LATITUDE: string;
  readonly VITE_DEFAULT_LONGITUDE: string;
  readonly VITE_DEFAULT_RADIUS: string;
  readonly VITE_ENABLE_PWA: string;
  readonly VITE_ENABLE_NOTIFICATIONS: string;
  readonly VITE_ENABLE_DARK_MODE: string;
  readonly VITE_EMERGENCY_COOLDOWN_MS: string;
  readonly VITE_MAX_FILE_SIZE_MB: string;
  readonly VITE_ALLOWED_FILE_TYPES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
