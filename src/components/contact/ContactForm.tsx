'use client'

import { useState, type FormEvent } from 'react'
import type { ContactContent } from '@/lib/types'

const FORMSPREE_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_FORM_ID ||
  process.env.NEXT_PUBLIC_FORMSPREE_ID

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
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

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
      <div className="bg-primary-50 rounded-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
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
        <h3 className="font-heading text-xl font-semibold text-neutral-900 mb-2">
          {content.successTitle}
        </h3>
        <p className="text-neutral-600">{content.successMessage}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-50 rounded-xl p-8 membership-form-border"
    >
      <h2 className="font-heading text-2xl font-bold gradient-title mb-6">
        {content.title}
      </h2>

      {status === 'error' && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
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
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.nameLabel}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors placeholder:text-neutral-400"
            placeholder={content.fields.namePlaceholder}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.emailLabel}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors placeholder:text-neutral-400"
            placeholder={content.fields.emailPlaceholder}
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.subjectLabel}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors placeholder:text-neutral-400"
            placeholder={content.fields.subjectPlaceholder}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.messageLabel}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-vertical placeholder:text-neutral-400"
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
