'use client'

import { useState, type FormEvent } from 'react'
import type { ContactContent } from '@/lib/types'

const FORMSPREE_CONTACT_FORM_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_FORM_ID

const fieldClassName =
  'w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500'

export default function ContactForm({
  content,
  contactEmail,
}: {
  content: ContactContent['form']
  contactEmail: string
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch(
        `https://formspree.io/f/${FORMSPREE_CONTACT_FORM_ID}`,
        {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        },
      )

      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl bg-primary-50 p-8 text-center dark:bg-primary-950/30">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-300">
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
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h3 className="mb-2 font-heading text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          {content.successTitle}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-200">
          {content.successMessage}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="membership-form-border rounded-xl bg-neutral-50 p-5 sm:p-8 dark:bg-[#101916] dark:text-neutral-100"
    >
      <h2 className="font-heading text-2xl font-bold gradient-title mb-6">
        {content.title}
      </h2>

      {status === 'error' && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200">
          {content.errorIntro}{' '}
          <a href={`mailto:${contactEmail}`} className="font-medium underline">
            {contactEmail}
          </a>
        </div>
      )}

      {/* Honeypot field — hidden from humans, catches bots */}
      <input
        type="text"
        name="_gotcha"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <input type="hidden" name="_subject" value="New Contact Message" />
      <input type="hidden" name="formType" value="contact" />

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-50"
          >
            {content.fields.nameLabel}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={fieldClassName}
            placeholder={content.fields.namePlaceholder}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-50"
          >
            {content.fields.emailLabel}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={fieldClassName}
            placeholder={content.fields.emailPlaceholder}
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-50"
          >
            {content.fields.subjectLabel}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            className={fieldClassName}
            placeholder={content.fields.subjectPlaceholder}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-50"
          >
            {content.fields.messageLabel}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className={`${fieldClassName} resize-vertical`}
            placeholder={content.fields.messagePlaceholder}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full px-6 py-3 text-base font-semibold text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed gradient-btn"
        >
          {status === 'sending' ? content.sendingText : content.submitText}
        </button>
      </div>
    </form>
  )
}
