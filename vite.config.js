import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
            react(),  
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['icon-192.png', 'icon-512.png'],
                manifest: {
                      "name": "Learn with Clara",
                      "short_name": "Clara",
                      "description": "An AI-powered English learning platform for Bangladeshi students.",
                      "start_url": "/",
                      "display": "standalone",
                      "background_color": "#ffffff",
                      "theme_color": "#2563eb",
                      "orientation": "portrait",
                      "icons": [
                        {
                          "src": "/icon-192.png",
                          "sizes": "192x192",
                          "type": "image/png"
                        },
                        {
                          "src": "/icon-512.png",
                          "sizes": "512x512",
                          "type": "image/png"
                        }
                      ]
                    }
    }),
  ],
})
