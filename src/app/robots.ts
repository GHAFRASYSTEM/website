import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/content'

export default function robots(): MetadataRoute.Robots {
  const settings = getSiteSettings()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${settings.siteUrl}/sitemap.xml`,
  }
}
