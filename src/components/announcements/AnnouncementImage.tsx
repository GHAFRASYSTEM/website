'use client'

import { useState } from 'react'
import { Newspaper } from 'lucide-react'

export default function AnnouncementImage({
  src,
  alt,
  className = '',
  iconClassName = 'h-10 w-10',
  priority = false,
}: {
  src: string | null
  alt: string
  className?: string
  iconClassName?: string
  priority?: boolean
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)

  if (!src || failedSrc === src) {
    return (
      <div
        aria-hidden="true"
        className={`flex items-center justify-center bg-linear-to-br from-tertiary-800 via-tertiary-700 to-primary-800 text-white/70 ${className}`}
      >
        <Newspaper className={iconClassName} strokeWidth={1.5} />
      </div>
    )
  }

  return (
    // Hosts for announcement images are not known until the API responds.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={`object-cover ${className}`}
      onError={() => setFailedSrc(src)}
    />
  )
}
