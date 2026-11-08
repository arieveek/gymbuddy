// GymBuddy frontend: a single-page app, built once with `nuxt generate`, served by Caddy and bundled in the Capacitor iOS app.
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },

  modules: ['@nuxt/ui', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxtjs/i18n', '@vite-pwa/nuxt'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'GymBuddy',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'GymBuddy' },
        { name: 'theme-color', content: '#101a2e' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      // Same-origin '/api' on the web; the native app sets the full URL at build time (NUXT_PUBLIC_API_BASE).
      apiBase: '/api'
    }
  },

  // Fonts are self-hosted at build time by @nuxt/fonts (part of Nuxt UI), so they work offline at the gym.
  fonts: {
    families: [
      // global: the families are only named inside CSS variables, which @nuxt/fonts does not scan.
      { name: 'Figtree', provider: 'google', weights: [400, 500, 600, 700], global: true },
      { name: 'Big Shoulders', provider: 'google', weights: [700, 800, 900], global: true }
    ]
  },

  // The persisted-state module defaults to cookies (4 KB); workout history needs localStorage.
  piniaPluginPersistedstate: {
    storage: 'localStorage'
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'nl', language: 'nl', name: 'Nederlands', file: 'nl.json' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: false
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'GymBuddy',
      short_name: 'GymBuddy',
      description: 'Pull-up training for gymnasts',
      theme_color: '#101a2e',
      background_color: '#eef1f5',
      display: 'standalone',
      icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
      navigateFallbackDenylist: [/^\/api\//]
    },
    devOptions: { enabled: false }
  },

  nitro: {
    devProxy: {
      '/api': { target: 'http://localhost:8080/api', changeOrigin: true }
    }
  },

  typescript: { strict: true }
})
