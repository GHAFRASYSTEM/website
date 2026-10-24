'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchAnnouncements, type Announcement } from '@/lib/announcements'
import AnnouncementCard from '@/components/announcements/AnnouncementCard'

export default function LatestNews() {
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchAnnouncements(1, 2)
      .then(({ announcements }) => {
        if (!cancelled) setAnnouncements(announcements.slice(0, 2))
      })
      .catch(() => {
        if (!cancelled) setAnnouncements([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  const loading = announcements === null
  const empty = announcements?.length === 0

  return (
    <section aria-labelledby="latest-news" className="py-16 md:py-24 geo-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 id="latest-news" className="font-heading text-3xl md:text-4xl font-bold gradient-title mb-4">
            Latest news
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Announcements, events, and updates from the GHAFRA Nord community.
          </p>
        </div>

        {!empty && (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {loading
              ? Array.from({ length: 2 }, (_, index) => <CardSkeleton key={index} />)
              : announcements.map((announcement) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
          </div>
        )}

        <div className={`text-center ${empty ? '' : 'mt-10'}`}>
          <Link
            href="/announcements"
            className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            Read more on our News Page
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function CardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="aspect-16/10 animate-pulse bg-primary-100" />
      <div className="space-y-3 p-5 sm:p-6">
        <div className="h-4 w-24 animate-pulse rounded-full bg-neutral-100" />
        <div className="h-6 w-4/5 animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
      </div>
    </div>
  )
}
