'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  AnnouncementsRequestError,
  fetchAnnouncements,
  type Announcement,
  type AnnouncementPageResult,
} from '@/lib/announcements'
import AnnouncementCard, {
  CompactAnnouncementItem,
  FeaturedAnnouncementCard,
} from '@/components/announcements/AnnouncementCard'
import {
  AnnouncementError,
  AnnouncementListSkeleton,
} from '@/components/announcements/AnnouncementUi'

export default function AnnouncementList({ page }: { page: number }) {
  const [retryCount, setRetryCount] = useState(0)
  const [result, setResult] = useState<{
    key: string
    data: AnnouncementPageResult | null
    error: AnnouncementsRequestError | null
  } | null>(null)

  const requestKey = `${page}:${retryCount}`

  useEffect(() => {
    let cancelled = false
    const key = requestKey

    fetchAnnouncements(page)
      .then((data) => {
        if (!cancelled) setResult({ key, data, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setResult({
          key,
          data: null,
          error:
            err instanceof AnnouncementsRequestError
              ? err
              : new AnnouncementsRequestError(
                  'Announcements could not be loaded. Please try again.',
                  0,
                ),
        })
      })

    return () => {
      cancelled = true
    }
  }, [page, requestKey])

  const current = result?.key === requestKey ? result : null
  const announcements = current?.data?.announcements ?? []
  const pages = current?.data?.pages ?? 1
  const error = current?.error ?? null

  const featured = page === 1

  let content
  if (!current) {
    content = <AnnouncementListSkeleton featured={featured} />
  } else if (error) {
    content = (
      <AnnouncementError
        message={error.message || 'Announcements could not be loaded. Please try again.'}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    )
  } else if (announcements.length === 0) {
    content = (
      <>
        <div className="card mx-auto max-w-xl p-8 text-center sm:p-10">
          <h2 className="font-heading text-2xl font-bold text-neutral-900">
            {pages > 1 ? 'No announcements on this page' : 'No announcements yet'}
          </h2>
          <p className="mt-3 text-neutral-600">
            {pages > 1
              ? 'Choose another page to keep reading.'
              : 'New updates will appear here when they are published.'}
          </p>
        </div>
        <AnnouncementPagination page={page} pages={pages} />
      </>
    )
  } else if (featured) {
    const [lead, ...rest] = announcements
    const side = rest.slice(0, 3)
    const more = rest.slice(3)

    content = (
      <>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className={side.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}>
            <FeaturedAnnouncementCard announcement={lead} />
          </div>
          {side.length > 0 && (
            <aside aria-labelledby="latest-stories" className="card self-start p-5 sm:p-6 lg:col-span-5">
              <SectionLabel id="latest-stories">Latest stories</SectionLabel>
              <div className="mt-4">
                {side.map((announcement) => (
                  <CompactAnnouncementItem key={announcement.id} announcement={announcement} />
                ))}
              </div>
            </aside>
          )}
        </div>
        {more.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <SectionTitle>More news</SectionTitle>
            <AnnouncementGrid announcements={more} />
          </div>
        )}
        <AnnouncementPagination page={page} pages={pages} />
      </>
    )
  } else {
    content = (
      <>
        <SectionTitle>More news</SectionTitle>
        <AnnouncementGrid announcements={announcements} />
        <AnnouncementPagination page={page} pages={pages} />
      </>
    )
  }

  return (
    <section className="geo-diagonal py-10 sm:py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{content}</div>
    </section>
  )
}

function SectionLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-3 font-heading text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
      <span className="h-1 w-8 rounded-full bg-primary-500" aria-hidden="true" />
      {children}
    </h2>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-4 sm:mb-8">
      <h2 className="gradient-title font-heading text-2xl font-bold sm:text-3xl">{children}</h2>
      <span className="h-px flex-1 bg-linear-to-r from-neutral-300 to-transparent" aria-hidden="true" />
    </div>
  )
}

function AnnouncementGrid({ announcements }: { announcements: Announcement[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  )
}

function announcementPageHref(page: number): string {
  return page <= 1 ? '/announcements' : `/announcements?page=${page}`
}

function visiblePages(page: number, pages: number): number[] {
  const start = Math.max(1, Math.min(page - 2, pages - 4))
  const end = Math.min(pages, start + 4)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function AnnouncementPagination({ page, pages }: { page: number; pages: number }) {
  if (pages <= 1) return null

  const numbers = visiblePages(page, pages)

  return (
    <nav
      aria-label="Announcements pages"
      className="mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:mt-16 sm:gap-2"
    >
      <PaginationControl href={announcementPageHref(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Previous</span>
      </PaginationControl>
      {numbers.map((number) => (
        <PaginationControl key={number} href={announcementPageHref(number)} current={number === page}>
          {number}
        </PaginationControl>
      ))}
      <PaginationControl href={announcementPageHref(page + 1)} disabled={page >= pages}>
        <span className="sr-only sm:not-sr-only">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </PaginationControl>
    </nav>
  )
}

function PaginationControl({
  href,
  disabled,
  current,
  children,
}: {
  href: string
  disabled?: boolean
  current?: boolean
  children: React.ReactNode
}) {
  const base = 'inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-lg px-3 text-sm font-semibold'
  const className = current
    ? `${base} bg-primary-600 text-white shadow-sm`
    : `${base} border border-neutral-200 bg-white/80 text-neutral-700 transition-colors hover:border-primary-300 hover:text-primary-700`

  if (disabled) {
    return (
      <span aria-disabled="true" className={`${base} text-neutral-400`}>
        {children}
      </span>
    )
  }

  return (
    <Link href={href} aria-current={current ? 'page' : undefined} className={className}>
      {children}
    </Link>
  )
}
