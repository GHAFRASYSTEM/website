'use client'

import { useState, type FormEvent } from 'react'
import type { GetInvolvedContent } from '@/lib/types'

const FORMSPREE_MEMBERSHIP_FORM_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_MEMBERSHIP_FORM_ID

const fieldClassName =
  'w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-tertiary-500 focus:ring-2 focus:ring-tertiary-500 dark:border-white/15 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder:text-neutral-500'

const labelClassName =
  'mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-50'

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
      const res = await fetch(
        `https://formspree.io/f/${FORMSPREE_MEMBERSHIP_FORM_ID}`,
        {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
        },
      )

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
      <div className="rounded-xl bg-tertiary-50 p-8 text-center dark:bg-tertiary-950/30">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-tertiary-100 text-tertiary-600 dark:bg-tertiary-900/45 dark:text-tertiary-300">
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
      <h3 className="font-heading text-2xl font-bold gradient-title mb-2">
        {content.title}
      </h3>
      <p className="mb-6 text-sm text-neutral-500 dark:text-neutral-300">
        {content.intro}
      </p>

      {status === 'error' && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-200">
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
              className={labelClassName}
            >
              {content.fields.firstNameLabel}
            </label>
            <input
              type="text"
              id="member-first-name"
              name="firstName"
              required
              className={fieldClassName}
              placeholder={content.fields.firstNamePlaceholder}
            />
          </div>
          <div>
            <label
              htmlFor="member-last-name"
              className={labelClassName}
            >
              {content.fields.lastNameLabel}
            </label>
            <input
              type="text"
              id="member-last-name"
              name="lastName"
              required
              className={fieldClassName}
              placeholder={content.fields.lastNamePlaceholder}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="member-email"
            className={labelClassName}
          >
            {content.fields.emailLabel}
          </label>
          <input
            type="email"
            id="member-email"
            name="email"
            required
            className={fieldClassName}
            placeholder={content.fields.emailPlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="member-phone"
            className={labelClassName}
          >
            {content.fields.phoneLabel}
          </label>
          <input
            type="tel"
            id="member-phone"
            name="phone"
            required
            className={fieldClassName}
            placeholder={content.fields.phonePlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="member-status"
            className={labelClassName}
          >
            {content.fields.statusLabel}
          </label>
          <select
            id="member-status"
            name="memberStatus"
            required
            className={`${fieldClassName} dark:[color-scheme:dark]`}
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
                className={labelClassName}
              >
                {content.fields.schoolLabel}
              </label>
              <input
                type="text"
                id="member-school"
                name="school"
                required
                className={fieldClassName}
                placeholder={content.fields.schoolPlaceholder}
              />
            </div>
            <div>
              <label
                htmlFor="member-program"
                className={labelClassName}
              >
                {content.fields.programLabel}
              </label>
              <input
                type="text"
                id="member-program"
                name="program"
                required
                className={fieldClassName}
                placeholder={content.fields.programPlaceholder}
              />
            </div>
          </div>
        )}

        {memberStatus === 'Working Professional' && (
          <div>
            <label
              htmlFor="member-role"
              className={labelClassName}
            >
              {content.fields.currentRoleLabel}
            </label>
            <input
              type="text"
              id="member-role"
              name="currentRole"
              required
              className={fieldClassName}
              placeholder={content.fields.currentRolePlaceholder}
            />
          </div>
        )}

        {memberStatus === 'Retired' && (
          <div>
            <label
              htmlFor="member-previous-role"
              className={labelClassName}
            >
              {content.fields.previousRoleLabel}
            </label>
            <input
              type="text"
              id="member-previous-role"
              name="previousRole"
              required
              className={fieldClassName}
              placeholder={content.fields.previousRolePlaceholder}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="member-city"
            className={labelClassName}
          >
            {content.fields.cityLabel}
          </label>
          <input
            type="text"
            id="member-city"
            name="city"
            required
            className={fieldClassName}
            placeholder={content.fields.cityPlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="member-special-talent"
            className={labelClassName}
          >
            {content.fields.specialTalentLabel}{' '}
            <span className="text-neutral-400 dark:text-neutral-500">
              ({content.fields.specialTalentOptionalLabel})
            </span>
          </label>
          <textarea
            id="member-special-talent"
            name="specialTalentOrHandiwork"
            rows={3}
            className={`${fieldClassName} resize-vertical`}
            placeholder={content.fields.specialTalentPlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="member-message"
            className={labelClassName}
          >
            {content.fields.messageLabel}
          </label>
          <textarea
            id="member-message"
            name="message"
            rows={3}
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
          {status === 'sending' ? content.submittingText : content.submitText}
        </button>
      </div>
    </form>
  )
}
