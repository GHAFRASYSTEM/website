import Link from 'next/link'
import {
  announcementDateTime,
  announcementPreview,
  formatAnnouncementDate,
  type Announcement,
} from '@/lib/announcements'
import AnnouncementImage from '@/components/announcements/AnnouncementImage'
import { AnnouncementMeta } from '@/components/announcements/AnnouncementUi'

function announcementHref(announcement: Announcement): string {
  return `/announcements/${encodeURIComponent(announcement.id)}`
}

function ReadMore() {
  return (
    <span className="inline-flex items-center text-sm font-semibold text-primary-600 transition-transform group-hover:translate-x-1">
      Read more
      <svg
        className="ml-1 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </span>
  )
}

export function FeaturedAnnouncementCard({ announcement }: { announcement: Announcement }) {
  const preview = announcementPreview(announcement.body, 260)

  return (
    <Link href={announcementHref(announcement)} className="group card card-image flex h-full flex-col p-3 sm:p-4">
      <div className="card-img-wrap relative aspect-[16/10] overflow-hidden rounded-xl bg-primary-100">
        <AnnouncementImage
          src={announcement.image}
          alt={announcement.title}
          priority
          className="h-full w-full"
          iconClassName="h-16 w-16"
        />
      </div>
      <div className="flex flex-1 flex-col px-1 pb-2 pt-5 sm:px-2">
        <AnnouncementMeta announcement={announcement} className="mb-3" />
        <h2 className="break-words font-heading text-2xl font-bold leading-tight text-neutral-900 transition-colors group-hover:text-primary-700 sm:text-3xl lg:text-4xl">
          {announcement.title}
        </h2>
        {preview && (
          <p className="mt-3 line-clamp-3 leading-relaxed text-neutral-600 sm:text-[1.05rem]">{preview}</p>
        )}
        <div className="mt-4">
          <ReadMore />
        </div>
      </div>
    </Link>
  )
}

export function CompactAnnouncementItem({ announcement }: { announcement: Announcement }) {
  const dateLabel = formatAnnouncementDate(announcement.publishedAt)

  return (
    <Link
      href={announcementHref(announcement)}
      className="group flex gap-4 border-t border-neutral-200 py-4 first:border-t-0 first:pt-0 last:pb-0"
    >
      <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-lg bg-primary-100 sm:w-36">
        <AnnouncementImage
          src={announcement.image}
          alt=""
          className="h-full w-full transition-transform duration-500 group-hover:scale-105"
          iconClassName="h-7 w-7"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <h3 className="line-clamp-3 break-words font-heading text-base font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-primary-700 sm:text-lg">
          {announcement.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-neutral-500">
          <span className="font-semibold text-primary-600">{announcement.category}</span>
          {dateLabel && (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={announcementDateTime(announcement.publishedAt)}>{dateLabel}</time>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const preview = announcementPreview(announcement.body, 140)

  return (
    <Link href={announcementHref(announcement)} className="group card card-image flex h-full flex-col">
      <div className="card-img-wrap relative aspect-[16/10] bg-primary-100">
        <AnnouncementImage src={announcement.image} alt="" className="h-full w-full" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <AnnouncementMeta announcement={announcement} className="mb-3" />
        <h3 className="line-clamp-2 break-words font-heading text-lg font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-primary-700 sm:text-xl">
          {announcement.title}
        </h3>
        {preview && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600 sm:text-base">{preview}</p>}
        <div className="mt-auto pt-4">
          <ReadMore />
        </div>
      </div>
    </Link>
  )
}
