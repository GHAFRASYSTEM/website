import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/content'

export default function manifest(): MetadataRoute.Manifest {
  const settings = getSiteSettings()

  return {
    name: settings.siteName,
    short_name: 'GHAFRA',
    description: settings.siteDescription,
    start_url: '/',
    display: 'standalone',
    background_color: '#1b3b2d',
    theme_color: '#1b3b2d',
    icons: [
      {
        src: '/images/extracted/image-12.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/images/extracted/image-12.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}
