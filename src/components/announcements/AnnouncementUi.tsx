import {
  announcementDateTime,
  formatAnnouncementDate,
  type Announcement,
} from '@/lib/announcements'

const categoryClasses: Record<string, string> = {
  News: 'border-primary-200 bg-primary-50 text-primary-800 dark:border-primary-400/40 dark:text-primary-200',
  Event: 'border-accent-200 bg-accent-50 text-accent-800',
  Housing: 'border-tertiary-200 bg-tertiary-50 text-tertiary-800 dark:border-tertiary-400/40 dark:text-tertiary-200',
  Personal: 'border-neutral-200 bg-neutral-100 text-neutral-700',
  Update: 'border-accent-200 bg-accent-50 text-primary-800 dark:text-accent-200',
}

export function CategoryBadge({ category }: { category: string }) {
  const classes = categoryClasses[category] ?? categoryClasses.Event
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {category}
    </span>
  )
}

export function AnnouncementMeta({
  announcement,
  className = '',
}: {
  announcement: Announcement
  className?: string
}) {
  const dateLabel = formatAnnouncementDate(announcement.publishedAt)
  return (
    <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 ${className}`}>
      <CategoryBadge category={announcement.category} />
      {dateLabel && (
        <time
          dateTime={announcementDateTime(announcement.publishedAt)}
          className="text-xs text-neutral-500 sm:text-sm"
        >
          {dateLabel}
        </time>
      )}
    </div>
  )
}

export function AnnouncementError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="card p-8 text-center sm:p-10">
        <h2 className="font-heading text-2xl font-bold text-neutral-900">Something went wrong</h2>
        <p className="mt-3 text-neutral-600">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-8 inline-flex items-center rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Try again
        </button>
      </div>
    </div>
  )
}

function SkeletonBar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded bg-neutral-100 ${className}`} />
}

export function AnnouncementGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="card overflow-hidden">
          <div className="aspect-[16/10] animate-pulse bg-primary-100" />
          <div className="space-y-3 p-5 sm:p-6">
            <SkeletonBar className="h-4 w-24 rounded-full" />
            <SkeletonBar className="h-6 w-4/5" />
            <SkeletonBar className="h-4 w-full" />
            <SkeletonBar className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AnnouncementListSkeleton({ featured }: { featured: boolean }) {
  if (!featured) return <AnnouncementGridSkeleton count={6} />

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
      <div className="card p-3 sm:p-4 lg:col-span-7">
        <div className="aspect-[16/10] animate-pulse rounded-xl bg-primary-100" />
        <div className="space-y-4 px-1 pb-2 pt-5 sm:px-2">
          <SkeletonBar className="h-4 w-32 rounded-full" />
          <SkeletonBar className="h-8 w-11/12" />
          <SkeletonBar className="h-8 w-2/3" />
          <SkeletonBar className="h-4 w-full" />
        </div>
      </div>
      <div className="card p-5 sm:p-6 lg:col-span-5">
        <SkeletonBar className="mb-4 h-4 w-28" />
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex gap-4 border-t border-neutral-200 py-4 first:border-t-0">
            <div className="aspect-[4/3] w-28 shrink-0 animate-pulse rounded-lg bg-primary-100 sm:w-36" />
            <div className="flex-1 space-y-3 pt-1">
              <SkeletonBar className="h-5 w-full" />
              <SkeletonBar className="h-5 w-3/4" />
              <SkeletonBar className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AnnouncementDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 aspect-video animate-pulse rounded-2xl bg-primary-100 sm:mb-10" />
      <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white/80 p-6 sm:p-10">
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-11/12" />
        <SkeletonBar className="h-4 w-4/5" />
        <SkeletonBar className="h-4 w-full" />
        <SkeletonBar className="h-4 w-2/3" />
      </div>
    </div>
  )
}
