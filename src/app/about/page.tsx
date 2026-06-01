import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAboutContent, getTeamMembers } from '@/lib/content'
import FAQ from '@/components/about/FAQ'
import { buildPageMetadata } from '@/lib/seo'

const about = getAboutContent()

export const metadata: Metadata = buildPageMetadata({
  title: 'About Us',
  description: about.metaDescription,
  path: '/about',
  imageAlt: 'About GHAFRA Nord',
})

const iconMap: Record<string, React.ReactNode> = {
  heart: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  ),
  globe: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  ),
  eye: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  users: (
    <svg
      className="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  ),
}

export default function AboutPage() {
  const team = getTeamMembers()

  return (
    <>
      <section className="relative bg-primary-900 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/bg-image.png"
            alt=""
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-tertiary-900/70 via-tertiary-900/45 to-tertiary-900/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-2xl mb-6">
            <Image
              src="/images/extracted/image-12.jpg"
              alt="GHAFRA Nord Logo"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold drop-shadow-lg">
            {about.title}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 geo-grid">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="card-mission card-mission-green">
              <h2 className="font-heading text-2xl font-bold gradient-title mb-4">
                {about.missionSectionTitle}
              </h2>
              <p className="text-neutral-700 leading-relaxed">
                {about.mission}
              </p>
            </div>
            <div className="card-mission card-mission-gold">
              <h2 className="font-heading text-2xl font-bold gradient-title mb-4">
                {about.visionSectionTitle}
              </h2>
              <p className="text-neutral-700 leading-relaxed">{about.vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 geo-dots">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-title mb-6">
              {about.historyTitle}
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {about.historyBody}
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {about.timelineEvents.map((event, i) => (
              <div key={i} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-tertiary-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {event.year}
                  </div>
                  {i < about.timelineEvents.length - 1 && (
                    <div className="w-0.5 flex-1 bg-tertiary-200 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-heading font-semibold text-lg text-neutral-900">
                    {event.title}
                  </h3>
                  <p className="text-neutral-600 mt-1">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 geo-diagonal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-title text-center mb-12">
            {about.valuesSectionTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {about.values.map((value, i) => (
              <div key={i} className="card-value text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 mb-4 shadow-sm">
                  {iconMap[value.icon] || iconMap.heart}
                </div>
                <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 geo-cross">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-title text-center mb-12">
            {about.executivesSectionTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <Link
                key={member.slug}
                href={`/about/executives/${member.slug}`}
                className="card card-team cursor-pointer transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="card-img-wrap relative h-64 bg-neutral-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  />
                </div>
                <div className="flex h-full flex-col p-5">
                  <h3 className="font-heading font-semibold text-lg text-neutral-900">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium mb-2">
                    <span className="inline-block bg-gradient-to-r from-tertiary-600 to-tertiary-500 bg-clip-text text-transparent">
                      {member.role}
                    </span>
                  </p>
                  <p className="text-neutral-600 text-sm line-clamp-3">
                    {member.body.trim()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 geo-hexagon">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block w-16 h-1 bg-primary-500 rounded-full mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold gradient-title mb-4">
              {about.faqSectionTitle}
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              {about.faqSectionSubtitle}
            </p>
          </div>
          <FAQ faqs={about.faqs} />
        </div>
      </section>
    </>
  )
}
