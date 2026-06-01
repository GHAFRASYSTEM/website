import Link from 'next/link'
import { getSiteSettings } from '@/lib/content'

const settings = getSiteSettings()

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-heading text-6xl font-bold text-primary-600 mb-4">
          {settings.notFound.code}
        </h1>
        <h2 className="font-heading text-2xl font-semibold text-neutral-900 mb-4">
          {settings.notFound.title}
        </h2>
        <p className="text-neutral-600 mb-8 max-w-md mx-auto">
          {settings.notFound.message}
        </p>
        <Link
          href={settings.notFound.buttonHref}
          className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {settings.notFound.buttonText}
        </Link>
      </div>
    </div>
  )
}
