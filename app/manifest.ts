import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HabitFlow',
    short_name: 'HabitFlow',
    description: 'Build habits that last',
    start_url: '/today',
    display: 'standalone',
    background_color: '#0f0f14',
    theme_color: '#0f0f14',
    orientation: 'portrait',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
