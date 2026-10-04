import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Makes the webapp installable and usable offline
    VitePWA({
      // Wait for the user to accept the update notice before activating a new version
      registerType: 'prompt',
      // The precache glob below already lists the icons
      includeManifestIcons: false,
      manifest: {
        name: 'Letra a letra',
        short_name: 'Letra a letra',
        description: 'Generate circular word cards ready to print',
        theme_color: '#001529',
        background_color: '#001529',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // PR previews live under the production scope; let them load their own build
        navigateFallbackDenylist: [/\/pr-preview\//],
      },
    }),
  ],
})
