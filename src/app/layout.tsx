import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/shared/ScrollToTop'
import { getSiteSettings } from '@/lib/content'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

const settings = getSiteSettings()
const logoPath = '/images/extracted/image-12.jpg'
const themeScript = `(function(){const storageKey='theme-preference';const root=document.documentElement;const media=window.matchMedia('(prefers-color-scheme: dark)');const stored=window.localStorage.getItem(storageKey);const mode=stored==='light'||stored==='dark'||stored==='auto'?stored:'auto';const resolved=mode==='auto'?(media.matches?'dark':'light'):mode;root.dataset.themeMode=mode;root.classList.toggle('dark',resolved==='dark');root.style.colorScheme=resolved;})();`

export const metadata: Metadata = {
  metadataBase: new URL(settings.siteUrl),
  applicationName: settings.siteName,
  title: {
    default: `${settings.siteName} - Ghanaian Community in Lille`,
    template: `%s | ${settings.siteName}`,
  },
  description: settings.siteDescription,
  alternates: {
    canonical: settings.siteUrl,
  },
  icons: {
    icon: logoPath,
    shortcut: logoPath,
    apple: logoPath,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: settings.siteUrl,
    siteName: settings.siteName,
    images: [
      {
        url: logoPath,
        width: 1200,
        height: 630,
        alt: settings.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [logoPath],
  },
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sameAs = [
    settings.socialLinks.facebook,
    settings.socialLinks.instagram,
    settings.socialLinks.linkedin,
    settings.socialLinks.youtube,
    settings.socialLinks.twitter,
  ].filter(Boolean)

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NonGovernmentalOrganization',
              name: settings.siteName,
              url: settings.siteUrl,
              logo: `${settings.siteUrl}${logoPath}`,
              description: settings.siteDescription,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Lille',
                addressRegion: 'Hauts-de-France',
                addressCountry: 'FR',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: settings.contactPhone,
                contactType: 'general',
                email: settings.contactEmail,
              },
              sameAs,
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Header settings={settings} />
        <main className="min-h-screen">{children}</main>
        <Footer settings={settings} />
        <ScrollToTop />
      </body>
    </html>
  )
}
