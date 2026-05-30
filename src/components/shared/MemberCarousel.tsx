'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface MemberCarouselProps {
  images: string[]
}

function getPosition(offset: number) {
  if (offset === 0) {
    return {
      width: 'clamp(8rem, 13vw, 13rem)',
      height: 'clamp(8rem, 13vw, 13rem)',
      opacity: 1,
      zIndex: 20,
      ring: true,
    }
  }
  const abs = Math.abs(offset)
  if (abs === 1) {
    return {
      width: 'clamp(5.5rem, 9vw, 9rem)',
      height: 'clamp(5.5rem, 9vw, 9rem)',
      opacity: 0.7,
      zIndex: 10,
      ring: false,
    }
  }
  return {
    width: 'clamp(3.5rem, 6vw, 6rem)',
    height: 'clamp(3.5rem, 6vw, 6rem)',
    opacity: 0.35,
    zIndex: 0,
    ring: false,
  }
}

export default function MemberCarousel({ images }: MemberCarouselProps) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [next, paused])

  const slots = [-2, -1, 0, 1, 2].map((offset) => {
    const index = (active + offset + images.length) % images.length
    return { index, offset }
  })

  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      {/* Carousel track: fixed width, centered, items overlap via negative margin */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 'fit-content', maxWidth: '100%' }}
      >
        {slots.map(({ index, offset }) => {
          const pos = getPosition(offset)
          // Negative margin pulls neighbours inward so the row doesn't expand the page
          const mx =
            Math.abs(offset) === 2
              ? '-0.75rem'
              : Math.abs(offset) === 1
                ? '-0.5rem'
                : '0'
          return (
            <button
              key={`slot-${offset}`}
              onClick={() => setActive(index)}
              style={{
                width: pos.width,
                height: pos.height,
                opacity: pos.opacity,
                zIndex: pos.zIndex,
                marginLeft: offset === -2 ? '0' : mx,
                marginRight: offset === 2 ? '0' : mx,
                flexShrink: 0,
                transition: 'all 1s cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
              className={`relative rounded-full overflow-hidden ${
                pos.ring
                  ? 'ring-4 ring-accent-400 shadow-xl'
                  : 'ring-2 ring-neutral-200/40'
              }`}
              aria-label={`View member ${index + 1}`}
            >
              <Image
                src={images[index]}
                alt={`Community member ${index + 1}`}
                fill
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 208px"
              />
            </button>
          )
        })}
      </div>

      {/* Navigation dots */}
      <div className="flex gap-1.5 mt-8">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            className={`rounded-full ${
              i === active
                ? 'w-6 h-2 bg-accent-400'
                : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
            }`}
            aria-label={`Go to member ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={prev}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-neutral-700 flex items-center justify-center shadow-md transition-colors duration-200"
          aria-label="Previous member"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={next}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-neutral-700 flex items-center justify-center shadow-md transition-colors duration-200"
          aria-label="Next member"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
