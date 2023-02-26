/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_INSIGHTS_CONNECTION_STRING: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}