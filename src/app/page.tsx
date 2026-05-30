import Link from 'next/link'
import Image from 'next/image'
import { getHomeContent, getPrograms } from '@/lib/content'
import PhotoCarousel from '@/components/shared/PhotoCarousel'

export default function HomePage() {
  const home = getHomeContent()
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
          />
          <div className="absolute inset-0 bg-gradient-to-r from-tertiary-900/70 via-tertiary-900/45 to-tertiary-900/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {home.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
              {home.heroSubtitle}
            </p>
            <Link
              href={home.heroCta.link}
              className="inline-flex items-center px-6 py-3 text-lg font-semibold bg-accent-400 text-neutral-900 rounded-lg hover:bg-accent-500 transition-colors"
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

      <section className="relative overflow-hidden bg-neutral-900 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,195,50,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(193,8,50,0.24),transparent_34%)]" />
        <div className="absolute left-8 top-10 h-28 w-28 rounded-full border border-white/10 bg-white/5 blur-2xl" />
        <div className="absolute bottom-6 right-10 h-36 w-36 rounded-full border border-accent-300/20 bg-accent-400/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:px-8">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-1 text-sm font-medium tracking-[0.2em] text-accent-200 uppercase">
              {home.appDownloadSection.eyebrow}
            </span>
            <h2 className="mt-6 max-w-2xl font-heading text-3xl font-bold leading-tight md:text-4xl">
              {home.appDownloadSection.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-200">
              {home.appDownloadSection.body}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link
                href={home.appDownloadSection.appStoreButton.link}
                className="group inline-flex min-w-[220px] items-center gap-4 rounded-2xl border border-white/15 bg-white px-5 py-4 text-left text-neutral-900 shadow-lg shadow-black/10 transition-transform duration-300 hover:-translate-y-1 hover:bg-neutral-100"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                  <svg
                    aria-hidden="true"
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.365 12.338c.02 2.206 1.934 2.94 1.955 2.949-.016.052-.306 1.052-1.009 2.084-.608.892-1.24 1.78-2.234 1.798-.976.018-1.29-.579-2.408-.579-1.119 0-1.468.561-2.39.597-.959.036-1.69-.958-2.303-1.846-1.254-1.812-2.212-5.119-.926-7.354.638-1.11 1.78-1.814 3.021-1.832.941-.018 1.829.633 2.408.633.578 0 1.664-.783 2.805-.668.477.02 1.815.193 2.674 1.451-.069.043-1.597.932-1.593 2.767m-1.978-5.128c.51-.618.854-1.478.76-2.338-.734.03-1.62.488-2.146 1.106-.473.547-.888 1.421-.777 2.26.819.063 1.652-.416 2.163-1.028" />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                    {home.appDownloadSection.appStoreButton.pretitle}
                  </span>
                  <span className="font-heading text-2xl font-semibold leading-none">
                    {home.appDownloadSection.appStoreButton.title}
                  </span>
                </span>
              </Link>
              <Link
                href={home.appDownloadSection.googlePlayButton.link}
                className="group inline-flex min-w-[220px] items-center gap-4 rounded-2xl border border-white/15 bg-transparent px-5 py-4 text-left text-white shadow-lg shadow-black/10 ring-1 ring-inset ring-white/10 transition-transform duration-300 hover:-translate-y-1 hover:bg-white/6"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-accent-300">
                  <svg
                    aria-hidden="true"
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M4.756 3.431 13.98 12l-9.224 8.569a1.376 1.376 0 0 1-.404-.977V4.408c0-.384.149-.746.404-.977Z"
                      fill="#34A853"
                    />
                    <path
                      d="M16.874 14.685 7.81 23.1l10.485-5.735-1.421-2.68Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="m18.295 6.636-10.485-5.735 9.064 8.415 1.421-2.68Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M21.157 10.948c.56.307.56 1.097 0 1.404l-2.862 1.569L15.96 12l2.335-1.921 2.862 1.569Z"
                      fill="#4285F4"
                    />
                  </svg>
                </span>
                <span className="flex flex-col">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-300">
                    {home.appDownloadSection.googlePlayButton.pretitle}
                  </span>
                  <span className="font-heading text-2xl font-semibold leading-none">
                    {home.appDownloadSection.googlePlayButton.title}
                  </span>
                </span>
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[19.25rem]">
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-3xl border border-accent-300/30 bg-accent-400/20 blur-2xl" />
            <div className="absolute -right-8 bottom-8 h-28 w-28 rounded-full border border-primary-300/30 bg-primary-400/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 p-3 shadow-2xl shadow-black/30 backdrop-blur-sm">
              <div className="rounded-[1.6rem] bg-linear-to-br from-neutral-950 via-neutral-900 to-tertiary-950 p-4">
                <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/15" />
                <div className="relative aspect-[37/80] overflow-hidden rounded-[1.6rem] border border-white/10 bg-neutral-950 shadow-lg shadow-black/25">
                  <Image
                    src={home.appDownloadSection.appImage}
                    alt={home.appDownloadSection.appImageAlt}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24 bg-gradient-to-br from-accent-400 to-accent-600 text-neutral-900 cta-gradient-top overflow-hidden">
        <div className="cta-geo-shapes" aria-hidden="true">
          <div className="cta-shape cta-shape-1" />
          <div className="cta-shape cta-shape-2" />
          <div className="cta-shape cta-shape-3" />
          <div className="cta-shape cta-shape-4" />
          <div className="cta-shape cta-shape-5" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-neutral-900">
            {home.ctaTitle}
          </h2>
          <p className="text-lg text-neutral-800 max-w-2xl mx-auto mb-8">
            {home.ctaBody}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={home.memberCta.link}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              {home.memberCta.text}
            </Link>
            <Link
              href={home.ctaButton.link}
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors border border-neutral-200"
            >
              {home.ctaButton.text}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
