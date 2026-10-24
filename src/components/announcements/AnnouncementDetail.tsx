'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
import {
  AnnouncementsRequestError,
  announcementBlocks,
  announcementDateTime,
  announcementReadingMinutes,
  fetchAnnouncement,
  fetchAnnouncements,
  formatAnnouncementDate,
  type Announcement,
} from '@/lib/announcements'
import AnnouncementCard from '@/components/announcements/AnnouncementCard'
import AnnouncementImage from '@/components/announcements/AnnouncementImage'
import {
  AnnouncementDetailSkeleton,
  AnnouncementError,
  CategoryBadge,
} from '@/components/announcements/AnnouncementUi'

export default function AnnouncementDetail({ id }: { id: string }) {
  const [retryCount, setRetryCount] = useState(0)
  const [result, setResult] = useState<{
    key: string
    announcement: Announcement | null
    error: AnnouncementsRequestError | null
  } | null>(null)

  const requestKey = `${id}:${retryCount}`

  useEffect(() => {
    let cancelled = false
    const key = requestKey

    fetchAnnouncement(id)
      .then((announcement) => {
        if (!cancelled) setResult({ key, announcement, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setResult({
          key,
          announcement: null,
          error:
            err instanceof AnnouncementsRequestError
              ? err
              : new AnnouncementsRequestError(
                  'This announcement could not be loaded. Please try again.',
                  0,
                ),
        })
      })

    return () => {
      cancelled = true
    }
  }, [id, requestKey])

  const current = result?.key === requestKey ? result : null
  const announcement = current?.announcement ?? null
  const error = current?.error ?? null

  useEffect(() => {
    if (!announcement) return
    const previousTitle = document.title
    document.title = `${announcement.title} | GHAFRA Nord`
    return () => {
      document.title = previousTitle
    }
  }, [announcement])

  if (!current) {
    return (
      <>
        <DetailHero>
          <div className="space-y-3">
            <div className="h-5 w-40 animate-pulse rounded-full bg-white/20" />
            <div className="h-9 w-full max-w-2xl animate-pulse rounded bg-white/20" />
            <div className="h-9 w-2/3 max-w-xl animate-pulse rounded bg-white/20" />
          </div>
        </DetailHero>
        <section className="geo-grid py-10 sm:py-14 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnnouncementDetailSkeleton />
          </div>
        </section>
      </>
    )
  }

  if (error) {
    return (
      <>
        <DetailHero>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">News</h1>
        </DetailHero>
        <section className="geo-grid py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnnouncementError
              message={error.message || 'This announcement could not be loaded. Please try again.'}
              onRetry={() => setRetryCount((count) => count + 1)}
            />
          </div>
        </section>
      </>
    )
  }

  if (!announcement) {
    return (
      <>
        <DetailHero>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">Announcement not found</h1>
        </DetailHero>
        <section className="geo-grid py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="card p-8 text-center sm:p-10">
              <p className="text-neutral-600">
                This announcement could not be found. It may have been removed.
              </p>
              <Link
                href="/announcements"
                className="mt-8 inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Back to news
              </Link>
            </div>
          </div>
        </section>
      </>
    )
  }

  const blocks = announcementBlocks(announcement.body)
  const dateLabel = formatAnnouncementDate(announcement.publishedAt)
  const minutes = announcementReadingMinutes(announcement.body)

  return (
    <>
      <DetailHero>
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-primary-100">
          <CategoryBadge category={announcement.category} />
          {dateLabel && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <time dateTime={announcementDateTime(announcement.publishedAt)}>{dateLabel}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {minutes} min read
          </span>
        </div>
        <h1 className="max-w-4xl wrap-break-word font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {announcement.title}
        </h1>
      </DetailHero>

      <section className="geo-grid py-10 sm:py-14 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {announcement.image && (
            <figure className="mb-8 overflow-hidden rounded-2xl bg-primary-100 shadow-lg shadow-black/10 sm:mb-10">
              <AnnouncementImage
                key={announcement.image}
                src={announcement.image}
                alt={announcement.title}
                priority
                className="aspect-video h-auto w-full"
                iconClassName="h-16 w-16"
              />
            </figure>
          )}

          <article className="rounded-2xl border border-neutral-200 bg-white/80 px-5 py-8 shadow-sm backdrop-blur-md sm:px-10 sm:py-12">
            <div className="mx-auto max-w-[68ch] space-y-5 wrap-break-word text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              {blocks.map((block, index) =>
                block.type === 'list' ? (
                  <ul key={index} className="list-disc space-y-2 pl-6 marker:text-primary-500">
                    {block.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={index} className="whitespace-pre-line">
                    {block.text}
                  </p>
                ),
              )}
            </div>
          </article>

          <div className="mt-8 flex justify-center sm:mt-10">
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white/80 px-5 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to all news
            </Link>
          </div>
        </div>
      </section>

      <MoreAnnouncements currentId={announcement.id} />
    </>
  )
}

function MoreAnnouncements({ currentId }: { currentId: string }) {
  const [result, setResult] = useState<{ id: string; items: Announcement[] } | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchAnnouncements(1)
      .then(({ announcements }) => {
        if (cancelled) return
        setResult({
          id: currentId,
          items: announcements.filter((item) => item.id !== currentId).slice(0, 3),
        })
      })
      .catch(() => {
        if (!cancelled) setResult({ id: currentId, items: [] })
      })

    return () => {
      cancelled = true
    }
  }, [currentId])

  const items = result?.id === currentId ? result.items : []
  if (items.length === 0) return null

  return (
    <section aria-labelledby="more-news" className="geo-dots py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-4 sm:mb-8">
          <h2 id="more-news" className="gradient-title font-heading text-2xl font-bold sm:text-3xl">
            More news
          </h2>
          <span className="h-px flex-1 bg-linear-to-r from-neutral-300 to-transparent" aria-hidden="true" />
          <Link
            href="/announcements"
            className="shrink-0 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item) => (
            <AnnouncementCard key={item.id} announcement={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function DetailHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-primary-900 py-12 text-white sm:py-16 md:py-20">
      <div className="absolute inset-0">
        <Image
          src="/bg-image.png"
          alt=""
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-tertiary-900/80 via-tertiary-900/55 to-tertiary-900/35" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/announcements"
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-white/75 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to news
        </Link>
        {children}
      </div>
    </section>
  )
}
