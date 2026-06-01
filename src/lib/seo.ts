import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/content'

const defaultImagePath = '/images/extracted/image-12.jpg'

export function buildPageMetadata({
  title,
  description,
  path = '/',
  image = defaultImagePath,
  imageAlt,
}: {
  title?: string
  description: string
  path?: string
  image?: string
  imageAlt?: string
}): Metadata {
  const settings = getSiteSettings()
  const canonicalUrl =
    path === '/' ? settings.siteUrl : `${settings.siteUrl}${path}`
  const resolvedTitle = title || settings.siteName
  const resolvedImageAlt = imageAlt || resolvedTitle

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: resolvedTitle,
      description,
      siteName: settings.siteName,
      images: [
        {
          url: image,
          alt: resolvedImageAlt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [image],
    },
  }
}
