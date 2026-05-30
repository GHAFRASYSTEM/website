export interface SiteSettings {
  siteName: string
  siteUrl: string
  siteDescription: string
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
  contactEmail: string
  contactPhone: string
  address: string
}

export interface HomeContent {
  metaDescription: string
  heroTitle: string
  heroSubtitle: string
  heroCta: { text: string; link: string }
  missionTitle: string
  missionBody: string
  missionImage: string
  featuredProgramSlugs: string[]
  whatWeDoTitle: string
  whatWeDoSubtitle: string
  viewAllActivitiesText: string
  viewAllActivitiesLink: string
  galleryTitle: string
  gallerySubtitle: string
  galleryImages: { src: string; alt: string }[]
  appDownloadSection: {
    eyebrow: string
    title: string
    body: string
    appImage: string
    appImageAlt: string
    appStoreButton: {
      pretitle: string
      title: string
      link: string
    }
    googlePlayButton: {
      pretitle: string
      title: string
      link: string
    }
  }
  ctaTitle: string
  ctaBody: string
  ctaButton: { text: string; link: string }
  memberCta: { text: string; link: string }
}

export interface AboutContent {
  metaDescription: string
  title: string
  missionSectionTitle: string
  visionSectionTitle: string
  historyTitle: string
  historyBody: string
  mission: string
  vision: string
  valuesSectionTitle: string
  values: { title: string; description: string; icon: string }[]
  executivesSectionTitle: string
  timelineEvents: {
    year: string
    title: string
    description: string
  }[]
  faqSectionTitle: string
  faqSectionSubtitle: string
  faqs: { question: string; answer: string }[]
}

export interface TeamMember {
  slug: string
  name: string
  role: string
  image: string
  body: string
  order: number
}

export interface Program {
  slug: string
  title: string
  excerpt: string
  image: string
  featured: boolean
  body: string
}

export interface GetInvolvedContent {
  metaDescription: string
  title: string
  donateTitle: string
  donateBody: string
  donateOptions: {
    amount: string
    description: string
    isCustomAmount?: boolean
    inputPlaceholder?: string
    buttonText?: string
    minAmount?: number
  }[]
  membershipTitle: string
  membershipBody: string
  membershipInfo: {
    title: string
    description: string
  }[]
  memberCarouselTitle: string
  memberCarouselSubtitle: string
  memberImages: string[]
}

export interface ContactContent {
  metaDescription: string
  title: string
  subtitle: string
  contactInfoTitle: string
  address: string
  phone: string
  email: string
  officeHours: string
}

export interface ProgramsPageContent {
  metaDescription: string
  title: string
  subtitle: string
  programsSectionTitle: string
  programsSectionSubtitle: string
  eventsSectionTitle: string
  eventsSectionSubtitle: string
  events: {
    title: string
    when: string
    description: string
    icon: string
  }[]
}
