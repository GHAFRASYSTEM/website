import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getHomeContent, getPrograms } from '@/lib/content'
import PhotoCarousel from '@/components/shared/PhotoCarousel'
import AppDownloadSection from '@/components/shared/AppDownloadSection'
import { buildPageMetadata } from '@/lib/seo'

const home = getHomeContent()

export const metadata: Metadata = buildPageMetadata({
  description: home.metaDescription,
  path: '/',
  image: home.galleryImages[0]?.src,
  imageAlt: home.galleryImages[0]?.alt || home.heroTitle,
})

export default function HomePage() {
  const programs = getPrograms().filter((p) =>
    home.featuredProgramSlugs.includes(p.slug),
  )

  return (
    <>
      <section className="relative bg-primary-900 text-white overflow-hidden">
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
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 md:py-32 lg:px-8 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="mb-6 font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {home.heroTitle}
            </h1>
            <p className="mb-8 text-base leading-relaxed text-primary-100 sm:text-lg md:text-xl">
              {home.heroSubtitle}
            </p>
            <Link
              href={home.heroCta.link}
              className="inline-flex w-full items-center justify-center rounded-lg bg-accent-400 px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-accent-500 sm:w-auto sm:text-lg"
            >
              {home.heroCta.text}
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 geo-grid">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
            <div className="relative w-full md:w-2/5 aspect-[4/3] flex-shrink-0 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={home.missionImage}
                alt={home.missionTitle}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 100vw, 40vw"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block w-16 h-1 bg-primary-500 rounded-full mb-6" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-title mb-6">
                {home.missionTitle}
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                {home.missionBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      <AppDownloadSection content={home.appDownloadSection} />

      <section className="py-16 md:py-24 geo-dots">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-title mb-4">
              {home.whatWeDoTitle}
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              {home.whatWeDoSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => (
              <Link
                key={program.slug}
                href={`/programs/${program.slug}`}
                className="group card card-image border-0"
              >
                <div className="card-img-wrap relative h-48 bg-primary-100">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors mb-2">
                    {program.title}
                  </h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {program.excerpt}
                  </p>
                  <span className="inline-flex items-center text-primary-600 text-sm font-medium mt-4 group-hover:translate-x-1 transition-transform">
                    Learn more
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href={home.viewAllActivitiesLink}
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              {home.viewAllActivitiesText}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 geo-hexagon">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-title mb-4">
              {home.galleryTitle}
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              {home.gallerySubtitle}
            </p>
          </div>
          <PhotoCarousel images={home.galleryImages} />
        </div>
      </section>

      <section className="relative py-16 md:py-24 bg-gradient-to-br from-accent-400 to-accent-600 text-black cta-gradient-top overflow-hidden">
        <div className="cta-geo-shapes" aria-hidden="true">
          <div className="cta-shape cta-shape-1" />
          <div className="cta-shape cta-shape-2" />
          <div className="cta-shape cta-shape-3" />
          <div className="cta-shape cta-shape-4" />
          <div className="cta-shape cta-shape-5" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-black">
            {home.ctaTitle}
          </h2>
          <p className="text-lg text-black/80 max-w-2xl mx-auto mb-8">
            {home.ctaBody}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={home.memberCta.link}
              className="inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-neutral-800 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              {home.memberCta.text}
            </Link>
            <Link
              href={home.ctaButton.link}
              className="inline-flex w-full items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-base font-semibold text-black transition-colors hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              {home.ctaButton.text}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
