'use client'

import { useId, useState } from 'react'
import type { GetInvolvedContent } from '@/lib/types'

type DonationOption = GetInvolvedContent['donateOptions'][number]
const donationComingSoonMessage = 'Online donations will be available soon.'

function ComingSoonModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
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
        className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl"
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
          Donations Coming Soon
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          {donationComingSoonMessage}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-accent-400 to-accent-500 px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:from-accent-500 hover:to-accent-600 hover:shadow-md"
        >
          Close
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

function getCustomAmountError(rawAmount: string, minAmount: number) {
  if (!rawAmount.trim()) {
    return 'Enter an amount to continue.'
  }

  const amount = Number(rawAmount)
  if (!Number.isFinite(amount)) {
    return 'Enter a valid euro amount.'
  }

  if (amount < minAmount) {
    return `Minimum donation is ${formatCurrency(minAmount)}.`
  }

  return ''
}

function CustomDonationCard({
  option,
  onDonateAttempt,
}: {
  option: DonationOption
  onDonateAttempt: () => void
}) {
  const inputId = useId()
  const minAmount = option.minAmount ?? 1
  const [rawAmount, setRawAmount] = useState('')
  const [touched, setTouched] = useState(false)

  const error = getCustomAmountError(rawAmount, minAmount)
  const parsedAmount = Number(rawAmount)
  const hasValidAmount = rawAmount.trim() !== '' && !error
  const previewAmount = hasValidAmount ? formatCurrency(parsedAmount) : null

  return (
    <div className="card card-donate p-6 text-center">
      <div className="mb-2 bg-gradient-to-br from-accent-600 to-accent-400 bg-clip-text text-3xl font-bold text-transparent">
        {option.amount}
      </div>
      <p className="text-sm text-neutral-600">{option.description}</p>
      <label
        htmlFor={inputId}
        className="mt-4 block text-left text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500"
      >
        Enter amount
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
              !getCustomAmountError(rawAmount, minAmount) &&
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
              ? `Ready to donate ${previewAmount}.`
              : `Minimum donation ${formatCurrency(minAmount)}.`}
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
        className="mt-2 w-full cursor-pointer rounded-lg bg-gradient-to-r from-accent-400 to-accent-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:from-accent-500 hover:to-accent-600 hover:shadow-md disabled:cursor-not-allowed disabled:from-neutral-200 disabled:to-neutral-300 disabled:text-neutral-500 disabled:shadow-none"
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
  onDonateAttempt,
}: {
  option: DonationOption
  onDonateAttempt: () => void
}) {
  const parsedAmount = Number(option.amount)
  const formattedAmount = Number.isFinite(parsedAmount)
    ? formatCurrency(parsedAmount)
    : option.amount

  return (
    <div className="card card-donate p-6 text-center">
      <div className="mb-2 bg-gradient-to-br from-accent-600 to-accent-400 bg-clip-text text-3xl font-bold text-transparent">
        {formattedAmount}
      </div>
      <p className="text-sm text-neutral-600">{option.description}</p>
      <button
        type="button"
        onClick={onDonateAttempt}
        className="mt-4 w-full cursor-pointer rounded-lg bg-gradient-to-r from-accent-400 to-accent-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:from-accent-500 hover:to-accent-600 hover:shadow-md"
      >
        Donate {formattedAmount}
      </button>
    </div>
  )
}

export default function DonationOptions({
  options,
}: {
  options: GetInvolvedContent['donateOptions']
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {options.map((option, index) =>
          option.isCustomAmount ? (
            <CustomDonationCard
              key={`custom-${index}`}
              option={option}
              onDonateAttempt={() => setIsModalOpen(true)}
            />
          ) : (
            <FixedDonationCard
              key={`${option.amount}-${index}`}
              option={option}
              onDonateAttempt={() => setIsModalOpen(true)}
            />
          ),
        )}
      </div>
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
