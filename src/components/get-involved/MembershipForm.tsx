'use client'

import { useState, type FormEvent } from 'react'
import type { GetInvolvedContent } from '@/lib/types'

const FORMSPREE_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_MEMBERSHIP_FORM_ID ||
  process.env.NEXT_PUBLIC_FORMSPREE_ID

export default function MembershipForm({
  content,
  contactEmail,
}: {
  content: GetInvolvedContent['membershipForm']
  contactEmail: string
}) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [memberStatus, setMemberStatus] = useState('')

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
        setMemberStatus('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="bg-tertiary-50 rounded-xl p-8 text-center">
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
      <h3 className="font-heading text-2xl font-bold gradient-title mb-2">
        {content.title}
      </h3>
      <p className="text-neutral-500 text-sm mb-6">{content.intro}</p>

      {status === 'error' && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {content.errorIntro}{' '}
          <a href={`mailto:${contactEmail}`} className="font-medium underline">
            {contactEmail}
          </a>
        </div>
      )}

      {/* Hidden field to identify this as a membership form */}
      <input type="hidden" name="_subject" value="New Membership Application" />
      <input type="hidden" name="formType" value="membership" />

      {/* Honeypot field — hidden from humans, catches bots */}
      <input
        type="text"
        name="_gotcha"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="member-first-name"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              {content.fields.firstNameLabel}
            </label>
            <input
              type="text"
              id="member-first-name"
              name="firstName"
              required
              className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors placeholder:text-neutral-400"
              placeholder={content.fields.firstNamePlaceholder}
            />
          </div>
          <div>
            <label
              htmlFor="member-last-name"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              {content.fields.lastNameLabel}
            </label>
            <input
              type="text"
              id="member-last-name"
              name="lastName"
              required
              className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors placeholder:text-neutral-400"
              placeholder={content.fields.lastNamePlaceholder}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="member-email"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.emailLabel}
          </label>
          <input
            type="email"
            id="member-email"
            name="email"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors placeholder:text-neutral-400"
            placeholder={content.fields.emailPlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="member-phone"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.phoneLabel}
          </label>
          <input
            type="tel"
            id="member-phone"
            name="phone"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors placeholder:text-neutral-400"
            placeholder={content.fields.phonePlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="member-status"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.statusLabel}
          </label>
          <select
            id="member-status"
            name="memberStatus"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors"
            value={memberStatus}
            onChange={(e) => setMemberStatus(e.target.value)}
          >
            <option value="" disabled>
              {content.fields.statusPlaceholder}
            </option>
            <option value="Student">{content.fields.studentOption}</option>
            <option value="Working Professional">
              {content.fields.workingProfessionalOption}
            </option>
            <option value="Retired">{content.fields.retiredOption}</option>
            <option value="Other">{content.fields.otherOption}</option>
          </select>
        </div>

        {memberStatus === 'Student' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="member-school"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                {content.fields.schoolLabel}
              </label>
              <input
                type="text"
                id="member-school"
                name="school"
                required
                className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors placeholder:text-neutral-400"
                placeholder={content.fields.schoolPlaceholder}
              />
            </div>
            <div>
              <label
                htmlFor="member-program"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                {content.fields.programLabel}
              </label>
              <input
                type="text"
                id="member-program"
                name="program"
                required
                className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors placeholder:text-neutral-400"
                placeholder={content.fields.programPlaceholder}
              />
            </div>
          </div>
        )}

        {memberStatus === 'Working Professional' && (
          <div>
            <label
              htmlFor="member-role"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              {content.fields.currentRoleLabel}
            </label>
            <input
              type="text"
              id="member-role"
              name="currentRole"
              required
              className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors placeholder:text-neutral-400"
              placeholder={content.fields.currentRolePlaceholder}
            />
          </div>
        )}

        {memberStatus === 'Retired' && (
          <div>
            <label
              htmlFor="member-previous-role"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              {content.fields.previousRoleLabel}
            </label>
            <input
              type="text"
              id="member-previous-role"
              name="previousRole"
              required
              className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors placeholder:text-neutral-400"
              placeholder={content.fields.previousRolePlaceholder}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="member-city"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.cityLabel}
          </label>
          <input
            type="text"
            id="member-city"
            name="city"
            required
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors placeholder:text-neutral-400"
            placeholder={content.fields.cityPlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="member-special-talent"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.specialTalentLabel}{' '}
            <span className="text-neutral-400">
              ({content.fields.specialTalentOptionalLabel})
            </span>
          </label>
          <textarea
            id="member-special-talent"
            name="specialTalentOrHandiwork"
            rows={3}
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors resize-vertical placeholder:text-neutral-400"
            placeholder={content.fields.specialTalentPlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="member-message"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {content.fields.messageLabel}
          </label>
          <textarea
            id="member-message"
            name="message"
            rows={3}
            required
            className="w-full px-4 py-2.5 border border-neutral-300 bg-white text-neutral-900 rounded-lg focus:ring-2 focus:ring-tertiary-500 focus:border-tertiary-500 outline-none transition-colors resize-vertical placeholder:text-neutral-400"
            placeholder={content.fields.messagePlaceholder}
          />
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full px-6 py-3 text-base font-semibold text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed gradient-btn"
        >
          {status === 'sending' ? content.submittingText : content.submitText}
        </button>
      </div>
    </form>
  )
}
