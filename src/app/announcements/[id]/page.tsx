import type { Metadata } from 'next'
import AnnouncementDetail from '@/components/announcements/AnnouncementDetail'
import { announcementPreview, fetchAnnouncement } from '@/lib/announcements'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  try {
    const announcement = await fetchAnnouncement(id)
    if (!announcement) return { title: 'Announcement' }
    return buildPageMetadata({
      title: announcement.title,
      description: announcementPreview(announcement.body) || announcement.title,
      path: `/announcements/${announcement.id}`,
      image: announcement.image ?? undefined,
      imageAlt: announcement.title,
    })
  } catch {
    return { title: 'Announcement' }
  }
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AnnouncementDetail id={id} />
}
