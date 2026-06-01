import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  getAboutContent,
  getTeamMemberBySlug,
  getTeamMembers,
} from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo'

const about = getAboutContent()

export function generateStaticParams() {
  return getTeamMembers().map((member) => ({ slug: member.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const member = getTeamMemberBySlug(slug)
  if (!member) return {}

  const description = member.body.replace(/\s+/g, ' ').trim().slice(0, 160)

  return buildPageMetadata({
    title: member.name,
    description,
    path: `/about/executives/${member.slug}`,
    image: member.image,
    imageAlt: `${member.name} - ${member.role}`,
  })
}

export default async function ExecutiveProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const member = getTeamMemberBySlug(slug)
  if (!member) notFound()

  const contentHtml = await markdownToHtml(member.body)

  return (
    <>
      <section className="relative overflow-hidden bg-primary-900 py-16 text-white sm:py-20 md:py-24">
        <div className="absolute inset-0">
          <Image
            src="/bg-image.png"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tertiary-900/70 via-tertiary-900/45 to-tertiary-900/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/about"
            className="mb-6 inline-flex items-center text-sm text-white/75 transition-colors hover:text-white"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            {about.executiveDetailBackLinkText}
          </Link>

          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-xs overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl shadow-black/20">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 100vw, 320px"
              />
            </div>
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-accent-200">
                {about.executiveDetailLabel}
              </p>
              <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
                {member.name}
              </h1>
              <p className="mt-4 text-lg font-medium text-primary-100 sm:text-xl">
                {member.role}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="geo-grid py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <article className="card p-6 sm:p-8 md:p-10">
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>
        </div>
      </section>
    </>
  )
}
