export interface SiteSettings {
  siteName: string
  siteUrl: string
  siteDescription: string
  navigation: {
    mainLinks: { name: string; href: string }[]
    memberButton: { text: string; href: string }
    donateButton: { text: string; href: string }
  }
  footer: {
    quickLinksTitle: string
    quickLinks: { name: string; href: string }[]
    getInvolvedTitle: string
    getInvolvedLinks: { name: string; href: string }[]
    contactTitle: string
    copyrightText: string
  }
  notFound: {
    code: string
    title: string
    message: string
    buttonText: string
    buttonHref: string
  }
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
    secondaryAppImage?: string
    secondaryAppImageAlt?: string
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
  executiveDetailBackLinkText: string
  executiveDetailLabel: string
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
  donationUi: {
    customSectionEyebrow: string
    customSectionTitle: string
    customSectionDescription: string
    customAmountLabel: string
    fixedButtonPrefix: string
    readyMessage: string
    minimumMessage: string
    modalTitle: string
    modalMessage: string
    modalCloseText: string
    errors: {
      emptyAmount: string
      invalidAmount: string
      minimumAmount: string
    }
  }
  membershipTitle: string
  membershipBody: string
  membershipForm: {
    title: string
    intro: string
    successTitle: string
    successMessage: string
    errorIntro: string
    submitText: string
    submittingText: string
    fields: {
      firstNameLabel: string
      firstNamePlaceholder: string
      lastNameLabel: string
      lastNamePlaceholder: string
      emailLabel: string
      emailPlaceholder: string
      phoneLabel: string
      phonePlaceholder: string
      statusLabel: string
      statusPlaceholder: string
      studentOption: string
      workingProfessionalOption: string
      retiredOption: string
      otherOption: string
      schoolLabel: string
      schoolPlaceholder: string
      programLabel: string
      programPlaceholder: string
      currentRoleLabel: string
      currentRolePlaceholder: string
      previousRoleLabel: string
      previousRolePlaceholder: string
      cityLabel: string
      cityPlaceholder: string
      specialTalentLabel: string
      specialTalentOptionalLabel: string
      specialTalentPlaceholder: string
      messageLabel: string
      messagePlaceholder: string
    }
  }
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
  addressLabel: string
  phoneLabel: string
  emailLabel: string
  officeHoursLabel: string
  address: string
  phone: string
  email: string
  officeHours: string
  form: {
    title: string
    successTitle: string
    successMessage: string
    errorIntro: string
    submitText: string
    sendingText: string
    fields: {
      nameLabel: string
      namePlaceholder: string
      emailLabel: string
      emailPlaceholder: string
      subjectLabel: string
      subjectPlaceholder: string
      messageLabel: string
      messagePlaceholder: string
    }
  }
}

export interface ProgramsPageContent {
  metaDescription: string
  title: string
  subtitle: string
  detailBackLinkText: string
  integrationImageOneAlt: string
  integrationImageTwoAlt: string
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
