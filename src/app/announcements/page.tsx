import type { Metadata } from 'next'
import Image from 'next/image'
import AnnouncementList from '@/components/announcements/AnnouncementList'
import { parseAnnouncementPage } from '@/lib/announcements'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}): Promise<Metadata> {
  const { page: pageParam } = await searchParams
  const page = parseAnnouncementPage(pageParam)

  return buildPageMetadata({
    title: page > 1 ? `News, page ${page}` : 'News',
    description: 'Announcements, events, housing, and other updates from GHAFRA Nord.',
    path: page > 1 ? `/announcements?page=${page}` : '/announcements',
  })
}

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = parseAnnouncementPage(pageParam)
  return (
    <>
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
          <div className="absolute inset-0 bg-linear-to-r from-tertiary-900/70 via-tertiary-900/45 to-tertiary-900/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-4 font-heading text-3xl font-bold sm:text-4xl md:text-5xl">News</h1>
          <p className="max-w-3xl text-base text-primary-100 sm:text-lg">
            Announcements, events, housing, and other updates from GHAFRA Nord.
          </p>
        </div>
      </section>
      <AnnouncementList page={page} />
    </>
  )
}
