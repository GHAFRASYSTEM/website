'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Activities', href: '/programs' },
  { name: 'Get Involved', href: '/get-involved' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image src="/bg-image.png" alt="" fill className="object-cover" />
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            scrolled
              ? 'bg-tertiary-900/85 backdrop-blur-xl'
              : 'bg-tertiary-900/75 backdrop-blur-sm'
          }`}
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden ring-1 ring-white/30 group-hover:ring-white/60 transition-all duration-200">
              <Image
                src="/images/extracted/image-12.jpg"
                alt="GHA-FRA Nord Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-bold text-lg text-white tracking-tight group-hover:text-accent-300 transition-colors">
                GHA-FRA
              </span>
              <span className="font-heading text-xs font-semibold text-accent-400 tracking-wide uppercase">
                Nord
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-[0.84rem] font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-accent-400 rounded-full" />
                  )}
                </Link>
              )
            })}

            <div className="ml-4 pl-4 border-l border-white/20 flex items-center gap-2">
              <Link
                href="/get-involved#membership"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[0.84rem] font-semibold text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors duration-200"
              >
                Become a Member
              </Link>
              <Link
                href="/get-involved#donate"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[0.84rem] font-semibold text-neutral-900 bg-accent-400 rounded-md hover:bg-accent-500 transition-colors duration-200"
              >
                Donate
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="flex flex-col items-center justify-center w-[18px] h-[18px] relative">
              <span
                className={`block h-[1.5px] w-[18px] bg-current rounded-full transition-all duration-300 absolute ${
                  mobileMenuOpen ? 'rotate-45 top-[8px]' : 'top-[3px]'
                }`}
              />
              <span
                className={`block h-[1.5px] w-[18px] bg-current rounded-full transition-all duration-300 absolute top-[8px] ${
                  mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-[1.5px] w-[18px] bg-current rounded-full transition-all duration-300 absolute ${
                  mobileMenuOpen ? '-rotate-45 top-[8px]' : 'top-[13px]'
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div
        className={`relative h-px transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Mobile menu panel */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-white/10 bg-tertiary-900/90 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-0.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
            <div className="pt-2 space-y-2">
              <Link
                href="/get-involved#membership"
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-semibold text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become a Member
              </Link>
              <Link
                href="/get-involved#donate"
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm font-semibold text-neutral-900 bg-accent-400 rounded-md hover:bg-accent-500 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Donate
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
