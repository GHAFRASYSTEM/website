import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  getPrograms,
  getProgramBySlug,
  getProgramsPageContent,
} from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo'

const programsPage = getProgramsPageContent()

export async function generateStaticParams() {
  return getPrograms().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) return {}
  return buildPageMetadata({
    title: program.title,
    description: program.excerpt,
    path: `/programs/${program.slug}`,
    image: program.image,
    imageAlt: program.title,
  })
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const program = getProgramBySlug(slug)
  if (!program) notFound()

  const contentHtml = await markdownToHtml(program.body)

  return (
    <>
      <section className="relative bg-primary-900 text-white py-16 md:py-24 overflow-hidden">
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
            href="/programs"
            className="inline-flex items-center text-white/70 hover:text-white text-sm mb-4 transition-colors"
          >
            <svg
              className="mr-1 w-4 h-4"
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
            {programsPage.detailBackLinkText}
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            {program.title}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 geo-grid">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {slug !== 'integration-support' && (
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-10 bg-primary-100">
              <Image
                src={program.image}
                alt={program.title}
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 100vw, 768px"
              />
            </div>
          )}
          {slug === 'integration-support' ? (
            <>
              {(() => {
                const splitIndex = contentHtml.indexOf('<h2')
                const introPart =
                  splitIndex >= 0
                    ? contentHtml.slice(0, splitIndex)
                    : contentHtml
                const restPart =
                  splitIndex >= 0 ? contentHtml.slice(splitIndex) : ''
                return (
                  <>
                    <div
                      className="prose-content"
                      dangerouslySetInnerHTML={{ __html: introPart }}
                    />
                    <div className="flex flex-col gap-8 my-10">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-primary-100">
                        <Image
                          src="/images/tip-0.png"
                          alt={programsPage.integrationImageOneAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1023px) 100vw, 768px"
                        />
                      </div>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-primary-100">
                        <Image
                          src="/images/tip-1.png"
                          alt={programsPage.integrationImageTwoAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1023px) 100vw, 768px"
                        />
                      </div>
                    </div>
                    <div
                      className="prose-content"
                      dangerouslySetInnerHTML={{ __html: restPart }}
                    />
                  </>
                )
              })()}
            </>
          ) : (
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}
        </div>
      </section>
    </>
  )
}
