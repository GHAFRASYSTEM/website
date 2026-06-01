'use client'

import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'theme-preference'

const THEME_OPTIONS: Array<{
  value: ThemeMode
  label: string
  icon: typeof SunIcon
}> = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'auto', label: 'Auto', icon: MonitorIcon },
]

function resolveTheme(mode: ThemeMode, prefersDark: boolean) {
  if (mode === 'auto') {
    return prefersDark ? 'dark' : 'light'
  }

  return mode
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const resolvedTheme = resolveTheme(mode, mediaQuery.matches)

  root.dataset.themeMode = mode
  root.classList.toggle('dark', resolvedTheme === 'dark')
  root.style.colorScheme = resolvedTheme
}

export default function ThemeModeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const storedTheme = window.localStorage.getItem(STORAGE_KEY)
    const initialTheme =
      storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'auto'
        ? storedTheme
        : (root.dataset.themeMode as ThemeMode) || 'auto'

    applyTheme(initialTheme)
    setThemeMode(initialTheme)

    const handlePreferenceChange = () => {
      if ((root.dataset.themeMode as ThemeMode) === 'auto') {
        applyTheme('auto')
      }
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handlePreferenceChange)

      return () => mediaQuery.removeEventListener('change', handlePreferenceChange)
    }

    mediaQuery.addListener(handlePreferenceChange)

    return () => mediaQuery.removeListener(handlePreferenceChange)
  }, [])

  const handleThemeChange = (nextTheme: ThemeMode) => {
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
    applyTheme(nextTheme)
    setThemeMode(nextTheme)
  }

  return (
    <div
      className="inline-flex max-w-full items-center rounded-full border border-white/15 bg-black/20 p-1 shadow-lg shadow-black/10 backdrop-blur-md"
      role="group"
      aria-label="Color theme"
    >
      {THEME_OPTIONS.map((option) => {
        const Icon = option.icon
        const isActive = themeMode === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleThemeChange(option.value)}
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.7rem] font-medium transition-colors duration-200 sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs ${
              isActive
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-white/72 hover:bg-white/10 hover:text-white'
            }`}
            aria-pressed={isActive}
            aria-label={`Switch to ${option.label.toLowerCase()} mode`}
          >
            <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v2.25M12 18.75V21M4.97 4.97l1.59 1.59M17.44 17.44l1.59 1.59M3 12h2.25M18.75 12H21M4.97 19.03l1.59-1.59M17.44 6.56l1.59-1.59M15.75 12A3.75 3.75 0 1 1 8.25 12a3.75 3.75 0 0 1 7.5 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12.8A8.98 8.98 0 0 1 11.2 3a9 9 0 1 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M3.75 5.25h16.5v10.5H3.75V5.25ZM9 18.75h6M10.5 15.75v3M13.5 15.75v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}