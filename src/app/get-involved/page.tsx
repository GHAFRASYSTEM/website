import type { Metadata } from 'next'
import Image from 'next/image'
import { getGetInvolvedContent, getSiteSettings } from '@/lib/content'
import DonationOptions from '@/components/get-involved/DonationOptions'
import MemberCarousel from '@/components/shared/MemberCarousel'
import MembershipForm from '@/components/get-involved/MembershipForm'
import { buildPageMetadata } from '@/lib/seo'

const content = getGetInvolvedContent()
const settings = getSiteSettings()

export const metadata: Metadata = buildPageMetadata({
  title: 'Get Involved',
  description: content.metaDescription,
  path: '/get-involved',
  imageAlt: 'Get involved with GHAFRA Nord',
})

export default function GetInvolvedPage() {
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
          <div className="absolute inset-0 bg-linear-to-r from-tertiary-900/70 via-tertiary-900/45 to-tertiary-900/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            {content.title}
          </h1>
        </div>
      </section>

      <section id="donate" className="py-16 md:py-24 geo-hexagon scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 text-accent-700 mb-4">
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
            </div>
            <h2 className="font-heading text-2xl font-bold gradient-title mb-4 sm:text-3xl md:text-4xl">
              {content.donateTitle}
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {content.donateBody}
            </p>
          </div>
          <DonationOptions
            options={content.donateOptions}
            ui={content.donationUi}
          />
        </div>
      </section>

      <section className="pt-16 pb-8 md:pt-24 md:pb-12 geo-dots">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block w-16 h-1 bg-primary-500 rounded-full mb-6" />
            <h2 className="font-heading text-2xl font-bold gradient-title mb-4 sm:text-3xl md:text-4xl">
              {content.memberCarouselTitle}
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              {content.memberCarouselSubtitle}
            </p>
          </div>
          <MemberCarousel images={content.memberImages} />
        </div>
      </section>

      <section
        id="membership"
        className="pt-8 pb-16 md:pt-12 md:pb-24 geo-cross scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tertiary-100 text-tertiary-600 mb-4">
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
            </div>
            <h2 className="font-heading text-2xl font-bold gradient-title mb-4 sm:text-3xl md:text-4xl">
              {content.membershipTitle}
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              {content.membershipBody}
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
            {content.membershipInfo.map((info, i) => (
              <div key={i} className="card card-info p-6">
                <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {info.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-2xl sm:mt-12">
            <MembershipForm
              content={content.membershipForm}
              contactEmail={settings.contactEmail}
            />
          </div>
        </div>
      </section>
    </>
  )
}
