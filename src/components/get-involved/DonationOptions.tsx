'use client'

import { useId, useState } from 'react'
import type { GetInvolvedContent } from '@/lib/types'

type DonationOption = GetInvolvedContent['donateOptions'][number]

function interpolateAmount(template: string, amount: string) {
  return template.replace('{amount}', amount)
}

function ComingSoonModal({
  isOpen,
  onClose,
  title,
  message,
  closeText,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  closeText: string
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/65 px-4">
      <div aria-hidden="true" className="absolute inset-0" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-coming-soon-title"
        className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl dark:bg-[#101916] dark:shadow-black/40"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-100 text-accent-700">
          <svg
            aria-hidden="true"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8.25v4.5m0 3h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0Z"
            />
          </svg>
        </div>
        <h3
          id="donation-coming-soon-title"
          className="mt-4 font-heading text-2xl font-bold text-neutral-900"
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          {message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-accent-400 to-accent-500 px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:from-accent-500 hover:to-accent-600 hover:shadow-md"
        >
          {closeText}
        </button>
      </div>
    </div>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function normalizeAmountInput(value: string) {
  const sanitized = value.replace(/,/g, '.').replace(/[^\d.]/g, '')
  const [wholePart = '', ...decimalParts] = sanitized.split('.')
  const decimals = decimalParts.join('').slice(0, 2)

  if (sanitized.startsWith('.')) {
    return decimals ? `0.${decimals}` : '0.'
  }

  return decimals ? `${wholePart}.${decimals}` : wholePart
}

function getCustomAmountError(
  rawAmount: string,
  minAmount: number,
  ui: GetInvolvedContent['donationUi'],
) {
  if (!rawAmount.trim()) {
    return ui.errors.emptyAmount
  }

  const amount = Number(rawAmount)
  if (!Number.isFinite(amount)) {
    return ui.errors.invalidAmount
  }

  if (amount < minAmount) {
    return interpolateAmount(ui.errors.minimumAmount, formatCurrency(minAmount))
  }

  return ''
}

function CustomDonationCard({
  option,
  ui,
  onDonateAttempt,
}: {
  option: DonationOption
  ui: GetInvolvedContent['donationUi']
  onDonateAttempt: () => void
}) {
  const inputId = useId()
  const minAmount = option.minAmount ?? 1
  const [rawAmount, setRawAmount] = useState('')
  const [touched, setTouched] = useState(false)

  const error = getCustomAmountError(rawAmount, minAmount, ui)
  const parsedAmount = Number(rawAmount)
  const hasValidAmount = rawAmount.trim() !== '' && !error
  const previewAmount = hasValidAmount ? formatCurrency(parsedAmount) : null

  return (
    <div className="card card-donate h-fit self-start p-6 text-center">
      <div className="mb-2 bg-gradient-to-br from-accent-600 to-accent-400 bg-clip-text text-3xl font-bold text-transparent">
        {option.amount}
      </div>
      <p className="text-sm text-neutral-600">{option.description}</p>
      <label
        htmlFor={inputId}
        className="mt-4 block text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500"
      >
        {ui.customAmountLabel}
      </label>
      <div
        className={`mt-2 flex items-center rounded-lg border bg-white px-3 py-2 shadow-sm transition-colors ${
          touched && error
            ? 'border-red-300 ring-2 ring-red-100'
            : 'border-neutral-200 focus-within:border-accent-400 focus-within:ring-2 focus-within:ring-accent-100'
        }`}
      >
        <span className="mr-2 text-sm font-semibold text-neutral-500">
          &euro;
        </span>
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={rawAmount}
          onChange={(e) => setRawAmount(normalizeAmountInput(e.target.value))}
          onBlur={() => {
            setTouched(true)
            if (
              !getCustomAmountError(rawAmount, minAmount, ui) &&
              rawAmount.trim()
            ) {
              setRawAmount(Number(rawAmount).toFixed(2))
            }
          }}
          placeholder={option.inputPlaceholder || 'Enter amount'}
          aria-invalid={touched && error ? 'true' : 'false'}
          aria-describedby={`${inputId}-help ${inputId}-error`}
          className="w-full border-0 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
        />
      </div>
      <div className="mt-2 min-h-10 text-left">
        {touched && error ? (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium text-red-600"
          >
            {error}
          </p>
        ) : (
          <p id={`${inputId}-help`} className="text-xs text-neutral-500">
            {previewAmount
              ? interpolateAmount(ui.readyMessage, previewAmount)
              : interpolateAmount(ui.minimumMessage, formatCurrency(minAmount))}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setTouched(true)
          if (hasValidAmount) {
            onDonateAttempt()
          }
        }}
        disabled={!hasValidAmount}
        className="mt-2 w-full cursor-pointer rounded-lg bg-gradient-to-r from-accent-400 to-accent-500 px-4 py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:from-accent-500 hover:to-accent-600 hover:shadow-md disabled:cursor-not-allowed disabled:from-neutral-200 disabled:to-neutral-300 disabled:text-neutral-500 disabled:shadow-none"
      >
        {hasValidAmount && previewAmount
          ? `${option.buttonText || 'Donate'} ${previewAmount}`
          : option.buttonText || 'Donate'}
      </button>
    </div>
  )
}

function FixedDonationCard({
  option,
  ui,
  onDonateAttempt,
}: {
  option: DonationOption
  ui: GetInvolvedContent['donationUi']
  onDonateAttempt: () => void
}) {
  const parsedAmount = Number(option.amount)
  const formattedAmount = Number.isFinite(parsedAmount)
    ? formatCurrency(parsedAmount)
    : option.amount

  return (
    <div className="card card-donate h-fit self-start p-6 text-center">
      <div className="mb-2 bg-gradient-to-br from-accent-600 to-accent-400 bg-clip-text text-3xl font-bold text-transparent">
        {formattedAmount}
      </div>
      <p className="text-sm text-neutral-600">{option.description}</p>
      <button
        type="button"
        onClick={onDonateAttempt}
        className="mt-4 w-full cursor-pointer rounded-lg bg-gradient-to-r from-accent-400 to-accent-500 px-4 py-2.5 text-sm font-semibold text-black shadow-sm transition-all hover:from-accent-500 hover:to-accent-600 hover:shadow-md"
      >
        {ui.fixedButtonPrefix} {formattedAmount}
      </button>
    </div>
  )
}

export default function DonationOptions({
  options,
  ui,
}: {
  options: GetInvolvedContent['donateOptions']
  ui: GetInvolvedContent['donationUi']
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fixedOptions = options.filter((option) => !option.isCustomAmount)
  const customOptions = options.filter((option) => option.isCustomAmount)

  return (
    <>
      {fixedOptions.length > 0 && (
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {fixedOptions.map((option, index) => (
            <FixedDonationCard
              key={`${option.amount}-${index}`}
              option={option}
              ui={ui}
              onDonateAttempt={() => setIsModalOpen(true)}
            />
          ))}
        </div>
      )}

      {customOptions.length > 0 && (
        <div className="mx-auto mt-8 max-w-2xl rounded-[1.75rem] border border-accent-200/70 bg-linear-to-br from-white via-accent-50/60 to-primary-50/40 p-4 shadow-[0_18px_45px_rgba(26,25,24,0.08)] dark:border-accent-300/25 dark:from-[#101916] dark:via-[#161e18] dark:to-[#1f1715] dark:shadow-[0_18px_45px_rgba(0,0,0,0.34)] sm:mt-10 sm:p-5">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-accent-300/70 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">
              {ui.customSectionEyebrow}
            </span>
            <h3 className="mt-3 font-heading text-xl font-bold text-neutral-900 sm:text-2xl">
              {ui.customSectionTitle}
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-neutral-600">
              {ui.customSectionDescription}
            </p>
          </div>
          <div className="mt-5">
            {customOptions.map((option, index) => (
              <CustomDonationCard
                key={`custom-${index}`}
                option={option}
                ui={ui}
                onDonateAttempt={() => setIsModalOpen(true)}
              />
            ))}
          </div>
        </div>
      )}

      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={ui.modalTitle}
        message={ui.modalMessage}
        closeText={ui.modalCloseText}
      />
    </>
  )
}
