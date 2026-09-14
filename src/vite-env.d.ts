/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_KAKAOMAP_API_KEY: string;
  readonly VITE_DEMO_MODE: string;
  readonly VITE_SCREENSHOT_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __DEMO_BUILD__: boolean;
