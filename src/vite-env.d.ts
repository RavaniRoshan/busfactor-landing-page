/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string;
  readonly VITE_ANALYTICS_ENDPOINT?: string;
  readonly VITE_DEMO_REPORT_URL?: string;
  readonly VITE_DEMO_REPORT_LABEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
