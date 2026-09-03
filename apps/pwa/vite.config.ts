import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['comuta-icon.svg'],
      manifest: false, // served from /manifest.webmanifest
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 12, maxAgeSeconds: 60 * 60 * 24 * 90 },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  /*
   * The monorepo hoists apps/mobile's pinned react 19.2.3 to the root while
   * apps/pwa resolves its own nested copy. Hoisted packages (react-router-dom,
   * motion) then bind to a DIFFERENT React than the app does, and every hook
   * throws "Invalid hook call" - the page renders blank. Dedupe forces one
   * copy regardless of how npm decides to hoist.
   */
  resolve: {
    dedupe: ['react', 'react-dom'],
  },

  server: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
});
